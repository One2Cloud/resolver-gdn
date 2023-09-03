import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { RegistryInit, RegistryInitInterface } from "../RegistryInit";
export declare class RegistryInit__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<RegistryInit>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): RegistryInit;
    connect(signer: Signer): RegistryInit__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50610280806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e1c7392a14610030575b600080fd5b61003861003a565b005b610042610150565b7f73eb587317bc3da9a2594a66138a7026cba8d02e0ed74cd310bde160c932a0d98054600160ff1991821681179092557ff0c9af5748a041c692c372f372dbfb0b6f5fba68c2d448e041ba6c031449f3f180548216831790557fcf7d7633dc67bd92a53d09fdb46e611be8871694dc17cf950f81b908ab2db62180548216831790557fe79e4f0d8669cbdb5a683c63ef620c3bb9cf950ac5f9cde85e1f4c89c01a7b7880548216831790557fb73005c118b5f4636fc5d5f3c35e7dd5bd9764a470c590de3a135a1bea2d226a80548216831790553360009081527ff31a9df2f3f8d6c73a0d00e70ef3aa1d0b11d0de90fd97e177398d19f466a5426020526040902080549091169091179055565b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c1320547fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c906001600160a01b031633146101dc5760405162461bcd60e51b815260206004820152600a60248201526927a7262cafa7aba722a960b11b604482015260640160405180910390fd5b6301ffc9a760e01b600090815260039091016020526040808220805460ff1990811660019081179092556307e4c70760e21b845282842080548216831790556348e2b09360e01b845282842080548216831790556307f5828d60e41b8452919092208054909116909117905556fea2646970667358221220cd91b18013c67c71c400593e6f5e3ea1727dc5512846e25ee8d1f3596f18f9b164736f6c63430008110033";
    static readonly abi: {
        inputs: never[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): RegistryInitInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): RegistryInit;
}
