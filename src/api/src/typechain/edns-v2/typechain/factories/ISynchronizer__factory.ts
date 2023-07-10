/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ISynchronizer, ISynchronizerInterface } from "../ISynchronizer";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "ApplicationError",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "IncomingSync",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
    ],
    name: "OutgoingSync",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
      {
        internalType: "bytes",
        name: "ews",
        type: "bytes",
      },
    ],
    name: "estimateSyncFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "chain",
        type: "uint8",
      },
    ],
    name: "getRemoteSynchronizer",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserDefaultProvider",
    outputs: [
      {
        internalType: "enum CrossChainProvider",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "chain",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "setRemoteSynchronizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
    ],
    name: "setUserDefaultProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "sender",
        type: "address",
      },
      {
        internalType: "enum SyncAction",
        name: "action",
        type: "uint8",
      },
      {
        internalType: "enum CrossChainProvider",
        name: "provider",
        type: "uint8",
      },
      {
        internalType: "enum Chain[]",
        name: "dstChains",
        type: "uint8[]",
      },
      {
        internalType: "bytes",
        name: "ews",
        type: "bytes",
      },
    ],
    name: "sync",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export class ISynchronizer__factory {
  static readonly abi = _abi;
  static createInterface(): ISynchronizerInterface {
    return new utils.Interface(_abi) as ISynchronizerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISynchronizer {
    return new Contract(address, _abi, signerOrProvider) as ISynchronizer;
  }
}
