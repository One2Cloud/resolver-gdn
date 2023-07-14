/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface INFTResolverInterface extends ethers.utils.Interface {
  functions: {
    "getNFT(bytes32,uint256)": FunctionFragment;
    "setNFT(bytes32,uint256,address,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getNFT",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setNFT",
    values: [BytesLike, BigNumberish, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getNFT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setNFT", data: BytesLike): Result;

  events: {
    "NFTChanged(bytes32,uint256,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NFTChanged"): EventFragment;
}

export type NFTChangedEvent = TypedEvent<
  [string, BigNumber, string, BigNumber] & {
    node: string;
    chainId: BigNumber;
    contractAddress: string;
    tokenId: BigNumber;
  }
>;

export class INFTResolver extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: INFTResolverInterface;

  functions: {
    getNFT(
      node: BytesLike,
      chainID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setNFT(
      node: BytesLike,
      chainId: BigNumberish,
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getNFT(
    node: BytesLike,
    chainID: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setNFT(
    node: BytesLike,
    chainId: BigNumberish,
    contractAddress: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getNFT(
      node: BytesLike,
      chainID: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber] & {
        chainId: BigNumber;
        contractAddress: string;
        tokenId: BigNumber;
      }
    >;

    setNFT(
      node: BytesLike,
      chainId: BigNumberish,
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "NFTChanged(bytes32,uint256,address,uint256)"(
      node?: BytesLike | null,
      chainId?: null,
      contractAddress?: null,
      tokenId?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        node: string;
        chainId: BigNumber;
        contractAddress: string;
        tokenId: BigNumber;
      }
    >;

    NFTChanged(
      node?: BytesLike | null,
      chainId?: null,
      contractAddress?: null,
      tokenId?: null
    ): TypedEventFilter<
      [string, BigNumber, string, BigNumber],
      {
        node: string;
        chainId: BigNumber;
        contractAddress: string;
        tokenId: BigNumber;
      }
    >;
  };

  estimateGas: {
    getNFT(
      node: BytesLike,
      chainID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setNFT(
      node: BytesLike,
      chainId: BigNumberish,
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getNFT(
      node: BytesLike,
      chainID: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setNFT(
      node: BytesLike,
      chainId: BigNumberish,
      contractAddress: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
