import { SQS } from "@aws-sdk/client-sqs";
import { EdnsEventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { Net } from "../network-config";

export interface IPutSqsMessageInput {
  net?: Net;
  eventType: EdnsEventType;
  provider: DomainProvider;
  chainId?: number;
  fqdn: string;
  hash: string;
  data: any;
}

export const putSqsMessage = async (input: IPutSqsMessageInput) => {
  if (!input.net) {
    input.net = Net.MAINNET;
  }
  const sqs = new SQS({ region: process.env.AWS_REGION || "us-east-1" });
  console.debug(`Putting event to SQS: ${input.fqdn}`);
  console.debug(`MessageDeduplication: ${`${input.provider}:${input.fqdn}:${input.eventType}`}`);
  try {
    await sqs.sendMessage({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify({
        ...input,
        mainnet: input.net === Net.MAINNET,
      }),
    });
  } catch (err) {
    console.error(err);
  }
};
