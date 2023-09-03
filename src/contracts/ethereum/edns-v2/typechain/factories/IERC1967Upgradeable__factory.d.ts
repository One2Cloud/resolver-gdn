import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IERC1967Upgradeable, IERC1967UpgradeableInterface } from "../IERC1967Upgradeable";
export declare class IERC1967Upgradeable__factory {
    static readonly abi: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    }[];
    static createInterface(): IERC1967UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IERC1967Upgradeable;
}
