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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IBaseProviderInterface extends ethers.utils.Interface {
  functions: {
    "receive_(bytes)": FunctionFragment;
    "send_(address,uint8,bytes)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "receive_", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "send_",
    values: [string, BigNumberish, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "receive_", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "send_", data: BytesLike): Result;

  events: {
    "MessageReceived(bytes32,bytes,bytes,bytes)": EventFragment;
    "MessageSent(bytes,bytes,bytes,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "MessageReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MessageSent"): EventFragment;
}

export type MessageReceivedEvent = TypedEvent<
  [string, string, string, string] & {
    ref: string;
    sender: string;
    srcChainId: string;
    payload: string;
  }
>;

export type MessageSentEvent = TypedEvent<
  [string, string, string, string] & {
    sender: string;
    receiver: string;
    dstChainId: string;
    payload: string;
  }
>;

export class IBaseProvider extends BaseContract {
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

  interface: IBaseProviderInterface;

  functions: {
    receive_(
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    send_(
      _sender: string,
      _dstChain: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  receive_(
    _payload: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  send_(
    _sender: string,
    _dstChain: BigNumberish,
    _payload: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    receive_(_payload: BytesLike, overrides?: CallOverrides): Promise<void>;

    send_(
      _sender: string,
      _dstChain: BigNumberish,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "MessageReceived(bytes32,bytes,bytes,bytes)"(
      ref?: BytesLike | null,
      sender?: BytesLike | null,
      srcChainId?: BytesLike | null,
      payload?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { ref: string; sender: string; srcChainId: string; payload: string }
    >;

    MessageReceived(
      ref?: BytesLike | null,
      sender?: BytesLike | null,
      srcChainId?: BytesLike | null,
      payload?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { ref: string; sender: string; srcChainId: string; payload: string }
    >;

    "MessageSent(bytes,bytes,bytes,bytes)"(
      sender?: BytesLike | null,
      receiver?: BytesLike | null,
      dstChainId?: BytesLike | null,
      payload?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { sender: string; receiver: string; dstChainId: string; payload: string }
    >;

    MessageSent(
      sender?: BytesLike | null,
      receiver?: BytesLike | null,
      dstChainId?: BytesLike | null,
      payload?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { sender: string; receiver: string; dstChainId: string; payload: string }
    >;
  };

  estimateGas: {
    receive_(
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    send_(
      _sender: string,
      _dstChain: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    receive_(
      _payload: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    send_(
      _sender: string,
      _dstChain: BigNumberish,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
