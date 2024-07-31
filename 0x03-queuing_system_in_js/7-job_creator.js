// creates multiple jobs
import { createQueue } from "kue";

const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
]

const queue = createQueue();

jobs.forEach(value => {
  const task = queue.create('push_notification_code_2', value);
  task.save(err => {
    if (!err)
      console.log(`Notification job created: ${task.id}`);
  });
  task.on('complete', () => {
    console.log(`Notification job ${task.id} completed`);
  });
  task.on('failed', (err) => {
    console.log(`Notification job ${task.id} failed: ${err}`);
  });
  task.on('progress', (progress) => {
    console.log(`Notification job ${task.id} ${progress}% complete`);
  });
});
