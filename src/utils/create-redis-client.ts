import Redis from "ioredis";
// import { Redis } from "@upstash/redis";
import { getSecret, getSecretInLambda } from "./get-secret";

let client: Redis | undefined;

export const createRedisClient = async () => {
  // if (client) return client;
  // const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = JSON.parse(
  //   process.env.AWS_LAMBDA_FUNCTION_NAME ? await getSecretInLambda(process.env.GLOBAL_SECRET_ARN!) : await getSecret(process.env.GLOBAL_SECRET_ARN!),
  // );
  // client = new Redis({
  //   url: UPSTASH_REDIS_REST_URL,
  //   token: UPSTASH_REDIS_REST_TOKEN,
  // });
  // return client;
  const { REDIS_URL } = JSON.parse(await getSecret(process.env.GLOBAL_SECRET_ARN!));
  console.log({ REDIS_URL });
  client = new Redis(REDIS_URL || "redis://localhost:6379", {
    keepAlive: 300000,
    noDelay: true,
    lazyConnect: true,
  });
  return client;
};
