import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ILayerZeroProvider, ILayerZeroProviderInterface } from "../ILayerZeroProvider";
export declare class ILayerZeroProvider__factory {
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
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): ILayerZeroProviderInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ILayerZeroProvider;
}
