/* Redis section */
import { createClient } from 'redis';
import { promisify } from 'util';
import { createQueue } from 'kue';
import express from 'express';

const redisClient = createClient();

function reserveSeat(number) {
  const key = 'available_seats';
  redisClient.set(key, number);
}

reserveSeat(50);

const redisGet = promisify(redisClient.get).bind(redisClient);
async function getCurrentAvailableSeats() {
  const availableSeats = await redisGet('available_seats');
  return availableSeats;
}

let reservationEnabled = true;

// kue
const queue = createQueue();

/* server */
const app = express();
const port = 1245;
const host = 'localhost';

/* routes */
// returns available seats
app.get('/available_seats', async (req, resp) => {
  const availableSeats = await getCurrentAvailableSeats();
  const data = {
    numberOfAvailableSeats: availableSeats,
  };
  resp.status(200).json(data);
});

app.get('/reserve_seat', (req, resp) => {
  if (!reservationEnabled) {
    return resp.status(200).json({ status: 'Reservation are blocked' });
  }

  const jobDetails = {
    venue: 'park',
    number: 24,
  };

  const job = queue.create('reserve_seat', jobDetails);
  job.save((err) => {
    if (!err) {
      return resp.status(200).json({
        status: 'Reservation in process',
      });
    }
    return resp.status(200).json({
      status: 'Reservation failed',
    });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errMessage}`);
  });
});

app.get('/process', (req, resp) => {
  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    const newAvailableSeats = Number(availableSeats) - 1;

    reserveSeat(newAvailableSeats);
    if (newAvailableSeats === 0) {
      reservationEnabled = false;
    }
    if (newAvailableSeats >= 0) {
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
  return resp.status(200).json({
    status: 'Queue processing',
  });
});
// run the application
app.listen(port, host, () => {
  console.log(`App listening @${host}:${port}`);
});
