// import Redis from "ioredis";
import { Redis } from "@upstash/redis";
import { getSecret, getSecretInLambda } from "./get-secret";

let client: Redis | undefined;

export const createRedisClient = async () => {
  if (client) return client;
  let { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    const secrets = JSON.parse(process.env.AWS_LAMBDA_FUNCTION_NAME ? await getSecretInLambda(process.env.GLOBAL_SECRET_ARN!) : await getSecret(process.env.GLOBAL_SECRET_ARN!));
    UPSTASH_REDIS_REST_URL = secrets.UPSTASH_REDIS_REST_URL as string;
    UPSTASH_REDIS_REST_TOKEN = secrets.UPSTASH_REDIS_REST_TOKEN as string;
  }
  client = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });
  return client;
};
