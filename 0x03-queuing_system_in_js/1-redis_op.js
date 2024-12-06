// connects to redis server on my machine
import { createClient, print } from 'redis';

const client = createClient();

// handle error event
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err.message}`);
});

// handle connect event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    console.log(reply);
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
