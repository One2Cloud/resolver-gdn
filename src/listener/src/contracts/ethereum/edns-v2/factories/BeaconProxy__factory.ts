/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BytesLike,
  Contract,
  ContractFactory,
  PayableOverrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BeaconProxy, BeaconProxyInterface } from "../BeaconProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
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
    stateMutability: "payable",
    type: "fallback",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040526040516109003803806109008339810160408190526100229161045b565b61002e82826000610035565b5050610585565b61003e83610100565b6040516001600160a01b038416907f1cf3b03a6cf19fa2baba4df148e9dcabedea7f8a5c07840e207e5c089be95d3e90600090a260008251118061007f5750805b156100fb576100f9836001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100e9919061051b565b836102a360201b6100291760201c565b505b505050565b610113816102cf60201b6100551760201c565b6101725760405162461bcd60e51b815260206004820152602560248201527f455243313936373a206e657720626561636f6e206973206e6f74206120636f6e6044820152641d1c9858dd60da1b60648201526084015b60405180910390fd5b6101e6816001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156101b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101d7919061051b565b6102cf60201b6100551760201c565b61024b5760405162461bcd60e51b815260206004820152603060248201527f455243313936373a20626561636f6e20696d706c656d656e746174696f6e206960448201526f1cc81b9bdd08184818dbdb9d1c9858dd60821b6064820152608401610169565b806102827fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d5060001b6102de60201b6100641760201c565b80546001600160a01b0319166001600160a01b039290921691909117905550565b60606102c883836040518060600160405280602781526020016108d9602791396102e1565b9392505050565b6001600160a01b03163b151590565b90565b6060600080856001600160a01b0316856040516102fe9190610536565b600060405180830381855af49150503d8060008114610339576040519150601f19603f3d011682016040523d82523d6000602084013e61033e565b606091505b5090925090506103508683838761035a565b9695505050505050565b606083156103c95782516000036103c2576001600160a01b0385163b6103c25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610169565b50816103d3565b6103d383836103db565b949350505050565b8151156103eb5781518083602001fd5b8060405162461bcd60e51b81526004016101699190610552565b80516001600160a01b038116811461041c57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561045257818101518382015260200161043a565b50506000910152565b6000806040838503121561046e57600080fd5b61047783610405565b60208401519092506001600160401b038082111561049457600080fd5b818501915085601f8301126104a857600080fd5b8151818111156104ba576104ba610421565b604051601f8201601f19908116603f011681019083821181831017156104e2576104e2610421565b816040528281528860208487010111156104fb57600080fd5b61050c836020830160208801610437565b80955050505050509250929050565b60006020828403121561052d57600080fd5b6102c882610405565b60008251610548818460208701610437565b9190910192915050565b6020815260008251806020840152610571816040850160208701610437565b601f01601f19169190910160400192915050565b610345806105946000396000f3fe60806040523661001357610011610017565b005b6100115b610027610022610067565b610100565b565b606061004e83836040518060600160405280602781526020016102e960279139610124565b9392505050565b6001600160a01b03163b151590565b90565b600061009a7fa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50546001600160a01b031690565b6001600160a01b0316635c60da1b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156100d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100fb919061024c565b905090565b3660008037600080366000845af43d6000803e80801561011f573d6000f35b3d6000fd5b6060600080856001600160a01b0316856040516101419190610299565b600060405180830381855af49150503d806000811461017c576040519150601f19603f3d011682016040523d82523d6000602084013e610181565b606091505b50915091506101928683838761019c565b9695505050505050565b60608315610210578251600003610209576001600160a01b0385163b6102095760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064015b60405180910390fd5b508161021a565b61021a8383610222565b949350505050565b8151156102325781518083602001fd5b8060405162461bcd60e51b815260040161020091906102b5565b60006020828403121561025e57600080fd5b81516001600160a01b038116811461004e57600080fd5b60005b83811015610290578181015183820152602001610278565b50506000910152565b600082516102ab818460208701610275565b9190910192915050565b60208152600082518060208401526102d4816040850160208701610275565b601f01601f1916919091016040019291505056fe416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a2646970667358221220f9ce8edd95489e9aa9aff05729dd1d97e5b7c46500b9038f63ffea7d2342ec3864736f6c63430008110033416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564";

export class BeaconProxy__factory extends ContractFactory {
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
    beacon: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<BeaconProxy> {
    return super.deploy(beacon, data, overrides || {}) as Promise<BeaconProxy>;
  }
  getDeployTransaction(
    beacon: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(beacon, data, overrides || {});
  }
  attach(address: string): BeaconProxy {
    return super.attach(address) as BeaconProxy;
  }
  connect(signer: Signer): BeaconProxy__factory {
    return super.connect(signer) as BeaconProxy__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BeaconProxyInterface {
    return new utils.Interface(_abi) as BeaconProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BeaconProxy {
    return new Contract(address, _abi, signerOrProvider) as BeaconProxy;
  }
}
