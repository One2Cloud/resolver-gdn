import * as dotenv from "dotenv";

dotenv.config();

export interface IConfig {
  redis: {
    url: string;
  };
}

const getConfig = (): IConfig => ({
  redis: {
    url: process.env.REDIS_URL || "localhost:6379",
  },
});

const config = getConfig();

export default config;
