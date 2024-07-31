// subscriptions and pulications in redis
import { createClient } from "redis";

// create sub
const subscriber = createClient();
subscriber.on('error', err => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// subscribe to holberton school channel
subscriber.subscribe('holberton school channel');
subscriber.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER')
    subscriber.quit();
});
