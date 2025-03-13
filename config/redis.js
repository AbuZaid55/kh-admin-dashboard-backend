require('dotenv').config();
const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST || null;
const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : null;
const redisUser = process.env.REDIS_USERNAME || null;
const redisPass = process.env.REDIS_PASSWORD || null;

let redisClient = null;

if (redisHost && redisPort) {
    redisClient = createClient({
        username: redisUser,
        password: redisPass,
        socket: {
            host: redisHost,
            port: redisPort
        }
    });

    redisClient.on('error', err => console.error('Redis Client Error:', err));

    redisClient.connect()
        .then(() => console.log('✅ Connected to Redis'))
        .catch(err => {
            console.error('❌ Redis Connection Failed:', err);
            redisClient = null;  // Prevent using an invalid client
        });
} else {
    console.log('⚠️ Redis is not configured. Skipping Redis connection.');
}

module.exports = redisClient;
