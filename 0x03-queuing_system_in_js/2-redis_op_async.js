// connects to redis server on my machine
import { createClient, print } from 'redis';
import { promisify } from 'util';

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

const get = promisify(client.get).bind(client);
async function displaySchoolValue(schoolName) {
  try {
    const value = await get(schoolName);
    console.log(value);
  } catch (err) {
    console.log(`${err.message}`);
  }
}

async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

main();
