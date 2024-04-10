import * as dotenv from "dotenv";

dotenv.config();

export interface IConfig {
  redis: {
    url: string;
  };
  subgraph: {
    mainnet: {
      http: {
        endpoint: string;
      };
      websocket: {
        endpoint: string;
      };
    };
    testnet: {
      http: {
        endpoint: string;
      };
      websocket: {
        endpoint: string;
      };
    };
  };
}

export const getConfig = (): IConfig => ({
  redis: {
    url: process.env.REDIS_URL || "localhost:6379",
  },
  subgraph: {
    mainnet: {
      http: {
        endpoint: process.env.THE_GRAPH_QUERY_HTTP_API_MAINNET_ENDPOINT || "http://localhost:8080",
      },
      websocket: {
        endpoint: process.env.THE_GRAPH_QUERY_WEBSOCKET_API_MAINNET_ENDPOINT || "ws://localhost:8081",
      },
    },
    testnet: {
      http: {
        endpoint: process.env.THE_GRAPH_QUERY_HTTP_API_TESTNET_ENDPOINT || "http://localhost:8080",
      },
      websocket: {
        endpoint: process.env.THE_GRAPH_QUERY_WEBSOCKET_API_TESTNET_ENDPOINT || "ws://localhost:8081",
      },
    },
  },
});

const config = getConfig();

export default config;
