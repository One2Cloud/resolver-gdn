import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ERC2981Upgradeable, ERC2981UpgradeableInterface } from "../ERC2981Upgradeable";
export declare class ERC2981Upgradeable__factory {
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
    static createInterface(): ERC2981UpgradeableInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC2981Upgradeable;
}
