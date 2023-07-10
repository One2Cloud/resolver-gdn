import { Net } from "../network-config";

export interface IOptions {
  chainId?: number;
  net?: Net;
  onChain: string;
}