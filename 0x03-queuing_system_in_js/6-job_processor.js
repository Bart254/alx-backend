// processing jobs
import { createQueue } from 'kue';

const queue = createQueue();
// job processing function
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}`,
    `with message: ${message}`);
}

// process the job
queue.process('push_notification_code', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message);
  done();
});
