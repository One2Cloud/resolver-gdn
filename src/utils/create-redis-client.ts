import Redis from "ioredis";
import { getSecretInLambda } from "./get-secret";

let client: Redis | undefined;

export const createRedisClient = async () => {
  if (client) return client;
  const { REDIS_URL } = JSON.parse(await getSecretInLambda(process.env.GLOBAL_SECRET_ARN!));
  client = new Redis(REDIS_URL || "redis://localhost:6379", {
    keepAlive: 300000,
    noDelay: true,
    lazyConnect: true,
  });
  return client;
};
