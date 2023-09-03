import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IBaseProvider, IBaseProviderInterface } from "../IBaseProvider";
export declare class IBaseProvider__factory {
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
    static createInterface(): IBaseProviderInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IBaseProvider;
}
