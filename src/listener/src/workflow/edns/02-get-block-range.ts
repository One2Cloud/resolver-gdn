import "source-map-support/register";
import { Handler } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { getProvider } from "../../../../api/src/utils/get-provider";

interface Input {
	chainId: number;
}

interface Output {
	from: number;
	to: number;
}

export const index: Handler<Input, Output> = async (event) => {
	if (!process.env.EDNS_BLOCK_RANGE_RECORD_TABLE_NAME) throw new Error("EDNS_BLOCK_RANGE_RECORD_TABLE_NAME is not defined");
	const ddb = new DynamoDB({ region: process.env.AWS_REGION || "us-east-1" });
	const response = await ddb.getItem({
		TableName: process.env.EDNS_BLOCK_RANGE_RECORD_TABLE_NAME,
		Key: {
			chainId: {
				N: `${event.chainId}`,
			},
		},
	});
	if (response.Item?.from.N && response.Item?.to.N) {
		const from = parseInt(response.Item.from.N);
		const to = parseInt(response.Item.to.N);
		return { from, to };
	}
	const provider = getProvider(event.chainId);
	const to = await provider.getBlockNumber();
	return { from: to - 10000, to };
};
