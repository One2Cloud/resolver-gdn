import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ILegacyBaseRegistrar, ILegacyBaseRegistrarInterface } from "../ILegacyBaseRegistrar";
export declare class ILegacyBaseRegistrar__factory {
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
    static createInterface(): ILegacyBaseRegistrarInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ILegacyBaseRegistrar;
}
