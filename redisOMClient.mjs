//import { Client } from 'redis-om'
const { createClient } = require('redis');
const redisserv = process.env.REDIS_HOST || '192.168.2.40';

/* create and open the Redis OM Client */
//const client = await new Client().open(`redis://${redisserv}:6379`)
const client = createClient({
    legacyMode: false,
    url : `redis://${redisserv}:6379`,
    socket: {
        connectTimeout: 100000, // Tiempo de espera en milisegundos
    },
}) 

export default client