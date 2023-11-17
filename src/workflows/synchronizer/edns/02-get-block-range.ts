import "source-map-support/register";
import { Handler } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { setEnvironmentVariable } from "../../../utils/set-environment-variable";
import { createProvider } from "../../../utils/create-provider";
import { Net } from "../../../network-config";

interface Input {
  chainId: number;
  net: Net;
}

interface Output {
  from: number;
  to: number;
}

export const index: Handler<Input, Output> = async (event) => {
  await setEnvironmentVariable();
  if (!process.env.BLOCK_RANGE_RECORD_TABLE_NAME)
    throw new Error("BLOCK_RANGE_RECORD_TABLE_NAME is not defined");
  const ddb = new DynamoDB({ region: process.env.AWS_REGION || "us-east-1" });
  const response = await ddb.getItem({
    TableName: process.env.BLOCK_RANGE_RECORD_TABLE_NAME,
    Key: {
      chain_id: {
        N: `${event.chainId}`,
      },
    },
  });
  const provider = createProvider(event.chainId);
  if (response.Item?.from.N && response.Item?.to.N) {
    const from = parseInt(response.Item.to.N);
    const to = await provider.getBlockNumber();
    if (to - from > 300) {
      return { from: to - 300, to };
    } else {
      return { from, to };
    }
  }
  const to = await provider.getBlockNumber();
  return { from: to - 300, to };
};
