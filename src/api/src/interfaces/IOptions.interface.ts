import { Net } from "../network-config";

export interface IOptions {
  chainId?: number;
  net?: Net;
  coinName?: string;
  onChain: boolean;
}