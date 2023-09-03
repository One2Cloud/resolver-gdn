import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IReceiver, IReceiverInterface } from "../IReceiver";
export declare class IReceiver__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IReceiverInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IReceiver;
}
