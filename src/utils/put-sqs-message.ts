import { SQS } from "@aws-sdk/client-sqs";
import { EdnsEventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { Net } from "../network-config";
import { getConfig } from "../config";

export interface IPutSqsMessageInput {
  net?: Net;
  eventType: EdnsEventType;
  provider: DomainProvider;
  chainId?: number;
  fqdn: string;
  hash?: string;
  data: any;
}

export const putSqsMessage = async (input: IPutSqsMessageInput) => {
  if (!input.net) {
    input.net = Net.MAINNET;
  }
  const config = getConfig();
  const sqs = new SQS({ region: "us-east-1" });
  console.debug(`Putting event to SQS: ${input.fqdn}`);
  console.debug(`MessageDeduplication: ${`${input.provider}:${input.fqdn}:${input.eventType}`}`);
  let queueUrl: string | undefined = undefined;
  if (input.provider === DomainProvider.EDNS) {
    // queueUrl = config.edns.sqs.queue.url;
    queueUrl = "";
  } else {
    throw new Error(`Unsupported domain provider: ${input.provider}`);
  }

  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify({
      ...input,
      mainnet: input.net === Net.MAINNET,
    }),
  });
};
