import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Owned, OwnedInterface } from "../Owned";
export declare class Owned__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<Owned>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): Owned;
    connect(signer: Signer): Owned__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610224806100606000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806313af40351461003b5780638da5cb5b14610057575b600080fd5b61005560048036038101906100509190610197565b610075565b005b61005f610110565b60405161006c91906101d3565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146100cd57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061016482610139565b9050919050565b61017481610159565b811461017f57600080fd5b50565b6000813590506101918161016b565b92915050565b6000602082840312156101ad576101ac610134565b5b60006101bb84828501610182565b91505092915050565b6101cd81610159565b82525050565b60006020820190506101e860008301846101c4565b9291505056fea2646970667358221220775072556146c6045d5b9fd32c1db8fb974e512b6fc47dd135903d390afdbf2464736f6c634300080a0033";
    static readonly abi: ({
        inputs: never[];
        stateMutability: string;
        type: string;
        name?: undefined;
        outputs?: undefined;
    } | {
        inputs: never[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): OwnedInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Owned;
}
