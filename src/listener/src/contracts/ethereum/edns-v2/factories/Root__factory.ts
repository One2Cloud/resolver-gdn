/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Root, RootInterface } from "../Root";

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
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "NewAuthorizer",
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
      {
        indexed: false,
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
    ],
    name: "TldRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
    ],
    name: "TldRenewed",
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
    name: "getAuthorizer",
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
        internalType: "contract IRegistry",
        name: "registry_",
        type: "address",
      },
      {
        internalType: "contract IRegistrar",
        name: "registrar",
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
        internalType: "bytes",
        name: "tld",
        type: "bytes",
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
        name: "resolver",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
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
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "expiry",
        type: "uint64",
      },
    ],
    name: "renew",
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
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "setAuthorizer",
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
        name: "controller",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setControllerApproval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "bool",
        name: "enable_",
        type: "bool",
      },
    ],
    name: "setEnable",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "resolver_",
        type: "address",
      },
    ],
    name: "setResolver",
    outputs: [],
    stateMutability: "payable",
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
      {
        internalType: "address",
        name: "address_",
        type: "address",
      },
    ],
    name: "setWrapper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceID",
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
        internalType: "bytes",
        name: "tld",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transfer",
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
  "0x60a06040523060805234801561001457600080fd5b5060805161240261004c600039600081816105bf015281816105ff0152818161084001528181610880015261090f01526124026000f3fe60806040526004361061014b5760003560e01c806375b238fc116100b6578063bba1b1cd1161006f578063bba1b1cd146103a9578063bdbc5735146103c9578063d547741f146103dc578063e9d5d8d2146103fc578063eea330f91461041c578063f5b541a61461043c57600080fd5b806375b238fc146102e057806391d14854146103025780639ef581d914610322578063a217fddf14610342578063aaabadc514610357578063b5be602c1461038957600080fd5b806342c7becb1161010857806342c7becb14610245578063485cc955146102655780634f1ef2861461028557806352d1902d1461029857806359bca572146102ad5780636a465817146102c057600080fd5b806301ffc9a714610150578063058a628f14610185578063248a9ca3146101a75780632f2ff15d146101e557806336568abe146102055780633659cfe614610225575b600080fd5b34801561015c57600080fd5b5061017061016b366004611a33565b610470565b60405190151581526020015b60405180910390f35b34801561019157600080fd5b506101a56101a0366004611a82565b61049b565b005b3480156101b357600080fd5b506101d76101c2366004611a9f565b60009081526065602052604090206001015490565b60405190815260200161017c565b3480156101f157600080fd5b506101a5610200366004611ab8565b610508565b34801561021157600080fd5b506101a5610220366004611ab8565b610532565b34801561023157600080fd5b506101a5610240366004611a82565b6105b5565b34801561025157600080fd5b506101a5610260366004611b01565b610694565b34801561027157600080fd5b506101a5610280366004611b43565b610721565b6101a5610293366004611c26565b610836565b3480156102a457600080fd5b506101d7610902565b6101a56102bb366004611c75565b6109b5565b3480156102cc57600080fd5b506101a56102db366004611cbb565b610a41565b3480156102ec57600080fd5b506101d76000805160206123ad83398151915281565b34801561030e57600080fd5b5061017061031d366004611ab8565b610a9a565b34801561032e57600080fd5b5061017061033d366004611cf2565b610ac5565b34801561034e57600080fd5b506101d7600081565b34801561036357600080fd5b5060fd546001600160a01b03165b6040516001600160a01b03909116815260200161017c565b34801561039557600080fd5b506101a56103a4366004611d46565b610b3b565b3480156103b557600080fd5b506101a56103c4366004611c75565b610d37565b6101a56103d7366004611d8c565b610eb9565b3480156103e857600080fd5b506101a56103f7366004611ab8565b610f12565b34801561040857600080fd5b506101a5610417366004611de1565b610f37565b34801561042857600080fd5b50610371610437366004611cf2565b6111dc565b34801561044857600080fd5b506101d77f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216637a1e31e160e11b1480610495575061049582611252565b92915050565b6000805160206123ad8339815191526104b381611287565b60fd80546001600160a01b0319166001600160a01b0384169081179091556040519081527f08f53e6a9fbc3949bc0b9266bbe1927f0b282a34d92876ccbe188c24d17c6cbb9060200160405180910390a15050565b60008281526065602052604090206001015461052381611287565b61052d8383611291565b505050565b6001600160a01b03811633146105a75760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105b18282611317565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036105fd5760405162461bcd60e51b815260040161059e90611f0c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610646600080516020612366833981519152546001600160a01b031690565b6001600160a01b03161461066c5760405162461bcd60e51b815260040161059e90611f58565b6106758161137e565b6040805160008082526020820190925261069191839190611396565b50565b6000805160206123ad8339815191526106ac81611287565b60fc546040516342c7becb60e01b8152600481018690526001600160a01b0385811660248301528415156044830152909116906342c7becb906064015b600060405180830381600087803b15801561070357600080fd5b505af1158015610717573d6000803e3d6000fd5b5050505050505050565b600054610100900460ff16158080156107415750600054600160ff909116105b8061075b5750303b15801561075b575060005460ff166001145b6107be5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161059e565b6000805460ff1916600117905580156107e1576000805461ff0019166101001790555b6107eb8383611501565b801561052d576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498906020015b60405180910390a1505050565b6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016300361087e5760405162461bcd60e51b815260040161059e90611f0c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166108c7600080516020612366833981519152546001600160a01b031690565b6001600160a01b0316146108ed5760405162461bcd60e51b815260040161059e90611f58565b6108f68261137e565b6105b182826001611396565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146109a25760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c0000000000000000606482015260840161059e565b5060008051602061236683398151915290565b6000805160206123ad8339815191526109cd81611287565b60fb5483516020850120604051630c4b7b8560e11b815260048101919091526001600160a01b03848116602483015290911690631896f70a906044015b600060405180830381600087803b158015610a2457600080fd5b505af1158015610a38573d6000803e3d6000fd5b50505050505050565b6000805160206123ad833981519152610a5981611287565b60fb54604051636a46581760e01b81526004810186905284151560248201526001600160a01b03848116604483015290911690636a465817906064016106e9565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60fb5481516020830120604051632f7915b160e11b815260048101919091526000916001600160a01b031690635ef22b6290602401602060405180830381865afa158015610b17573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104959190611fa4565b6000805160206123ad833981519152610b5381611287565b60fb54835160208501206040516345440f0760e11b81526001600160a01b0390921691638a881e0e91610b8c9160040190815260200190565b602060405180830381865afa158015610ba9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bcd9190611fa4565b8015610c54575060fb54835160208501206040516352cc3b2160e01b8152600481019190915242916001600160a01b0316906352cc3b2190602401602060405180830381865afa158015610c25573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c499190611fc1565b6001600160401b0316115b610c915760405162461bcd60e51b815260206004820152600e60248201526d544c445f4e4f545f45584953545360901b604482015260640161059e565b60fb54835160208501206040516318a8d6e960e31b815260048101919091526001600160401b03841660248201526001600160a01b039091169063c546b74890604401600060405180830381600087803b158015610cee57600080fd5b505af1158015610d02573d6000803e3d6000fd5b505050507f2c14cbac2f0d0ba44bc515f4042947dcacae252f41ec220105a87e93597ebe52838360405161082992919061202e565b6000805160206123ad833981519152610d4f81611287565b60fb5460405163640f666d60e11b81526000916001600160a01b03169063c81eccda90610d80908790600401612059565b6020604051808303816000875af1158015610d9f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc3919061206c565b60fb548551602087012060405163648475b560e01b81529293506000926001600160a01b039092169163648475b591610e029160040190815260200190565b6040805180830381865afa158015610e1e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e429190612085565b60208101516040516323b872dd60e01b81523060048201526001600160a01b038781166024830152604482018690529293509116906323b872dd90606401600060405180830381600087803b158015610e9a57600080fd5b505af1158015610eae573d6000803e3d6000fd5b505050505050505050565b6000805160206123ad833981519152610ed181611287565b60fb548351602085012060405163582dfbcb60e01b8152600481019190915283151560248201526001600160a01b039091169063582dfbcb90604401610a0a565b600082815260656020526040902060010154610f2d81611287565b61052d8383611317565b6000805160206123ad833981519152610f4f81611287565b6000826002811115610f6357610f636120e3565b03610fad57875115610fa85760405162461bcd60e51b815260206004820152600e60248201526d494e56414c49445f434841494e5360901b604482015260640161059e565b610fef565b6000885111610fef5760405162461bcd60e51b815260206004820152600e60248201526d494e56414c49445f434841494e5360901b604482015260640161059e565b60fb54875160208901206040516345440f0760e11b81526001600160a01b0390921691638a881e0e916110289160040190815260200190565b602060405180830381865afa158015611045573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110699190611fa4565b15806110f0575060fb54875160208901206040516352cc3b2160e01b8152600481019190915242916001600160a01b0316906352cc3b2190602401602060405180830381865afa1580156110c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110e59190611fc1565b6001600160401b0316105b6111295760405162461bcd60e51b815260206004820152600a602482015269544c445f45584953545360b01b604482015260640161059e565b60fb5460405163b3c6c27d60e01b81526001600160a01b039091169063b3c6c27d90611165908b908b9089908c908c908b908b9060040161210d565b600060405180830381600087803b15801561117f57600080fd5b505af1158015611193573d6000803e3d6000fd5b505050507f773a13cbdce519900a3426f1f8694e86b864bf861dcfee249aeb27ecc4a0392d8785876040516111ca939291906121c3565b60405180910390a15050505050505050565b60fb548151602083012060405163753761ef60e11b815260048101919091526000916001600160a01b03169063ea6ec3de90602401602060405180830381865afa15801561122e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061049591906121ff565b60006001600160e01b03198216637965db0b60e01b148061049557506301ffc9a760e01b6001600160e01b0319831614610495565b6106918133611532565b61129b8282610a9a565b6105b15760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556112d33390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6113218282610a9a565b156105b15760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000805160206123ad8339815191526105b181611287565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156113c95761052d8361158b565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015611423575060408051601f3d908101601f191682019092526114209181019061206c565b60015b6114865760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b606482015260840161059e565b60008051602061236683398151915281146114f55760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b606482015260840161059e565b5061052d838383611627565b600054610100900460ff166115285760405162461bcd60e51b815260040161059e9061221c565b6105b18282611652565b61153c8282610a9a565b6105b157611549816116fc565b61155483602061170e565b604051602001611565929190612267565b60408051601f198184030181529082905262461bcd60e51b825261059e91600401612059565b6001600160a01b0381163b6115f85760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b606482015260840161059e565b60008051602061236683398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b611630836118b0565b60008251118061163d5750805b1561052d5761164c83836118f0565b50505050565b600054610100900460ff166116795760405162461bcd60e51b815260040161059e9061221c565b60fb80546001600160a01b038085166001600160a01b03199283161790925560fc8054928416929091169190911790556116ba60006116b53390565b611291565b6116d26000805160206123ad83398151915233611291565b6105b17f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92933611291565b60606104956001600160a01b03831660145b6060600061171d8360026122f2565b611728906002612309565b6001600160401b0381111561173f5761173f611b71565b6040519080825280601f01601f191660200182016040528015611769576020820181803683370190505b509050600360fc1b816000815181106117845761178461231c565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106117b3576117b361231c565b60200101906001600160f81b031916908160001a90535060006117d78460026122f2565b6117e2906001612309565b90505b600181111561185a576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106118165761181661231c565b1a60f81b82828151811061182c5761182c61231c565b60200101906001600160f81b031916908160001a90535060049490941c9361185381612332565b90506117e5565b5083156118a95760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161059e565b9392505050565b6118b98161158b565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606118a98383604051806060016040528060278152602001612386602791396060600080856001600160a01b03168560405161192d9190612349565b600060405180830381855af49150503d8060008114611968576040519150601f19603f3d011682016040523d82523d6000602084013e61196d565b606091505b509150915061197e86838387611988565b9695505050505050565b606083156119f75782516000036119f0576001600160a01b0385163b6119f05760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161059e565b5081611a01565b611a018383611a09565b949350505050565b815115611a195781518083602001fd5b8060405162461bcd60e51b815260040161059e9190612059565b600060208284031215611a4557600080fd5b81356001600160e01b0319811681146118a957600080fd5b6001600160a01b038116811461069157600080fd5b8035611a7d81611a5d565b919050565b600060208284031215611a9457600080fd5b81356118a981611a5d565b600060208284031215611ab157600080fd5b5035919050565b60008060408385031215611acb57600080fd5b823591506020830135611add81611a5d565b809150509250929050565b801515811461069157600080fd5b8035611a7d81611ae8565b600080600060608486031215611b1657600080fd5b833592506020840135611b2881611a5d565b91506040840135611b3881611ae8565b809150509250925092565b60008060408385031215611b5657600080fd5b8235611b6181611a5d565b91506020830135611add81611a5d565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715611baf57611baf611b71565b604052919050565b600082601f830112611bc857600080fd5b81356001600160401b03811115611be157611be1611b71565b611bf4601f8201601f1916602001611b87565b818152846020838601011115611c0957600080fd5b816020850160208301376000918101602001919091529392505050565b60008060408385031215611c3957600080fd5b8235611c4481611a5d565b915060208301356001600160401b03811115611c5f57600080fd5b611c6b85828601611bb7565b9150509250929050565b60008060408385031215611c8857600080fd5b82356001600160401b03811115611c9e57600080fd5b611caa85828601611bb7565b9250506020830135611add81611a5d565b600080600060608486031215611cd057600080fd5b833592506020840135611ce281611ae8565b91506040840135611b3881611a5d565b600060208284031215611d0457600080fd5b81356001600160401b03811115611d1a57600080fd5b611a0184828501611bb7565b6001600160401b038116811461069157600080fd5b8035611a7d81611d26565b60008060408385031215611d5957600080fd5b82356001600160401b03811115611d6f57600080fd5b611d7b85828601611bb7565b9250506020830135611add81611d26565b60008060408385031215611d9f57600080fd5b82356001600160401b03811115611db557600080fd5b611dc185828601611bb7565b9250506020830135611add81611ae8565b803560038110611a7d57600080fd5b600080600080600080600060e0888a031215611dfc57600080fd5b87356001600160401b0380821115611e1357600080fd5b818a0191508a601f830112611e2757600080fd5b8135602082821115611e3b57611e3b611b71565b8160051b611e4a828201611b87565b928352848101820192828101908f851115611e6457600080fd5b958301955b84871015611e93578635925060108310611e835760008081fd5b8282529583019590830190611e69565b9c5050508b013592505080821115611eaa57600080fd5b50611eb78a828b01611bb7565b965050611ec660408901611a72565b9450611ed460608901611d3b565b9350611ee260808901611a72565b9250611ef060a08901611af6565b9150611efe60c08901611dd2565b905092959891949750929550565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b600060208284031215611fb657600080fd5b81516118a981611ae8565b600060208284031215611fd357600080fd5b81516118a981611d26565b60005b83811015611ff9578181015183820152602001611fe1565b50506000910152565b6000815180845261201a816020860160208601611fde565b601f01601f19169290920160200192915050565b6040815260006120416040830185612002565b90506001600160401b03831660208301529392505050565b6020815260006118a96020830184612002565b60006020828403121561207e57600080fd5b5051919050565b60006040828403121561209757600080fd5b604051604081018181106001600160401b03821117156120b9576120b9611b71565b60405282516120c781611ae8565b815260208301516120d781611a5d565b60208201529392505050565b634e487b7160e01b600052602160045260246000fd5b60038110612109576121096120e3565b9052565b60e08082528851908201819052600090602090610100840190828c01845b8281101561215757815160108110612145576121456120e3565b8452928401929084019060010161212b565b5050508381038285015261216b818b612002565b9250505061218460408301886001600160a01b03169052565b6001600160a01b03861660608301526001600160401b038516608083015283151560a08301526121b760c08301846120f9565b98975050505050505050565b6060815260006121d66060830186612002565b6001600160a01b03949094166020830152506001600160401b0391909116604090910152919050565b60006020828403121561221157600080fd5b81516118a981611a5d565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161229f816017850160208801611fde565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516122d0816028840160208801611fde565b01602801949350505050565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610495576104956122dc565b80820180821115610495576104956122dc565b634e487b7160e01b600052603260045260246000fd5b600081612341576123416122dc565b506000190190565b6000825161235b818460208701611fde565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a26469706673582212203e3a9ff65917f5d943139d2149169d4bb3947ce0d1b19a2a4009364a3d29370164736f6c63430008110033";

export class Root__factory extends ContractFactory {
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
  ): Promise<Root> {
    return super.deploy(overrides || {}) as Promise<Root>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Root {
    return super.attach(address) as Root;
  }
  connect(signer: Signer): Root__factory {
    return super.connect(signer) as Root__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RootInterface {
    return new utils.Interface(_abi) as RootInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Root {
    return new Contract(address, _abi, signerOrProvider) as Root;
  }
}
