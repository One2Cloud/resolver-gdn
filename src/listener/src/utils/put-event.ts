import { SQS } from "@aws-sdk/client-sqs";
import config from "../config";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";

export const putEvent = async (provider: DomainProvider, fqdn: string, type: EventType, data: any) => {
	const sqs = new SQS({ region: process.env.AWS_REGION });
	await sqs.sendMessage({
		QueueUrl: config.sqs.handler.url,
		MessageDeduplicationId: `${provider}:${fqdn}:${type}`,
		MessageBody: JSON.stringify({ type, data }),
	});
};
