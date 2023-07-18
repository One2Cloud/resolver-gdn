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

interface IDiamondCutInterface extends ethers.utils.Interface {
  functions: {
    "diamondCut(tuple[],address,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "diamondCut",
    values: [
      {
        facetAddress: string;
        action: BigNumberish;
        functionSelectors: BytesLike[];
      }[],
      string,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(functionFragment: "diamondCut", data: BytesLike): Result;

  events: {
    "DiamondCut(tuple[],address,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DiamondCut"): EventFragment;
}

export type DiamondCutEvent = TypedEvent<
  [
    ([string, number, string[]] & {
      facetAddress: string;
      action: number;
      functionSelectors: string[];
    })[],
    string,
    string
  ] & {
    _diamondCut: ([string, number, string[]] & {
      facetAddress: string;
      action: number;
      functionSelectors: string[];
    })[];
    _init: string;
    _calldata: string;
  }
>;

export class IDiamondCut extends BaseContract {
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

  interface: IDiamondCutInterface;

  functions: {
    diamondCut(
      _diamondCut: {
        facetAddress: string;
        action: BigNumberish;
        functionSelectors: BytesLike[];
      }[],
      _init: string,
      _calldata: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  diamondCut(
    _diamondCut: {
      facetAddress: string;
      action: BigNumberish;
      functionSelectors: BytesLike[];
    }[],
    _init: string,
    _calldata: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    diamondCut(
      _diamondCut: {
        facetAddress: string;
        action: BigNumberish;
        functionSelectors: BytesLike[];
      }[],
      _init: string,
      _calldata: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DiamondCut(tuple[],address,bytes)"(
      _diamondCut?: null,
      _init?: null,
      _calldata?: null
    ): TypedEventFilter<
      [
        ([string, number, string[]] & {
          facetAddress: string;
          action: number;
          functionSelectors: string[];
        })[],
        string,
        string
      ],
      {
        _diamondCut: ([string, number, string[]] & {
          facetAddress: string;
          action: number;
          functionSelectors: string[];
        })[];
        _init: string;
        _calldata: string;
      }
    >;

    DiamondCut(
      _diamondCut?: null,
      _init?: null,
      _calldata?: null
    ): TypedEventFilter<
      [
        ([string, number, string[]] & {
          facetAddress: string;
          action: number;
          functionSelectors: string[];
        })[],
        string,
        string
      ],
      {
        _diamondCut: ([string, number, string[]] & {
          facetAddress: string;
          action: number;
          functionSelectors: string[];
        })[];
        _init: string;
        _calldata: string;
      }
    >;
  };

  estimateGas: {
    diamondCut(
      _diamondCut: {
        facetAddress: string;
        action: BigNumberish;
        functionSelectors: BytesLike[];
      }[],
      _init: string,
      _calldata: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    diamondCut(
      _diamondCut: {
        facetAddress: string;
        action: BigNumberish;
        functionSelectors: BytesLike[];
      }[],
      _init: string,
      _calldata: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
