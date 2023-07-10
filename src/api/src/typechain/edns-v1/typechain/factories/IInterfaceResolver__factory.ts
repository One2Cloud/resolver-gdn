/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IInterfaceResolver,
  IInterfaceResolverInterface,
} from "../IInterfaceResolver";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementer",
        type: "address",
      },
    ],
    name: "InterfaceChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        internalType: "bytes4",
        name: "interfaceID",
        type: "bytes4",
      },
    ],
    name: "interfaceImplementer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IInterfaceResolver__factory {
  static readonly abi = _abi;
  static createInterface(): IInterfaceResolverInterface {
    return new utils.Interface(_abi) as IInterfaceResolverInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IInterfaceResolver {
    return new Contract(address, _abi, signerOrProvider) as IInterfaceResolver;
  }
}
