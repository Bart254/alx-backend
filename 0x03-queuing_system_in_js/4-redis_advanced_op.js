// storing hash values with redis
// create the client
import { createClient, print } from 'redis';

const client = createClient();

// handle error and connect events
client.on('error', err => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// create a hash
const fieldValue = {
  'Portland': 50,
  'Seattle': 80,
  'New York': 20,
  'Bogota': 20,
  'Cali': 40,
  'Paris': 2
};

for (const [field, value] of Object.entries(fieldValue)) {
  client.hset('HolbertonSchools', field, value, print);
}

// display/ retrieve hash values
client.hgetall('HolbertonSchools', (err, data) => {
  if (!err)
    console.log(data);
})
