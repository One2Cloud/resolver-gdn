import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ISynchronizerApplication, ISynchronizerApplicationInterface } from "../ISynchronizerApplication";
export declare class ISynchronizerApplication__factory {
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
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
        anonymous?: undefined;
    })[];
    static createInterface(): ISynchronizerApplicationInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ISynchronizerApplication;
}
