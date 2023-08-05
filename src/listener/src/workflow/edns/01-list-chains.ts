import "source-map-support/register";
import { Handler } from "aws-lambda";
import { EdnsMainnets, EdnsTestnets } from "../../../../api/src/network-config";

interface Input {
	net: string;
}

export const index: Handler<Input, number[]> = async (event) => {
	return event.net === "mainnet" ? EdnsMainnets : EdnsTestnets;
};
