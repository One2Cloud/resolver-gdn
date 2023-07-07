import { SQS } from "@aws-sdk/client-sqs";
import config from "../config";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { createLogger } from "./create-logger";

const logger = createLogger({ service: "put_sqs_event" });

export const putEvent = async (mainnet: boolean, provider: DomainProvider, fqdn: string, type: EventType, data: any) => {
	const sqs = new SQS({ region: process.env.AWS_REGION });
	logger.debug(`Putting event to SQS: ${fqdn}`);
	try {
		await sqs.sendMessage({
			QueueUrl: config.sqs.handler.url,
			MessageDeduplicationId: `${provider}:${fqdn}:${type}`,
			MessageBody: JSON.stringify({ type, data, mainnet: !!mainnet }),
		});
	} catch (err) {
		console.error(err);
	}
};
