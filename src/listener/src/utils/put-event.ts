import { SQS } from "@aws-sdk/client-sqs";
import config from "../config";
import { EventType } from "../constants/event-type.constant";
import { DomainProvider } from "../constants/domain-provider.constant";
import { createLogger } from "./create-logger";
import { buffer } from "stream/consumers";

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
  try {
    await sqs.sendMessage({
      QueueUrl: config.sqs.handler.url,
      MessageDeduplicationId: `${Buffer.from(
        `${provider}:${fqdn}:${type}`
      ).toString("hex")}`,
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
