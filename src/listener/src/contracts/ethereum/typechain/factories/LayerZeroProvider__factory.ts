/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LayerZeroProvider,
  LayerZeroProviderInterface,
} from "../LayerZeroProvider";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "ref",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "MessageDeliverFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "ref",
        type: "bytes32",
      },
    ],
    name: "MessageDelivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint16",
        name: "srcChainId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "srcAddress",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "ref",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
    ],
    name: "MessageReceived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "dstChainId",
        type: "uint16",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "nonce",
        type: "uint64",
      },
    ],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
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
    ],
    name: "SetTrustedRemote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Chain",
        name: "_dstChain",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "estimateFee",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        internalType: "address",
        name: "lzEndpoint_",
        type: "address",
      },
      {
        internalType: "contract IPortal",
        name: "portal",
        type: "address",
      },
    ],
    name: "initialize",
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
    ],
    name: "isTrustedRemote",
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
        name: "_srcChainId",
        type: "uint16",
      },
      {
        internalType: "bytes",
        name: "_srcAddress",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "_nonce",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
    ],
    name: "lzReceive",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
    ],
    name: "receive_",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_from",
        type: "address",
      },
      {
        internalType: "enum Chain",
        name: "_dstChain",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "_payload",
        type: "bytes",
      },
    ],
    name: "send_",
    outputs: [],
    stateMutability: "payable",
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
        internalType: "uint16",
        name: "chainId",
        type: "uint16",
      },
    ],
    name: "setChainId",
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
    ],
    name: "setTrustedRemote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "dstGasLimit",
        type: "uint256",
      },
    ],
    name: "setV1AdaptorParameters",
    outputs: [],
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
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    name: "trustedRemotes",
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
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "v1AdaptorParameters",
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
];

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5060805161272061004c60003960008181610973015281816109b301528181610c3301528181610c730152610d0201526127206000f3fe60806040526004361061014a5760003560e01c806352d1902d116100b6578063a217fddf1161006f578063a217fddf146103b5578063a40b7d85146103ca578063d547741f146103fd578063e074957f1461041d578063eb8d72b71461043d578063f5b541a61461045d57600080fd5b806352d1902d146102f95780636343049c1461030e578063696b532f1461032e57806375b238fc1461034e57806389482e921461038257806391d148541461039557600080fd5b80632f2ff15d116101085780632f2ff15d1461024657806336568abe146102665780633659cfe6146102865780633d8b38f6146102a6578063485cc955146102c65780634f1ef286146102e657600080fd5b80621d35671461014f57806301ffc9a71461017157806306c3fa27146101a65780631252f093146101c8578063248a9ca3146101e85780632b5d23d214610226575b600080fd5b34801561015b57600080fd5b5061016f61016a366004611b26565b61047f565b005b34801561017d57600080fd5b5061019161018c366004611bba565b61078e565b60405190151581526020015b60405180910390f35b3480156101b257600080fd5b506101bb6107c5565b60405161019d9190611c34565b3480156101d457600080fd5b5061016f6101e3366004611c47565b610853565b3480156101f457600080fd5b50610218610203366004611c47565b600090815260c9602052604090206001015490565b60405190815260200161019d565b34801561023257600080fd5b506101bb610241366004611c60565b6108a8565b34801561025257600080fd5b5061016f610261366004611c90565b6108c1565b34801561027257600080fd5b5061016f610281366004611c90565b6108eb565b34801561029257600080fd5b5061016f6102a1366004611cc0565b610969565b3480156102b257600080fd5b506101916102c1366004611cdd565b610a48565b3480156102d257600080fd5b5061016f6102e1366004611d2f565b610b15565b61016f6102f4366004611d9f565b610c29565b34801561030557600080fd5b50610218610cf5565b34801561031a57600080fd5b5061016f610329366004611e4a565b610da9565b34801561033a57600080fd5b50610218610349366004611e9a565b610dee565b34801561035a57600080fd5b506102187fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b61016f610390366004611eb8565b610e86565b3480156103a157600080fd5b506101916103b0366004611c90565b610ef7565b3480156103c157600080fd5b50610218600081565b3480156103d657600080fd5b506103ea6103e5366004611f1a565b610f22565b60405161ffff909116815260200161019d565b34801561040957600080fd5b5061016f610418366004611c90565b610f66565b34801561042957600080fd5b5061016f610438366004611f35565b610f8b565b34801561044957600080fd5b5061016f610458366004611cdd565b610ff8565b34801561046957600080fd5b506102186000805160206126a483398151915281565b60fc546001600160a01b0316336001600160a01b0316146104da5760405162461bcd60e51b815260206004820152601060248201526f1253959053125117d153911413d2539560821b60448201526064015b60405180910390fd5b61ffff8616600090815260fe6020526040812080546104f890611f68565b80601f016020809104026020016040519081016040528092919081815260200182805461052490611f68565b80156105715780601f1061054657610100808354040283529160200191610571565b820191906000526020600020905b81548152906001019060200180831161055457829003601f168201915b505050505090508051868690501480156105a757508051602082012060405161059d9088908890611fa2565b6040518091039020145b6105e55760405162461bcd60e51b815260206004820152600f60248201526e49494e56414c49445f534f5552434560881b60448201526064016104d1565b60008484846040516020016105fc93929190611fb2565b6040516020818303038152906040528051906020012090508383604051610624929190611fa2565b6040518091039020878760405161063c929190611fa2565b604080519182900382208483526001600160401b03891660208401529161ffff8c16917f2b2e20661cc03f4be0a2c9b43b2df0cb59a3e31b856852478dadd36990400389910160405180910390a46040516318d0c12760e21b81523090636343049c906106af9087908790600401612003565b600060405180830381600087803b1580156106c957600080fd5b505af19250505080156106da575060015b610750576106e661201f565b806308c379a00361074457506106fa61203a565b806107055750610746565b7f0fbd3f26d0b1be4d6cac9deea1d677f6772b0d9738b63f193ab7c88902ab3aac82826040516107369291906120c3565b60405180910390a150610784565b505b3d6000803e3d6000fd5b6040518181527ffa39010b12e169f2d7e9a76e381216416dbf5eb59db117ae979592ee9f3238859060200160405180910390a15b5050505050505050565b60006001600160e01b03198216637965db0b60e01b14806107bf57506301ffc9a760e01b6001600160e01b03198316145b92915050565b60ff80546107d290611f68565b80601f01602080910402602001604051908101604052809291908181526020018280546107fe90611f68565b801561084b5780601f106108205761010080835404028352916020019161084b565b820191906000526020600020905b81548152906001019060200180831161082e57829003601f168201915b505050505081565b6000805160206126a483398151915261086b81611070565b604051600160f01b60208201526022810183905260019060420160405160208183030381529060405260ff90816108a29190612122565b50505050565b60fe60205260009081526040902080546107d290611f68565b600082815260c960205260409020600101546108dc81611070565b6108e6838361107a565b505050565b6001600160a01b038116331461095b5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084016104d1565b6109658282611100565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036109b15760405162461bcd60e51b81526004016104d1906121e1565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166109fa600080516020612684833981519152546001600160a01b031690565b6001600160a01b031614610a205760405162461bcd60e51b81526004016104d19061222d565b610a2981611167565b60408051600080825260208201909252610a4591839190611191565b50565b61ffff8316600090815260fe602052604081208054829190610a6990611f68565b80601f0160208091040260200160405190810160405280929190818152602001828054610a9590611f68565b8015610ae25780601f10610ab757610100808354040283529160200191610ae2565b820191906000526020600020905b815481529060010190602001808311610ac557829003601f168201915b505050505090508383604051610af9929190611fa2565b60405180910390208180519060200120149150505b9392505050565b600054610100900460ff1615808015610b355750600054600160ff909116105b80610b4f5750303b158015610b4f575060005460ff166001145b610bb25760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016104d1565b6000805460ff191660011790558015610bd5576000805461ff0019166101001790555b610bdf83836112fc565b80156108e6576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163003610c715760405162461bcd60e51b81526004016104d1906121e1565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610cba600080516020612684833981519152546001600160a01b031690565b6001600160a01b031614610ce05760405162461bcd60e51b81526004016104d19061222d565b610ce982611167565b61096582826001611191565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614610d955760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c000000000000000060648201526084016104d1565b506000805160206126848339815191525b90565b333014610de45760405162461bcd60e51b815260206004820152600960248201526827a7262cafa9a2a62360b91b60448201526064016104d1565b610965828261132d565b600080610dfa85610f22565b60fc5460405163040a7bb160e41b81529192506000916001600160a01b03909116906340a7bb1090610e3b90859030908a908a90889060ff906004016122f6565b6040805180830381865afa158015610e57573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e7b919061234c565b509695505050505050565b60fb546001600160a01b0316336001600160a01b031614610ed75760405162461bcd60e51b815260206004820152600b60248201526a13d3931657d413d495105360aa1b60448201526064016104d1565b6000610ee284610f22565b9050610ef085828585611398565b5050505050565b600091825260c9602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600060fd600083600f811115610f3a57610f3a612370565b600f811115610f4b57610f4b612370565b815260208101919091526040016000205461ffff1692915050565b600082815260c96020526040902060010154610f8181611070565b6108e68383611100565b6000805160206126a4833981519152610fa381611070565b8160fd600085600f811115610fba57610fba612370565b600f811115610fcb57610fcb612370565b815260200190815260200160002060006101000a81548161ffff021916908361ffff160217905550505050565b6000805160206126a483398151915261101081611070565b61ffff8416600090815260fe6020526040902061102e838583612386565b507ffa41487ad5d6728f0b19276fa1eddc16558578f5109fc39d2dc33c3230470dab84848460405161106293929190612445565b60405180910390a150505050565b610a4581336115cf565b6110848282610ef7565b61096557600082815260c9602090815260408083206001600160a01b03851684529091529020805460ff191660011790556110bc3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b61110a8282610ef7565b1561096557600082815260c9602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177561096581611070565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156111c4576108e683611628565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa92505050801561121e575060408051601f3d908101601f1916820190925261121b91810190612463565b60015b6112815760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b60648201526084016104d1565b60008051602061268483398151915281146112f05760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b60648201526084016104d1565b506108e68383836116c4565b600054610100900460ff166113235760405162461bcd60e51b81526004016104d19061247c565b61096582826116e9565b60fb546040516314baf67360e31b81526001600160a01b039091169063a5d7b3989061136290600090869086906004016124c7565b600060405180830381600087803b15801561137c57600080fd5b505af1158015611390573d6000803e3d6000fd5b505050505050565b61ffff8316600090815260fe6020526040812080546113b690611f68565b80601f01602080910402602001604051908101604052809291908181526020018280546113e290611f68565b801561142f5780601f106114045761010080835404028352916020019161142f565b820191906000526020600020905b81548152906001019060200180831161141257829003601f168201915b5050505050905080516000036114785760405162461bcd60e51b815260206004820152600e60248201526d554e54525553545f52454d4f544560901b60448201526064016104d1565b60fc5460405162c5803160e81b81526001600160a01b039091169063c58031009034906114b69088908690899089908d90819060ff906004016124ff565b6000604051808303818588803b1580156114cf57600080fd5b505af11580156114e3573d6000803e3d6000fd5b505060fc54604051630f428ae960e31b815261ffff89166004820152306024820152600094506001600160a01b039091169250637a1457489150604401602060405180830381865afa15801561153d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115619190612568565b90508383604051611573929190611fa2565b6040519081900381206001600160401b03831682529061ffff8716906001600160a01b038916907f4d70683324c7439cbbb0f48c036bb77255919dc506d3c24aebacd75d9cf5cac99060200160405180910390a4505050505050565b6115d98282610ef7565b610965576115e681611793565b6115f18360206117a5565b604051602001611602929190612585565b60408051601f198184030181529082905262461bcd60e51b82526104d191600401611c34565b6001600160a01b0381163b6116955760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b60648201526084016104d1565b60008051602061268483398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6116cd83611940565b6000825111806116da5750805b156108e6576108a28383611980565b600054610100900460ff166117105760405162461bcd60e51b81526004016104d19061247c565b60fb80546001600160a01b038084166001600160a01b03199283161790925560fc805492851692909116919091179055611751600061174c3390565b61107a565b61177b7fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c217753361107a565b6109656000805160206126a48339815191523361107a565b60606107bf6001600160a01b03831660145b606060006117b4836002612610565b6117bf906002612627565b6001600160401b038111156117d6576117d6611d5d565b6040519080825280601f01601f191660200182016040528015611800576020820181803683370190505b509050600360fc1b8160008151811061181b5761181b61263a565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061184a5761184a61263a565b60200101906001600160f81b031916908160001a905350600061186e846002612610565b611879906001612627565b90505b60018111156118f1576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106118ad576118ad61263a565b1a60f81b8282815181106118c3576118c361263a565b60200101906001600160f81b031916908160001a90535060049490941c936118ea81612650565b905061187c565b508315610b0e5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104d1565b61194981611628565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606001600160a01b0383163b6119e85760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b60648201526084016104d1565b600080846001600160a01b031684604051611a039190612667565b600060405180830381855af49150503d8060008114611a3e576040519150601f19603f3d011682016040523d82523d6000602084013e611a43565b606091505b5091509150611a6b82826040518060600160405280602781526020016126c460279139611a74565b95945050505050565b60608315611a83575081610b0e565b610b0e8383815115611a985781518083602001fd5b8060405162461bcd60e51b81526004016104d19190611c34565b803561ffff81168114611ac457600080fd5b919050565b60008083601f840112611adb57600080fd5b5081356001600160401b03811115611af257600080fd5b602083019150836020828501011115611b0a57600080fd5b9250929050565b6001600160401b0381168114610a4557600080fd5b60008060008060008060808789031215611b3f57600080fd5b611b4887611ab2565b955060208701356001600160401b0380821115611b6457600080fd5b611b708a838b01611ac9565b909750955060408901359150611b8582611b11565b90935060608801359080821115611b9b57600080fd5b50611ba889828a01611ac9565b979a9699509497509295939492505050565b600060208284031215611bcc57600080fd5b81356001600160e01b031981168114610b0e57600080fd5b60005b83811015611bff578181015183820152602001611be7565b50506000910152565b60008151808452611c20816020860160208601611be4565b601f01601f19169290920160200192915050565b602081526000610b0e6020830184611c08565b600060208284031215611c5957600080fd5b5035919050565b600060208284031215611c7257600080fd5b610b0e82611ab2565b6001600160a01b0381168114610a4557600080fd5b60008060408385031215611ca357600080fd5b823591506020830135611cb581611c7b565b809150509250929050565b600060208284031215611cd257600080fd5b8135610b0e81611c7b565b600080600060408486031215611cf257600080fd5b611cfb84611ab2565b925060208401356001600160401b03811115611d1657600080fd5b611d2286828701611ac9565b9497909650939450505050565b60008060408385031215611d4257600080fd5b8235611d4d81611c7b565b91506020830135611cb581611c7b565b634e487b7160e01b600052604160045260246000fd5b601f8201601f191681016001600160401b0381118282101715611d9857611d98611d5d565b6040525050565b60008060408385031215611db257600080fd5b8235611dbd81611c7b565b91506020838101356001600160401b0380821115611dda57600080fd5b818601915086601f830112611dee57600080fd5b813581811115611e0057611e00611d5d565b6040519150611e18601f8201601f1916850183611d73565b8082528784828501011115611e2c57600080fd5b80848401858401376000848284010152508093505050509250929050565b60008060208385031215611e5d57600080fd5b82356001600160401b03811115611e7357600080fd5b611e7f85828601611ac9565b90969095509350505050565b803560108110611ac457600080fd5b600080600060408486031215611eaf57600080fd5b611cfb84611e8b565b60008060008060608587031215611ece57600080fd5b8435611ed981611c7b565b9350611ee760208601611e8b565b925060408501356001600160401b03811115611f0257600080fd5b611f0e87828801611ac9565b95989497509550505050565b600060208284031215611f2c57600080fd5b610b0e82611e8b565b60008060408385031215611f4857600080fd5b611f5183611e8b565b9150611f5f60208401611ab2565b90509250929050565b600181811c90821680611f7c57607f821691505b602082108103611f9c57634e487b7160e01b600052602260045260246000fd5b50919050565b8183823760009101908152919050565b60c084901b6001600160c01b0319168152818360088301376000910160080190815292915050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b602081526000612017602083018486611fda565b949350505050565b600060033d1115610da65760046000803e5060005160e01c90565b600060443d10156120485790565b6040516003193d81016004833e81513d6001600160401b03816024840111818411171561207757505050505090565b828501915081518181111561208f5750505050505090565b843d87010160208285010111156120a95750505050505090565b6120b860208286010187611d73565b509095945050505050565b8281526040602082015260006120176040830184611c08565b601f8211156108e657600081815260208120601f850160051c810160208610156121035750805b601f850160051c820191505b818110156113905782815560010161210f565b81516001600160401b0381111561213b5761213b611d5d565b61214f816121498454611f68565b846120dc565b602080601f831160018114612184576000841561216c5750858301515b600019600386901b1c1916600185901b178555611390565b600085815260208120601f198616915b828110156121b357888601518255948401946001909101908401612194565b50858210156121d15787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b6000815461228681611f68565b8085526020600183811680156122a357600181146122bd576122eb565b60ff1985168884015283151560051b8801830195506122eb565b866000528260002060005b858110156122e35781548a82018601529083019084016122c8565b890184019650505b505050505092915050565b61ffff871681526001600160a01b038616602082015260a0604082018190526000906123259083018688611fda565b8415156060840152828103608084015261233f8185612279565b9998505050505050505050565b6000806040838503121561235f57600080fd5b505080516020909101519092909150565b634e487b7160e01b600052602160045260246000fd5b6001600160401b0383111561239d5761239d611d5d565b6123b1836123ab8354611f68565b836120dc565b6000601f8411600181146123e557600085156123cd5750838201355b600019600387901b1c1916600186901b178355610ef0565b600083815260209020601f19861690835b8281101561241657868501358255602094850194600190920191016123f6565b50868210156124335760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b61ffff84168152604060208201526000611a6b604083018486611fda565b60006020828403121561247557600080fd5b5051919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6000600485106124e757634e487b7160e01b600052602160045260246000fd5b84825260406020830152611a6b604083018486611fda565b61ffff8816815260c06020820152600061251c60c0830189611c08565b828103604084015261252f81888a611fda565b6001600160a01b0387811660608601528616608085015283810360a0850152905061255a8185612279565b9a9950505050505050505050565b60006020828403121561257a57600080fd5b8151610b0e81611b11565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516125bd816017850160208801611be4565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516125ee816028840160208801611be4565b01602801949350505050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176107bf576107bf6125fa565b808201808211156107bf576107bf6125fa565b634e487b7160e01b600052603260045260246000fd5b60008161265f5761265f6125fa565b506000190190565b60008251612679818460208701611be4565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a26469706673582212202d0d4adc8435e460b3833771004ba9ace762b97f629de6ea45220af0f10f430e64736f6c63430008110033";

export class LayerZeroProvider__factory extends ContractFactory {
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
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LayerZeroProvider> {
    return super.deploy(overrides || {}) as Promise<LayerZeroProvider>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LayerZeroProvider {
    return super.attach(address) as LayerZeroProvider;
  }
  connect(signer: Signer): LayerZeroProvider__factory {
    return super.connect(signer) as LayerZeroProvider__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LayerZeroProviderInterface {
    return new utils.Interface(_abi) as LayerZeroProviderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LayerZeroProvider {
    return new Contract(address, _abi, signerOrProvider) as LayerZeroProvider;
  }
}
