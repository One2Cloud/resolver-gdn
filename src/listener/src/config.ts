export interface IConfig {
	redis: {
		url: string;
	};
	sqs: {
		handler: {
			url: string;
		};
	};
}

const config: IConfig = {
	redis: {
		url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
	},
	sqs: {
		handler: {
			url: process.env.SQS_HANDLER_URL || "UNKNOWN_SQS_HANDLER_URL",
		},
	},
};

export default config;
