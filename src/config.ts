import * as dotenv from "dotenv";

dotenv.config();

export interface IConfig {
  redis: {
    url: string;
  };
  mongodb: {
    url: string;
  };
  edns: {
    sqs: {
      queue: {
        url: string;
      };
    };
  };
  subgraph: {
    url: string;
  };
  ens_subgraph: {
    url: string;
  };
}

export const getConfig = (): IConfig => ({
  redis: {
    url: process.env.REDIS_URL || "localhost:6379",
  },
  mongodb: {
    url: process.env.MONGODB_URL || "mongodb://localhost:27017",
  },
  edns: {
    sqs: {
      queue: {
        url: process.env.EVENT_HANDLER_SQS_QUEUE_URL || "UNKNOWN_EVENT_HANDLER_SQS_QUEUE_URL",
      },
    },
  },
  subgraph: {
    url: process.env.SUBGRAPH_URL || "UNKNOWN_SUBGRAPH_URL",
  },
  ens_subgraph: {
    url: process.env.ENS_SUBGRAPH_URL || "UNKNOWN_ENS_SUBGRAPH_URL",
  },
});

const config = getConfig();

export default config;
