import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// list products
const listProducts = [
  {
    Id: 1,
    name: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    Id: 2,
    name: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    Id: 3,
    name: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    Id: 4,
    name: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
];

// returns item in list products that matches id
function getItemById(id) {
  return listProducts.filter((item) => item.Id === id)[0];
}

// redis client
const redisClient = createClient();

// handle connect and error
redisClient.on('connect', () => {
  console.log('Redis client connected to db');
});

redisClient.on('error', (errMessage) => {
  console.error(`Redis connection error: ${errMessage}`);
});

function reserveStockById(itemId, stock) {
  const key = `item.${itemId}`;
  redisClient.set(key, stock);
}

// promisify redis.get
const redisGet = promisify(redisClient.get).bind(redisClient);

async function getCurrentReservedStockById(itemId) {
	const key = `item.${itemId}`;
  const reservedStock = await redisGet(key);
  return reservedStock;
}

// api server
const port = 1245;
const host = 'localhost';
const app = express();

/* server routes */
// gets all products
app.get('/list_products', (req, resp) => {
  const data = listProducts.map((item) => {
    const newItemDescription = {
      itemId: item.Id,
      itemName: item.name,
      price: item.price,
      initialAvailableQuantity: item.stock,
    };
    return newItemDescription;
  });

  resp.status(200).json(data);
});

// gets a product and its reserve stock by id
app.get('/list_products/:itemId', async (req, resp) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return resp.status(200).json({ status: 'Product not found' });
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = item.stock - Number(reservedStock);

  const data = {
    itemId,
    itemName: item.name,
    price: item.price,
    initialAvailableQuantity: item.stock,
    currentQuantity: availableStock,
  };
  return resp.status(200).json(data);
});

// reserves a product
app.get('/reserve_product/:itemId', async (req, resp) => {
  const itemId = Number(req.params.itemId);
  const item = getItemById(itemId);
  if (!item) {
    return resp.status(200).json({ status: 'Product not found' });
  }

	const reservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = item.stock - Number(reservedStock);

  if (availableStock <= 0) {
    return resp.status(200).json({
      status: 'Not enough stock available',
      itemId,
    });
  }

  // reserve one item
  reserveStockById(itemId, Number(reservedStock) + 1);
  return resp.status(200).json({
    status: 'Reservation confirmed',
    itemId,
  });
});

// start the server
app.listen(port, host, () => {
  console.log(`App listening @${host}:${port}`);
});
