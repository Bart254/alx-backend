// testing jobs
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';

const queue = createQueue();

describe('test createPushNotificationsJobs', () => {
  before(() => {
  	queue.testMode.enter();
  });

  afterEach(() => {
  	queue.testMode.clear();
  });

  after(() => {
  	queue.testMode.exit();
  });

  it('passing a non array throws an error', () => {
    const jobs = {
      number: '0791472967',
      message: 'Good morning',
    };
    expect(() => createPushNotificationsJobs(jobs, queue)).to.throw('Jobs is not an array');
  });

  it('create two new jobs to the queue', () => {
    const jobs = [
      {
        number: '0791234567',
        message: 'Love thy neighbour',
      },
      {
        number: '0710711645',
        message: 'Push the button',
      },
    ];
    createPushNotificationsJobs(jobs, queue);
  	expect(queue.testMode.jobs.length).to.equal(2);
  	expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
  	expect(queue.testMode.jobs[0].data).to.equal(jobs[0]);
    expect(queue.testMode.jobs[1].data).to.equal(jobs[1]);
  });

	it('Test that no jobs are created', () => {
		createPushNotificationsJobs([], queue);
		expect(queue.testMode.jobs.length).to.equal(0);
	});
});
