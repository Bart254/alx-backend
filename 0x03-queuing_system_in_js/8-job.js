// function that creates jobs in a queue
export default function createPushNotificationsJobs(jobs, queue) {
  if (!(jobs instanceof Array)) throw (new Error('Jobs is not an array'));

  // create jobs in queue
  jobs.forEach((value) => {
    const job = queue.create('push_notification_code_3', value);
    job.save((err) => {
      if (!err) console.log(`Notification job created: ${job.id}`);
    });
    job.on('complete', () => {
      console.log(`Notification job ${job.id} complete`);
    });
    job.on('failed', (errMessage) => {
      console.log(`Notification job ${job.id} failed: ${errMessage}`);
    });
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
}
