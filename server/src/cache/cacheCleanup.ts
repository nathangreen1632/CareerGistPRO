import { deleteCache } from "./redisCacheService.js";
import Redis from "ioredis";

const redisClient = new Redis();

const cleanupExpiredJobs : () => Promise<void> = async () : Promise<void> => {
  try {
    const keys : string[] = await redisClient.keys("job-search:*");

    for (const key of keys) {
      const jobData : string | null = await redisClient.get(key);
      if (!jobData) continue;

      const parsedData = JSON.parse(jobData);
      const age : number = (Date.now() - parsedData.timestamp) / 1000;

      if (age > 900) {
        await deleteCache(key);
      }
    }

  } catch (error) {
    console.error("❌ Error during cache cleanup:", error);
  }
};

setInterval(cleanupExpiredJobs, 15 * 60 * 1000);
