import { SQS } from "@aws-sdk/client-sqs";
import config from "../config";
import { EdnsEventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { createLogger } from "./create-logger";

const logger = createLogger({ service: "put-sqs-message" });

export interface IPutSqsMessageInput {
	eventType: EdnsEventType;
	provider: DomainProvider;
	chainId: number;
	fqdn: string;
	hash: string;
	data: any;
}

export const putSqsMessage = async (input: IPutSqsMessageInput) => {
	const sqs = new SQS({ region: process.env.AWS_REGION || "us-east-1" });
	logger.debug(`Putting event to SQS: ${input.fqdn}`);
	logger.debug(`MessageDeduplication: ${`${input.provider}:${input.fqdn}:${input.eventType}`}`);
	try {
		await sqs.sendMessage({
			QueueUrl: config.sqs.handler.url,
			MessageBody: JSON.stringify({
				...input,
				mainnet: process.env.MAINNET == "1",
			}),
		});
	} catch (err) {
		console.error(err);
	}
};
