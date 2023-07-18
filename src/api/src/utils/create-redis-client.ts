import Redis from "ioredis";

// --- For dev --- //
// --- For dev --- //

let client: Redis | undefined;

export const createRedisClient = () => {
  if (client) return client;
  client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", { keepAlive: 300000, noDelay: true, lazyConnect: true });
  return client;
};
