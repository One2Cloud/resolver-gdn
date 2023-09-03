import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IRouterProtocolV1Provider, IRouterProtocolV1ProviderInterface } from "../IRouterProtocolV1Provider";
export declare class IRouterProtocolV1Provider__factory {
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
    static createInterface(): IRouterProtocolV1ProviderInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IRouterProtocolV1Provider;
}
