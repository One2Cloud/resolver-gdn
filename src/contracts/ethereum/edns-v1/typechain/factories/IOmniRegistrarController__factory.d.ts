import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IOmniRegistrarController, IOmniRegistrarControllerInterface } from "../IOmniRegistrarController";
export declare class IOmniRegistrarController__factory {
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
    static createInterface(): IOmniRegistrarControllerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IOmniRegistrarController;
}
