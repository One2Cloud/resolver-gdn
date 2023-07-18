/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  ITldRecordFacet,
  ITldRecordFacetInterface,
} from "../ITldRecordFacet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum TldClass",
        name: "class_",
        type: "uint8",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "NewTld",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "RemoveTld",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enable",
        type: "bool",
      },
    ],
    name: "SetTldEnable",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "SetTldExpiry",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "SetTldOwner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "resolver",
        type: "address",
      },
    ],
    name: "SetTldResolver",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "wrapper",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "enable",
        type: "bool",
      },
    ],
    name: "SetTldWrapper",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getChains",
    outputs: [
      {
        internalType: "enum Chain[]",
        name: "",
        type: "uint8[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getClass",
    outputs: [
      {
        internalType: "enum TldClass",
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
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getExpiry",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getOwner",
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
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getResolver",
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
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
    ],
    name: "getTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "getWrapper",
    outputs: [
      {
        components: [
          {
            internalType: "bool",
            name: "enable",
            type: "bool",
          },
          {
            internalType: "address",
            name: "address_",
            type: "address",
          },
        ],
        internalType: "struct WrapperRecord",
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
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "isEnable",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
    ],
    name: "isExists",
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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "enable",
        type: "bool",
      },
    ],
    name: "setEnable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "setExpiry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain[]",
        name: "chains",
        type: "uint8[]",
      },
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
      {
        internalType: "bool",
        name: "enable",
        type: "bool",
      },
      {
        internalType: "enum TldClass",
        name: "class_",
        type: "uint8",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "resolver",
        type: "address",
      },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "tld",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "enable_",
        type: "bool",
      },
      {
        internalType: "address",
        name: "wrapper",
        type: "address",
      },
    ],
    name: "setWrapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ITldRecordFacet__factory {
  static readonly abi = _abi;
  static createInterface(): ITldRecordFacetInterface {
    return new utils.Interface(_abi) as ITldRecordFacetInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITldRecordFacet {
    return new Contract(address, _abi, signerOrProvider) as ITldRecordFacet;
  }
}