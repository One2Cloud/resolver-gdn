import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IBaseRegistrarController, IBaseRegistrarControllerInterface } from "../IBaseRegistrarController";
export declare class IBaseRegistrarController__factory {
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
    static createInterface(): IBaseRegistrarControllerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IBaseRegistrarController;
}
