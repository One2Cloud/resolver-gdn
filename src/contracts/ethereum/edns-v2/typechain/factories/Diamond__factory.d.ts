import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Diamond, DiamondInterface } from "../Diamond";
export declare class Diamond__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
    } | {
        stateMutability: string;
        type: string;
        inputs?: undefined;
        name?: undefined;
    })[];
    static createInterface(): DiamondInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Diamond;
}
