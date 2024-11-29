import { Client } from 'redis-om'
const redisserv = process.env.REDIS_HOST || '192.168.2.40';

/* create and open the Redis OM Client */
const client = await new Client().open(`redis://${redisserv}:6379`)

export default client