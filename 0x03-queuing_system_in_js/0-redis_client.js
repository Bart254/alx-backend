// connects to redis server on my machine
import { createClient } from 'redis';

const client = createClient();

// handle error event
client.on('error', err => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// handle connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
