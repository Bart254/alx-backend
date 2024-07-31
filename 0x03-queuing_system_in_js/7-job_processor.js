// processing multiple jobs while tracking progress

import { createQueue } from "kue";

const blacklisted = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  // track job progress
  job.progress(0, 100);

  if (blacklisted.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  
  // print when progress is 50%
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: `,
    message);

  done();
}

// queue for processing
const queue = createQueue();
queue.process('push_notification_code_2', 2, (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
})
