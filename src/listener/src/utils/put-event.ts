import { SQS } from "@aws-sdk/client-sqs";
import config from "../config";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { createLogger } from "./create-logger";
import { randomUUID } from "crypto";

const logger = createLogger({ service: "put_sqs_event" });

export const putEvent = async (
  chainId: number,
  provider: DomainProvider,
  fqdn: string,
  type: EventType,
  data: any
) => {
  const sqs = new SQS({ region: process.env.AWS_REGION });
  logger.debug(`Putting event to SQS: ${fqdn}`);
  logger.debug(`MessageDeduplication: ${`${provider}:${fqdn}:${type}`}`);
  try {
    await sqs.sendMessage({
      QueueUrl: config.sqs.handler.url,
      //   MessageGroupId: randomUUID(),
      MessageBody: JSON.stringify({
        type,
        data,
        chainId,
        mainnet: process.env.MAINNET == "1",
      }),
    });
  } catch (err) {
    console.error(err);
  }
};
