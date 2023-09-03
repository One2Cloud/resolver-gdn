import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC2981Upgradeable, IERC2981UpgradeableInterface } from "../IERC2981Upgradeable";
export declare class IERC2981Upgradeable__factory {
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
    static createInterface(): IERC2981UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC2981Upgradeable;
}
