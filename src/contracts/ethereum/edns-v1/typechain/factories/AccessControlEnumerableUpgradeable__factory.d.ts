import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  AccessControlEnumerableUpgradeable,
  AccessControlEnumerableUpgradeableInterface,
} from "../AccessControlEnumerableUpgradeable";
export declare class AccessControlEnumerableUpgradeable__factory {
  static readonly abi: (
    | {
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
      }
    | {
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
      }
  )[];
  static createInterface(): AccessControlEnumerableUpgradeableInterface;
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AccessControlEnumerableUpgradeable;
}
