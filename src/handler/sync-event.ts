import { Handler } from "aws-lambda";
import { Net } from "../network-config";
import { sync } from "../app/listener/main";

interface Input {
  chainId: number;
  eventType: string;
  from: number;
  to: number;
  net: Net;
}

export const index: Handler<Input> = async (input) => {
  await sync({ ...input });
};
