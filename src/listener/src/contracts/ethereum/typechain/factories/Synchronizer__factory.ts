/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Synchronizer, SynchronizerInterface } from "../Synchronizer";

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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
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
    inputs: [],
    name: "REQUESTOR_ROLE",
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
        internalType: "enum Chain",
        name: "selfChain",
        type: "uint8",
      },
      {
        internalType: "contract IRegistrar",
        name: "registrar_",
        type: "address",
      },
      {
        internalType: "contract IPortal",
        name: "portal_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
        name: "ctx",
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
  {
    inputs: [],
    name: "unpause",
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
];

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5060805161234a61004c6000396000818161058e015281816105ce0152818161068d015281816106cd015261075c015261234a6000f3fe60806040526004361061014b5760003560e01c80638456cb59116100b6578063d547741f1161006f578063d547741f146103d3578063d8d2afed146103f3578063e79805d314610413578063f443fb3514610433578063f5b541a61461046b578063f672d1ca1461048d57600080fd5b80638456cb591461030257806391d1485414610317578063a217fddf14610337578063ac139ae81461034c578063b886bc8a1461036c578063c0f05d9c146103b357600080fd5b80633f4ba83a116101085780633f4ba83a146102595780634f1ef2861461026e57806352d1902d146102815780635c975abb146102965780636343049c146102ae57806375b238fc146102ce57600080fd5b806301ffc9a7146101505780630872175614610185578063248a9ca3146101c75780632f2ff15d146101f757806336568abe146102195780633659cfe614610239575b600080fd5b34801561015c57600080fd5b5061017061016b3660046118c6565b6104a0565b60405190151581526020015b60405180910390f35b34801561019157600080fd5b506101b97f867da4c29ecfdb38427343b065ec173ab06ef9e52a3ea804eb8430b7d0e9f51e81565b60405190815260200161017c565b3480156101d357600080fd5b506101b96101e23660046118f0565b600090815260c9602052604090206001015490565b34801561020357600080fd5b5061021761021236600461191e565b6104d7565b005b34801561022557600080fd5b5061021761023436600461191e565b610501565b34801561024557600080fd5b5061021761025436600461194e565b610584565b34801561026557600080fd5b50610217610663565b61021761027c366004611a32565b610683565b34801561028d57600080fd5b506101b961074f565b3480156102a257600080fd5b5060fb5460ff16610170565b3480156102ba57600080fd5b506102176102c9366004611a82565b610803565b3480156102da57600080fd5b506101b97fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177581565b34801561030e57600080fd5b5061021761098b565b34801561032357600080fd5b5061017061033236600461191e565b6109ab565b34801561034357600080fd5b506101b9600081565b34801561035857600080fd5b506101b9610367366004611b77565b6109d6565b34801561037857600080fd5b506103a661038736600461194e565b6001600160a01b03166000908152610131602052604090205460ff1690565b60405161017c9190611c28565b3480156103bf57600080fd5b506102176103ce366004611c36565b610b00565b3480156103df57600080fd5b506102176103ee36600461191e565b610b83565b3480156103ff57600080fd5b5061021761040e366004611c6b565b610ba8565b34801561041f57600080fd5b5061021761042e366004611c97565b610c07565b34801561043f57600080fd5b5061045361044e366004611ce0565b610d14565b6040516001600160a01b03909116815260200161017c565b34801561047757600080fd5b506101b96000805160206122ce83398151915281565b61021761049b366004611cfb565b610d5e565b60006001600160e01b03198216637965db0b60e01b14806104d157506301ffc9a760e01b6001600160e01b03198316145b92915050565b600082815260c960205260409020600101546104f281610d9d565b6104fc8383610da7565b505050565b6001600160a01b03811633146105765760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105808282610e2d565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036105cc5760405162461bcd60e51b815260040161056d90611d95565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166106156000805160206122ae833981519152546001600160a01b031690565b6001600160a01b03161461063b5760405162461bcd60e51b815260040161056d90611de1565b61064481610e94565b6040805160008082526020820190925261066091839190610ebe565b50565b6000805160206122ce83398151915261067b81610d9d565b610660611029565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036106cb5760405162461bcd60e51b815260040161056d90611d95565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166107146000805160206122ae833981519152546001600160a01b031690565b6001600160a01b03161461073a5760405162461bcd60e51b815260040161056d90611de1565b61074382610e94565b61058082826001610ebe565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107ef5760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840161056d565b506000805160206122ae8339815191525b90565b60008061080f8361107b565b90925090506000600283600281111561082a5761082a611bfe565b03610847575061012d5461010090046001600160a01b031661086f565b600083600281111561085b5761085b611bfe565b0361086f575061012f546001600160a01b03165b6001600160a01b0381161561098557604051634b8b755d60e11b81526001600160a01b03821690639716eaba906108aa908590600401611e7d565b600060405180830381600087803b1580156108c457600080fd5b505af19250505080156108d5575060015b61094b576108e1611e90565b806308c379a00361093f57506108f5611eab565b806109005750610941565b7fbe24a3ce5d2640b6ef55cd1aa9f5d45e6e309718801eaab5841ab8618e1552808482604051610931929190611f45565b60405180910390a150610985565b505b3d6000803e3d6000fd5b7f3250cba2fc944640ef685d650a4d59a7fdbfa15d12000d89d55ee50f05fde41e838260405161097c929190611f65565b60405180910390a15b50505050565b6000805160206122ce8339815191526109a381610d9d565b61066061109c565b600091825260c9602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600080805b8451811015610af65760008582815181106109f8576109f8611f8b565b602090810291909101015161012d5490915060ff16600f811115610a1e57610a1e611bfe565b81600f811115610a3057610a30611bfe565b14610ae3576000610a4082610d14565b90506000610a4e8a886110d9565b90506000610a5c8383611105565b61012e5460405163610b433760e11b81529192506001600160a01b03169063c216866e90610a929087908e908690600401611fb1565b602060405180830381865afa158015610aaf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ad39190611fde565b610add908761200d565b95505050505b5080610aee81612020565b9150506109db565b5095945050505050565b6001600160a01b0382163314610b445760405162461bcd60e51b815260206004820152600960248201526827a7262cafa9a2a62360b91b604482015260640161056d565b6001600160a01b038216600090815261013160205260409020805482919060ff19166001836003811115610b7a57610b7a611bfe565b02179055505050565b600082815260c96020526040902060010154610b9e81610d9d565b6104fc8383610e2d565b80610130600084600f811115610bc057610bc0611bfe565b600f811115610bd157610bd1611bfe565b815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055505050565b600054610100900460ff1615808015610c275750600054600160ff909116105b80610c415750303b158015610c41575060005460ff166001145b610ca45760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161056d565b6000805460ff191660011790558015610cc7576000805461ff0019166101001790555b610cd284848461111a565b8015610985576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200161097c565b6000610130600083600f811115610d2d57610d2d611bfe565b600f811115610d3e57610d3e611bfe565b81526020810191909152604001600020546001600160a01b031692915050565b7f867da4c29ecfdb38427343b065ec173ab06ef9e52a3ea804eb8430b7d0e9f51e610d8881610d9d565b610d95868686868661114c565b505050505050565b6106608133611313565b610db182826109ab565b61058057600082815260c9602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610de93390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b610e3782826109ab565b1561058057600082815260c9602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b7fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177561058081610d9d565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610ef1576104fc8361136c565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015610f4b575060408051601f3d908101601f19168201909252610f4891810190611fde565b60015b610fae5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b606482015260840161056d565b6000805160206122ae833981519152811461101d5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b606482015260840161056d565b506104fc838383611408565b61103161142d565b60fb805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60006060828060200190518101906110939190612039565b91509150915091565b6110a4611478565b60fb805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861105e3390565b606082826040516020016110ee929190611f45565b604051602081830303815290604052905092915050565b606082826040516020016110ee9291906120d1565b600054610100900460ff166111415760405162461bcd60e51b815260040161056d906120f5565b6104fc8383836114be565b600061115885836110d9565b905060005b83518110156112cf57600084828151811061117a5761117a611f8b565b602090810291909101015161012d5490915060ff16600f8111156111a0576111a0611bfe565b81600f8111156111b2576111b2611bfe565b146112bc5760006111c282610d14565b905060006111d08286611105565b61012e5460405163610b433760e11b81529192506000916001600160a01b039091169063c216866e9061120b9087908d908790600401611fb1565b602060405180830381865afa158015611228573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061124c9190611fde565b61012e54604051630967312560e21b81529192506001600160a01b03169063259cc494908390611286908f9089908f908990600401612140565b6000604051808303818588803b15801561129f57600080fd5b505af11580156112b3573d6000803e3d6000fd5b50505050505050505b50806112c781612020565b91505061115d565b507ffbd254fbcd9e38f270e54c028f677f1d0fa18a31f015390290a7b4cede875f4e85858560405161130393929190612186565b60405180910390a1505050505050565b61131d82826109ab565b6105805761132a8161159f565b6113358360206115b1565b6040516020016113469291906121ee565b60408051601f198184030181529082905262461bcd60e51b825261056d91600401611e7d565b6001600160a01b0381163b6113d95760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b606482015260840161056d565b6000805160206122ae83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b61141183611754565b60008251118061141e5750805b156104fc576109858383611794565b60fb5460ff166114765760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b604482015260640161056d565b565b60fb5460ff16156114765760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b604482015260640161056d565b600054610100900460ff166114e55760405162461bcd60e51b815260040161056d906120f5565b61012d8054610100600160a81b031981166101006001600160a01b0386811691909102918217845561012e80546001600160a01b0319169186169190911790558592916001600160a81b03191660ff1990911617600183600f81111561154d5761154d611bfe565b021790555061155d600033610da7565b6115877fa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c2177533610da7565b6104fc6000805160206122ce83398151915233610da7565b60606104d16001600160a01b03831660145b606060006115c0836002612263565b6115cb90600261200d565b67ffffffffffffffff8111156115e3576115e361196b565b6040519080825280601f01601f19166020018201604052801561160d576020820181803683370190505b509050600360fc1b8160008151811061162857611628611f8b565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061165757611657611f8b565b60200101906001600160f81b031916908160001a905350600061167b846002612263565b61168690600161200d565b90505b60018111156116fe576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106116ba576116ba611f8b565b1a60f81b8282815181106116d0576116d0611f8b565b60200101906001600160f81b031916908160001a90535060049490941c936116f78161227a565b9050611689565b50831561174d5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161056d565b9392505050565b61175d8161136c565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606001600160a01b0383163b6117fc5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b606482015260840161056d565b600080846001600160a01b0316846040516118179190612291565b600060405180830381855af49150503d8060008114611852576040519150601f19603f3d011682016040523d82523d6000602084013e611857565b606091505b509150915061187f82826040518060600160405280602781526020016122ee60279139611888565b95945050505050565b6060831561189757508161174d565b61174d83838151156118ac5781518083602001fd5b8060405162461bcd60e51b815260040161056d9190611e7d565b6000602082840312156118d857600080fd5b81356001600160e01b03198116811461174d57600080fd5b60006020828403121561190257600080fd5b5035919050565b6001600160a01b038116811461066057600080fd5b6000806040838503121561193157600080fd5b82359150602083013561194381611909565b809150509250929050565b60006020828403121561196057600080fd5b813561174d81611909565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156119a7576119a761196b565b6040525050565b600067ffffffffffffffff8211156119c8576119c861196b565b50601f01601f191660200190565b600082601f8301126119e757600080fd5b81356119f2816119ae565b6040516119ff8282611981565b828152856020848701011115611a1457600080fd5b82602086016020830137600092810160200192909252509392505050565b60008060408385031215611a4557600080fd5b8235611a5081611909565b9150602083013567ffffffffffffffff811115611a6c57600080fd5b611a78858286016119d6565b9150509250929050565b600060208284031215611a9457600080fd5b813567ffffffffffffffff811115611aab57600080fd5b611ab7848285016119d6565b949350505050565b6003811061066057600080fd5b803560048110611adb57600080fd5b919050565b803560108110611adb57600080fd5b600082601f830112611b0057600080fd5b8135602067ffffffffffffffff821115611b1c57611b1c61196b565b8160051b604051611b2f83830182611981565b92835284810182019282810187851115611b4857600080fd5b83870192505b84831015611b6c57611b5f83611ae0565b8152918301918301611b4e565b509695505050505050565b60008060008060808587031215611b8d57600080fd5b8435611b9881611abf565b9350611ba660208601611acc565b9250604085013567ffffffffffffffff80821115611bc357600080fd5b611bcf88838901611aef565b93506060870135915080821115611be557600080fd5b50611bf2878288016119d6565b91505092959194509250565b634e487b7160e01b600052602160045260246000fd5b60048110611c2457611c24611bfe565b9052565b602081016104d18284611c14565b60008060408385031215611c4957600080fd5b8235611c5481611909565b9150611c6260208401611acc565b90509250929050565b60008060408385031215611c7e57600080fd5b611c8783611ae0565b9150602083013561194381611909565b600080600060608486031215611cac57600080fd5b611cb584611ae0565b92506020840135611cc581611909565b91506040840135611cd581611909565b809150509250925092565b600060208284031215611cf257600080fd5b61174d82611ae0565b600080600080600060a08688031215611d1357600080fd5b8535611d1e81611909565b94506020860135611d2e81611abf565b9350611d3c60408701611acc565b9250606086013567ffffffffffffffff80821115611d5957600080fd5b611d6589838a01611aef565b93506080880135915080821115611d7b57600080fd5b50611d88888289016119d6565b9150509295509295909350565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b60005b83811015611e48578181015183820152602001611e30565b50506000910152565b60008151808452611e69816020860160208601611e2d565b601f01601f19169290920160200192915050565b60208152600061174d6020830184611e51565b600060033d11156108005760046000803e5060005160e01c90565b600060443d1015611eb95790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715611ee957505050505090565b8285019150815181811115611f015750505050505090565b843d8701016020828501011115611f1b5750505050505090565b611f2a60208286010187611981565b509095945050505050565b60038110611c2457611c24611bfe565b611f4f8184611f35565b604060208201526000611ab76040830184611e51565b60408101611f738285611f35565b6001600160a01b039290921660209190910152919050565b634e487b7160e01b600052603260045260246000fd5b60108110611c2457611c24611bfe565b611fbb8185611fa1565b611fc86020820184611c14565b60606040820152600061187f6060830184611e51565b600060208284031215611ff057600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156104d1576104d1611ff7565b60006001820161203257612032611ff7565b5060010190565b6000806040838503121561204c57600080fd5b825161205781611abf565b602084015190925067ffffffffffffffff81111561207457600080fd5b8301601f8101851361208557600080fd5b8051612090816119ae565b60405161209d8282611981565b8281528760208486010111156120b257600080fd5b6120c3836020830160208701611e2d565b809450505050509250929050565b6001600160a01b0383168152604060208201819052600090611ab790830184611e51565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b6001600160a01b03851681526121596020820185611fa1565b6121666040820184611c14565b60806060820152600061217c6080830184611e51565b9695505050505050565b6000606082016121968387611f35565b60206121a481850187611c14565b6060604085015284519182905280850191608085019060005b818110156121e0576121d0838651611fa1565b93830193918301916001016121bd565b509098975050505050505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351612226816017850160208801611e2d565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351612257816028840160208801611e2d565b01602801949350505050565b80820281158282048414176104d1576104d1611ff7565b60008161228957612289611ff7565b506000190190565b600082516122a3818460208701611e2d565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220fc0c910b95220efdb9bd0b0a8060716020acbe4f33fed7e2d1d809ff25d1d2ce64736f6c63430008110033";

export class Synchronizer__factory extends ContractFactory {
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
  ): Promise<Synchronizer> {
    return super.deploy(overrides || {}) as Promise<Synchronizer>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Synchronizer {
    return super.attach(address) as Synchronizer;
  }
  connect(signer: Signer): Synchronizer__factory {
    return super.connect(signer) as Synchronizer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SynchronizerInterface {
    return new utils.Interface(_abi) as SynchronizerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Synchronizer {
    return new Contract(address, _abi, signerOrProvider) as Synchronizer;
  }
}
