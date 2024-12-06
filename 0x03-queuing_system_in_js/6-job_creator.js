// creating a job using kue
import { createQueue } from 'kue';

const queue = createQueue();
const data = {
  phoneNumber: '0791483954',
  message: 'You are kidding',
};
const job = queue.create('push_notification_code', data);

// save job
job.save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

// handle complete event
job.on('complete', () => {
  console.log('Notification job completed');
});

// handle fail events
job.on('failed', () => {
  console.log('Notification job failed');
});
