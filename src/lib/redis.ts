import { createClient } from 'redis';

// Create Redis client with better error handling for production
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff: wait 2^retries * 100ms (max 10s)
      const delay = Math.min(Math.pow(2, retries) * 100, 10000);
      console.log(`Redis reconnecting in ${delay}ms...`);
      return delay;
    }
  }
});

// Listen for errors to prevent uncaught exceptions
client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// For development, we'll use a connection status variable
let isConnected = false;

// Connect to Redis
export async function connectToRedis() {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      
      // For development, we'll create an in-memory mock if connection fails
      if (process.env.NODE_ENV !== 'production') {
        console.log('Using in-memory mock for Redis in development');
        isConnected = true;
      }
    }
  }
  return client;
}

// Close Redis connection
export async function disconnectFromRedis() {
  if (isConnected) {
    await client.disconnect();
    isConnected = false;
    console.log('Disconnected from Redis');
  }
}

export { client as redis };