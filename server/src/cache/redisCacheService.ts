import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD ?? '',
  tls: process.env.REDIS_TLS ? {} : undefined as any,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('reconnecting', () => console.log('🔄 Reconnecting to Redis...'));
redis.on('error', (err) => console.error('❌ Redis error:', err));
redis.on('end', () => console.warn('⚠️ Redis connection closed'));

// --- Core cache helpers ---

export const setCache = async (key: string, value: unknown, ttl: number = 900): Promise<void> => {
  try {
    const data = { timestamp: Date.now(), value };
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('❌ Error setting cache:', error);
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    return parsed.value;
  } catch (error) {
    console.error('❌ Redis is down! Falling back to PostgreSQL.', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('❌ Error deleting cache:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    await redis.flushall();
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

// --- Specific use-case cache helper ---

export const cacheEnhancedJobData = async (query: string, data: any): Promise<void> => {
  try {
    await redis.setex(`job-enhanced:${query}`, 900, JSON.stringify(data));
  } catch (error) {
    console.error('❌ Error caching enhanced job data:', error);
  }
};

export default redis;

