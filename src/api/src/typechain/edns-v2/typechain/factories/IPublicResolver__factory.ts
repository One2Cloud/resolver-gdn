/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IPublicResolver,
  IPublicResolverInterface,
} from "../IPublicResolver";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "SetAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "coin",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "address_",
        type: "bytes",
      },
    ],
    name: "SetMultiCoinAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "SetNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "SetReverseAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "string",
        name: "text",
        type: "string",
      },
    ],
    name: "SetText",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "type_",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "string",
        name: "text",
        type: "string",
      },
    ],
    name: "SetTypedText",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "UnsetAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "coin",
        type: "uint256",
      },
    ],
    name: "UnsetMultiCoinAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "UnsetNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "UnsetReverseAddress",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "UnsetText",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "type_",
        type: "bytes",
      },
    ],
    name: "UnsetTypedText",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "getAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "coin",
        type: "uint256",
      },
    ],
    name: "getMultiCoinAddress",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "getNFT",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "contract_",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        internalType: "struct INFTResolver.NFT",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "getReverseAddress",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "getText",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "type_",
        type: "bytes",
      },
    ],
    name: "getTypedText",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "setAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "coin",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "address_",
        type: "bytes",
      },
    ],
    name: "setMultiCoinAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "contract_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "setNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "setReverseAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
    ],
    name: "setText",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "type_",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
    ],
    name: "setTypedText",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "unsetAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "coin",
        type: "uint256",
      },
    ],
    name: "unsetMultiCoinAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "unsetNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "unsetReverseAddress",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "unsetText",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "host",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "type_",
        type: "bytes",
      },
    ],
    name: "unsetTypedText",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export class IPublicResolver__factory {
  static readonly abi = _abi;
  static createInterface(): IPublicResolverInterface {
    return new utils.Interface(_abi) as IPublicResolverInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPublicResolver {
    return new Contract(address, _abi, signerOrProvider) as IPublicResolver;
  }
}
