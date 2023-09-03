import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IMultichainAnyCallV6Provider, IMultichainAnyCallV6ProviderInterface } from "../IMultichainAnyCallV6Provider";
export declare class IMultichainAnyCallV6Provider__factory {
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
    static createInterface(): IMultichainAnyCallV6ProviderInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IMultichainAnyCallV6Provider;
}
