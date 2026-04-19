import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;

let redis;

if (redisUrl) {
  redis = new Redis(redisUrl);
  console.log('Redis connected successfully');
} else {
  console.warn('REDIS_URL not found. Scaling across multiple instances will not work.');
}

export default redis;
