/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IRouterCrossTalkUpgradeable,
  IRouterCrossTalkUpgradeableInterface,
} from "../IRouterCrossTalkUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "sourceChain",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "destChain",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sourceAddress",
        type: "address",
      },
    ],
    name: "CrossTalkReceive",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "sourceChain",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "uint8",
        name: "destChain",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sourceAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "destinationAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes4",
        name: "_selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "CrossTalkSend",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "ChainID",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "linkedContract",
        type: "address",
      },
    ],
    name: "Linkevent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint8",
        name: "ChainID",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "address",
        name: "linkedContract",
        type: "address",
      },
    ],
    name: "Unlinkevent",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_chainID",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_linkedContract",
        type: "address",
      },
    ],
    name: "Link",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_chainID",
        type: "uint8",
      },
    ],
    name: "Unlink",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "fetchExecutes",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "chainID",
            type: "uint8",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
        ],
        internalType: "struct iRouterCrossTalkUpgradeable.ExecutesStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fetchFeeToken",
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
    inputs: [],
    name: "fetchHandler",
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
        internalType: "uint8",
        name: "_chainID",
        type: "uint8",
      },
    ],
    name: "fetchLink",
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
    inputs: [],
    name: "fetchLinkSetter",
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
        internalType: "uint8",
        name: "srcChainID",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "srcAddress",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "routerSync",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IRouterCrossTalkUpgradeable__factory {
  static readonly abi = _abi;
  static createInterface(): IRouterCrossTalkUpgradeableInterface {
    return new utils.Interface(_abi) as IRouterCrossTalkUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IRouterCrossTalkUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IRouterCrossTalkUpgradeable;
  }
}
