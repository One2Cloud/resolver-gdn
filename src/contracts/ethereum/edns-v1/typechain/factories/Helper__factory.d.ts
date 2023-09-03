import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { Helper, HelperInterface } from "../Helper";
export declare class Helper__factory {
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
    static createInterface(): HelperInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Helper;
}
