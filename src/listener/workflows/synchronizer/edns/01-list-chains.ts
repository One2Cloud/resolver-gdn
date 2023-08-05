import "source-map-support/register";
import { Handler } from "aws-lambda";
import { Mainnets as EthereumMainnets, Testnets as EthereumTestnets } from "../../../src/ethereum-network-config";

interface Input {
	net: string;
}

export const index: Handler<Input, number[]> = async (event) => {
	return event.net === "mainnet" ? EthereumMainnets : EthereumTestnets;
};
