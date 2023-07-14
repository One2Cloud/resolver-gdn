import Redis from "ioredis";

// --- For dev --- //
import { REDIS_ENDPOINT } from "../useContract";
// --- For dev --- //

let client: Redis | undefined;

export const createRedisClient = () => {
  if (client) return client;
  // client = new Redis(process.env.REDIS_URL || "localhost:6379", { keepAlive: 300000, noDelay: true, lazyConnect: true });
  client = new Redis(REDIS_ENDPOINT || "localhost:6379", { keepAlive: 300000, noDelay: true, lazyConnect: true });
  return client;
};
