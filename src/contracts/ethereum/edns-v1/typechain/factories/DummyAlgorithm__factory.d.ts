import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DummyAlgorithm, DummyAlgorithmInterface } from "../DummyAlgorithm";
export declare class DummyAlgorithm__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<DummyAlgorithm>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): DummyAlgorithm;
    connect(signer: Signer): DummyAlgorithm__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b506101ff806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063de8f50a114610030575b600080fd5b61004a600480360381019061004591906100df565b610060565b60405161005791906101ae565b60405180910390f35b6000600190509695505050505050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f84011261009f5761009e61007a565b5b8235905067ffffffffffffffff8111156100bc576100bb61007f565b5b6020830191508360018202830111156100d8576100d7610084565b5b9250929050565b600080600080600080606087890312156100fc576100fb610070565b5b600087013567ffffffffffffffff81111561011a57610119610075565b5b61012689828a01610089565b9650965050602087013567ffffffffffffffff81111561014957610148610075565b5b61015589828a01610089565b9450945050604087013567ffffffffffffffff81111561017857610177610075565b5b61018489828a01610089565b92509250509295509295509295565b60008115159050919050565b6101a881610193565b82525050565b60006020820190506101c3600083018461019f565b9291505056fea264697066735822122085677bb9ec046e62ce35f1ffb8acb7eb9755d905558d734d06b6b9c5d76da21464736f6c634300080a0033";
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): DummyAlgorithmInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): DummyAlgorithm;
}
