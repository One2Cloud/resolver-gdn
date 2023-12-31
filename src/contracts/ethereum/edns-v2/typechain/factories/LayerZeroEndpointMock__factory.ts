/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LayerZeroEndpointMock,
  LayerZeroEndpointMockInterface,
} from "../LayerZeroEndpointMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_chainId",
        type: "uint16",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "srcChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "srcAddress",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dstAddress",
        type: "address",
      },
    ],
    name: "PayloadCleared",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "srcChainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "srcAddress",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dstAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "PayloadStored",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "chainId",
        type: "uint16",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "srcAddress",
        type: "bytes",
      },
    ],
    name: "UaForceResumeReceive",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_a",
        type: "address",
      },
    ],
    name: "addrToPackedBytes",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "blockNextMsg",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
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
    name: "estimateFees",
    outputs: [
      {
        internalType: "uint256",
        name: "_nativeFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_zroFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
    ],
    name: "forceResumeReceive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "getConfig",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_chainID",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
    ],
    name: "getInboundNonce",
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
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
    ],
    name: "getLengthOfQueue",
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
        internalType: "uint16",
        name: "_chainID",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "_srcAddress",
        type: "address",
      },
    ],
    name: "getOutboundNonce",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getReceiveLibraryAddress",
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
        name: "",
        type: "address",
      },
    ],
    name: "getReceiveVersion",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getSendLibraryAddress",
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
        name: "",
        type: "address",
      },
    ],
    name: "getSendVersion",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
    ],
    name: "hasStoredPayload",
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
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "inboundNonce",
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
    inputs: [],
    name: "isReceivingPayload",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "isSendingPayload",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lzEndpointLookup",
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
    name: "mockBlockConfirmations",
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
    inputs: [],
    name: "mockChainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mockLayerZeroVersion",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mockLibraryVersion",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mockOracle",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mockRelayer",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mockStaticNativeFee",
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
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "msgsToDeliver",
    outputs: [
      {
        internalType: "address",
        name: "dstAddress",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nativeFee",
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
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "outboundNonce",
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
        internalType: "bytes",
        name: "_b",
        type: "bytes",
      },
    ],
    name: "packedBytesToAddr",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_dstAddress",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_nonce",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
    ],
    name: "receivePayload",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
    ],
    name: "retryPayload",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_chainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_destination",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_adapterParams",
        type: "bytes",
      },
    ],
    name: "send",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "setConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "destAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "lzEndpointAddr",
        type: "address",
      },
    ],
    name: "setDestLzEndpoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_nativeFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_zroFee",
        type: "uint256",
      },
    ],
    name: "setEstimatedFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "setReceiveVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "setSendVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "storedPayload",
    outputs: [
      {
        internalType: "uint64",
        name: "payloadLength",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "dstAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "payloadHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "zroFee",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051611d95380380611d9583398101604081905261002f9161005b565b602a60055560068054600161ffff19918216811790925581541661ffff92909216919091179055610086565b60006020828403121561006d57600080fd5b815161ffff8116811461007f57600080fd5b9392505050565b611d00806100956000396000f3fe6080604052600436106102305760003560e01c8063996f79c01161012e578063ca066b35116100ab578063db14f3051161006f578063db14f305146107ae578063e961a952146107c9578063e97a448a14610734578063f5ecbdbc146107df578063fdc07c701461081157600080fd5b8063ca066b3514610734578063cbed8b9c14610748578063d23104f114610769578063da1a7c9a14610288578063dab312771461078857600080fd5b8063b2086499116100f2578063b208649914610641578063c08f15a114610682578063c2fa4813146106cb578063c5803100146106eb578063c81b383a146106fe57600080fd5b8063996f79c0146105da5780639c729da114610445578063aaff5f16146105f0578063af406aa514610610578063b12107701461062657600080fd5b806340a7bb10116101bc57806371ba2fd61161018057806371ba2fd61461044557806376a386dc146104655780637a145748146104fe5780637f6df8e6146105685780639924d33b1461058857600080fd5b806340a7bb101461037f57806342d65a8d146103b45780634f055b04146103d45780635952c4ec146103f45780635b3011351461041857600080fd5b80630eaf6ea6116102035780630eaf6ea6146102e157806310ddb1371461026857806312a9ee6b146103115780632646af08146103405780633408e4701461036657600080fd5b806305bc710f1461023557806307e0db1714610268578063096568f61461028857806309eddf54146102a9575b600080fd5b34801561024157600080fd5b506004546102509061ffff1681565b60405161ffff90911681526020015b60405180910390f35b34801561027457600080fd5b5061028661028336600461138c565b50565b005b34801561029457600080fd5b506102506102a33660046113c3565b50600190565b3480156102b557600080fd5b506102c96102c4366004611428565b610831565b6040516001600160a01b03909116815260200161025f565b3480156102ed57600080fd5b506103016102fc366004611469565b610850565b604051901515815260200161025f565b34801561031d57600080fd5b5061033161032c36600461155d565b610895565b60405161025f939291906115f9565b34801561034c57600080fd5b5061028661035b366004611635565b600791909155600855565b34801561037257600080fd5b5060015461ffff16610250565b34801561038b57600080fd5b5061039f61039a366004611657565b610992565b6040805192835260208301919091520161025f565b3480156103c057600080fd5b506102866103cf366004611469565b6109b5565b3480156103e057600080fd5b506002546102c9906001600160a01b031681565b34801561040057600080fd5b5061040a60035481565b60405190815260200161025f565b34801561042457600080fd5b506104386104333660046113c3565b610afc565b60405161025f91906116f7565b34801561045157600080fd5b506102c96104603660046113c3565b503090565b34801561047157600080fd5b506104d161048036600461170a565b600c6020908152600092835260409092208151808301840180519281529084019290930191909120915280546001909101546001600160401b03821691600160401b90046001600160a01b03169083565b604080516001600160401b0390941684526001600160a01b0390921660208401529082015260600161025f565b34801561050a57600080fd5b50610550610519366004611757565b61ffff82166000908152600b602090815260408083206001600160a01b03851684529091529020546001600160401b031692915050565b6040516001600160401b03909116815260200161025f565b34801561057457600080fd5b5061040a610583366004611469565b610b2e565b34801561059457600080fd5b506105506105a336600461170a565b600a60209081526000928352604090922081518083018401805192815290840192909301919091209152546001600160401b031681565b3480156105e657600080fd5b5061040a60075481565b3480156105fc57600080fd5b5061028661060b36600461178e565b610b6a565b34801561061c57600080fd5b5061040a60085481565b34801561063257600080fd5b506006546102509061ffff1681565b34801561064d57600080fd5b5061055061065c366004611757565b600b6020908152600092835260408084209091529082529020546001600160401b031681565b34801561068e57600080fd5b5061028661069d36600461180e565b6001600160a01b03918216600090815260208190526040902080546001600160a01b03191691909216179055565b3480156106d757600080fd5b506102866106e636600461182c565b610d80565b6102866106f93660046118e3565b610ef1565b34801561070a57600080fd5b506102c96107193660046113c3565b6000602081905290815260409020546001600160a01b031681565b34801561074057600080fd5b506000610301565b34801561075457600080fd5b506102866107633660046119af565b50505050565b34801561077557600080fd5b506102866009805460ff19166001179055565b34801561079457600080fd5b506001546102c9906201000090046001600160a01b031681565b3480156107ba57600080fd5b506001546102509061ffff1681565b3480156107d557600080fd5b5061040a60055481565b3480156107eb57600080fd5b506104386107fa366004611a16565b604080516020810190915260008152949350505050565b34801561081d57600080fd5b5061055061082c366004611469565b6110eb565b6000806040516002840160028603823760091901519150505b92915050565b61ffff83166000908152600c602052604080822090518291906108769086908690611a63565b9081526040519081900360200190206001015415159150509392505050565b600d60209081526000848152604090208351808501830180519281529083019285019290922091528054829081106108cc57600080fd5b6000918252602090912060029091020180546001820180546001600160a01b0383169650600160a01b9092046001600160401b0316945091925061090f90611a73565b80601f016020809104026020016040519081016040528092919081815260200182805461093b90611a73565b80156109885780601f1061095d57610100808354040283529160200191610988565b820191906000526020600020905b81548152906001019060200180831161096b57829003601f168201915b5050505050905083565b60008084516007546109a49190611ac3565b915060085490509550959350505050565b61ffff83166000908152600c602052604080822090516109d89085908590611a63565b9081526040519081900360200190206001810154909150610a405760405162461bcd60e51b815260206004820152601c60248201527f4c617965725a65726f3a206e6f2073746f726564207061796c6f61640000000060448201526064015b60405180910390fd5b8054600160401b90046001600160a01b03163314610aa05760405162461bcd60e51b815260206004820152601960248201527f4c617965725a65726f3a20696e76616c69642063616c6c6572000000000000006044820152606401610a37565b80546001600160e01b0319168155600060018201556040517f23d2684f396e92a6e2ff2d16f98e6fea00d50cb27a64b531bc0748f730211f9890610ae990869086908690611b03565b60405180910390a1610763848484611130565b6040805160609290921b6bffffffffffffffffffffffff19166020830152805180830360140181526034909201905290565b61ffff83166000908152600d60205260408082209051610b519085908590611a63565b9081526040519081900360200190205490509392505050565b61ffff85166000908152600c60205260408082209051610b8d9087908790611a63565b9081526040519081900360200190206001810154909150610bf05760405162461bcd60e51b815260206004820152601c60248201527f4c617965725a65726f3a206e6f2073746f726564207061796c6f6164000000006044820152606401610a37565b80546001600160401b031682148015610c23575080600101548383604051610c19929190611a63565b6040518091039020145b610c6f5760405162461bcd60e51b815260206004820152601a60248201527f4c617965725a65726f3a20696e76616c6964207061796c6f61640000000000006044820152606401610a37565b80546001600160e01b03198116825560006001830181905561ffff88168152600a60205260408082209051600160401b9093046001600160a01b031692610cb99089908990611a63565b90815260405190819003602001812054621d356760e01b82526001600160401b031691506001600160a01b03831690621d356790610d05908b908b908b9087908c908c90600401611b21565b600060405180830381600087803b158015610d1f57600080fd5b505af1158015610d33573d6000803e3d6000fd5b505050507f612434f39581c8e7d99746c9c20c6eb0ce8c0eb99f007c5719d620841370957d8888888486604051610d6e959493929190611b6e565b60405180910390a15050505050505050565b61ffff88166000908152600c60205260408082209051610da3908a908a90611a63565b90815260200160405180910390209050600a60008a61ffff1661ffff1681526020019081526020016000208888604051610dde929190611a63565b9081526040519081900360200190208054600090610e04906001600160401b0316611bb7565b91906101000a8154816001600160401b0302191690836001600160401b0316021790556001600160401b0316856001600160401b031614610e805760405162461bcd60e51b81526020600482015260166024820152754c617965725a65726f3a2077726f6e67206e6f6e636560501b6044820152606401610a37565b604051621d356760e01b81526001600160a01b03871690621d356790610eb4908c908c908c908b908a908a90600401611b21565b600060405180830381600087803b158015610ece57600080fd5b505af1158015610ee2573d6000803e3d6000fd5b50505050505050505050505050565b6000610efd8888610831565b6001600160a01b038082166000908152602081905260409020549192501680610f8e5760405162461bcd60e51b815260206004820152603760248201527f4c617965725a65726f4d6f636b3a2064657374696e6174696f6e204c6179657260448201527f5a65726f20456e64706f696e74206e6f7420666f756e640000000000000000006064820152608401610a37565b600754610f9c908790611ac3565b341015610ffd5760405162461bcd60e51b815260206004820152602960248201527f4c617965725a65726f4d6f636b3a206e6f7420656e6f756768206e617469766560448201526820666f72206665657360b81b6064820152608401610a37565b61ffff8a166000908152600b60209081526040808320338452909152812080548290611031906001600160401b0316611bb7565b82546001600160401b038083166101009490940a93840293021916919091179091559050600061106033610afc565b9050826001600160a01b031663c2fa4813600160009054906101000a900461ffff1683878660008f8f6040518863ffffffff1660e01b81526004016110ab9796959493929190611bdd565b600060405180830381600087803b1580156110c557600080fd5b505af11580156110d9573d6000803e3d6000fd5b50505050505050505050505050505050565b61ffff83166000908152600a6020526040808220905161110e9085908590611a63565b908152604051908190036020019020546001600160401b031690509392505050565b61ffff83166000908152600d602052604080822090516111539085908590611a63565b908152602001604051809103902090505b805415610763578054600090829061117e90600190611c40565b8154811061118e5761118e611c53565b600091825260209182902060408051606081018252600290930290910180546001600160a01b03811684526001600160401b03600160a01b9091041693830193909352600183018054929392918401916111e790611a73565b80601f016020809104026020016040519081016040528092919081815260200182805461121390611a73565b80156112605780601f1061123557610100808354040283529160200191611260565b820191906000526020600020905b81548152906001019060200180831161124357829003601f168201915b505050505081525050905080600001516001600160a01b0316621d3567868686856020015186604001516040518663ffffffff1660e01b81526004016112aa959493929190611c69565b600060405180830381600087803b1580156112c457600080fd5b505af11580156112d8573d6000803e3d6000fd5b50505050818054806112ec576112ec611cb4565b60008281526020812060026000199093019283020180546001600160e01b03191681559061131d6001830182611327565b5050905550611164565b50805461133390611a73565b6000825580601f10611343575050565b601f01602090049060005260206000209081019061028391905b80821115611371576000815560010161135d565b5090565b803561ffff8116811461138757600080fd5b919050565b60006020828403121561139e57600080fd5b6113a782611375565b9392505050565b6001600160a01b038116811461028357600080fd5b6000602082840312156113d557600080fd5b81356113a7816113ae565b60008083601f8401126113f257600080fd5b5081356001600160401b0381111561140957600080fd5b60208301915083602082850101111561142157600080fd5b9250929050565b6000806020838503121561143b57600080fd5b82356001600160401b0381111561145157600080fd5b61145d858286016113e0565b90969095509350505050565b60008060006040848603121561147e57600080fd5b61148784611375565b925060208401356001600160401b038111156114a257600080fd5b6114ae868287016113e0565b9497909650939450505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126114e257600080fd5b81356001600160401b03808211156114fc576114fc6114bb565b604051601f8301601f19908116603f01168101908282118183101715611524576115246114bb565b8160405283815286602085880101111561153d57600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060006060848603121561157257600080fd5b61157b84611375565b925060208401356001600160401b0381111561159657600080fd5b6115a2868287016114d1565b925050604084013590509250925092565b6000815180845260005b818110156115d9576020818501810151868301820152016115bd565b506000602082860101526020601f19601f83011685010191505092915050565b6001600160a01b03841681526001600160401b038316602082015260606040820181905260009061162c908301846115b3565b95945050505050565b6000806040838503121561164857600080fd5b50508035926020909101359150565b600080600080600060a0868803121561166f57600080fd5b61167886611375565b94506020860135611688816113ae565b935060408601356001600160401b03808211156116a457600080fd5b6116b089838a016114d1565b94506060880135915081151582146116c757600080fd5b909250608087013590808211156116dd57600080fd5b506116ea888289016114d1565b9150509295509295909350565b6020815260006113a760208301846115b3565b6000806040838503121561171d57600080fd5b61172683611375565b915060208301356001600160401b0381111561174157600080fd5b61174d858286016114d1565b9150509250929050565b6000806040838503121561176a57600080fd5b61177383611375565b91506020830135611783816113ae565b809150509250929050565b6000806000806000606086880312156117a657600080fd5b6117af86611375565b945060208601356001600160401b03808211156117cb57600080fd5b6117d789838a016113e0565b909650945060408801359150808211156117f057600080fd5b506117fd888289016113e0565b969995985093965092949392505050565b6000806040838503121561182157600080fd5b8235611773816113ae565b60008060008060008060008060c0898b03121561184857600080fd5b61185189611375565b975060208901356001600160401b038082111561186d57600080fd5b6118798c838d016113e0565b909950975060408b0135915061188e826113ae565b90955060608a01359080821682146118a557600080fd5b90945060808a0135935060a08a013590808211156118c257600080fd5b506118cf8b828c016113e0565b999c989b5096995094979396929594505050565b60008060008060008060008060c0898b0312156118ff57600080fd5b61190889611375565b975060208901356001600160401b038082111561192457600080fd5b6119308c838d016113e0565b909950975060408b013591508082111561194957600080fd5b6119558c838d016113e0565b909750955060608b0135915061196a826113ae565b90935060808a01359061197c826113ae565b90925060a08a0135908082111561199257600080fd5b5061199f8b828c016114d1565b9150509295985092959890939650565b600080600080608085870312156119c557600080fd5b6119ce85611375565b93506119dc60208601611375565b92506040850135915060608501356001600160401b038111156119fe57600080fd5b611a0a878288016114d1565b91505092959194509250565b60008060008060808587031215611a2c57600080fd5b611a3585611375565b9350611a4360208601611375565b92506040850135611a53816113ae565b9396929550929360600135925050565b8183823760009101908152919050565b600181811c90821680611a8757607f821691505b602082108103611aa757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808202811582820484141761084a5761084a611aad565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b61ffff8416815260406020820152600061162c604083018486611ada565b61ffff87168152608060208201526000611b3f608083018789611ada565b6001600160401b03861660408401528281036060840152611b61818587611ada565b9998505050505050505050565b61ffff86168152608060208201526000611b8c608083018688611ada565b6001600160401b03949094166040830152506001600160a01b03919091166060909101529392505050565b60006001600160401b03808316818103611bd357611bd3611aad565b6001019392505050565b61ffff8816815260c060208201526000611bfa60c08301896115b3565b6001600160a01b03881660408401526001600160401b03871660608401526080830186905282810360a0840152611c32818587611ada565b9a9950505050505050505050565b8181038181111561084a5761084a611aad565b634e487b7160e01b600052603260045260246000fd5b61ffff86168152608060208201526000611c87608083018688611ada565b6001600160401b03851660408401528281036060840152611ca881856115b3565b98975050505050505050565b634e487b7160e01b600052603160045260246000fdfea26469706673582212207cb5478878bce07cddf00be8e867b9ab4aa979033bcfebb2e7ef5f01eabac96b64736f6c63430008110033";

export class LayerZeroEndpointMock__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _chainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LayerZeroEndpointMock> {
    return super.deploy(
      _chainId,
      overrides || {}
    ) as Promise<LayerZeroEndpointMock>;
  }
  getDeployTransaction(
    _chainId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_chainId, overrides || {});
  }
  attach(address: string): LayerZeroEndpointMock {
    return super.attach(address) as LayerZeroEndpointMock;
  }
  connect(signer: Signer): LayerZeroEndpointMock__factory {
    return super.connect(signer) as LayerZeroEndpointMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LayerZeroEndpointMockInterface {
    return new utils.Interface(_abi) as LayerZeroEndpointMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LayerZeroEndpointMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as LayerZeroEndpointMock;
  }
}
