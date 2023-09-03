import * as dotenv from "dotenv";

dotenv.config();

export interface IConfig {
	redis: {
		url: string;
	};
	edns: {
		sqs: {
			queue: {
				url: string;
			};
		};
	};
}

export const getConfig = (): IConfig => ({
	redis: {
		url: process.env.REDIS_URL || "localhost:6379",
	},
	edns: {
		sqs: {
			queue: {
				url: process.env.EDNS_EVENT_HANDLER_SQS_QUEUE_URL || "UNKNOWN_EDNS_EVENT_HANDLER_SQS_QUEUE_URL",
			},
		},
	},
});

const config = getConfig();

export default config;
