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
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface ITextResolverInterface extends ethers.utils.Interface {
  functions: {
    "getText(bytes,bytes,bytes)": FunctionFragment;
    "setText(bytes,bytes,bytes,string)": FunctionFragment;
    "unsetText(bytes,bytes,bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getText",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setText",
    values: [BytesLike, BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "unsetText",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "getText", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setText", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unsetText", data: BytesLike): Result;

  events: {
    "SetText(bytes,bytes,bytes,string)": EventFragment;
    "UnsetText(bytes,bytes,bytes)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetText"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnsetText"): EventFragment;
}

export type SetTextEvent = TypedEvent<
  [string, string, string, string] & {
    host: string;
    name: string;
    tld: string;
    text: string;
  }
>;

export type UnsetTextEvent = TypedEvent<
  [string, string, string] & { host: string; name: string; tld: string }
>;

export class ITextResolver extends BaseContract {
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

  interface: ITextResolverInterface;

  functions: {
    getText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      text: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unsetText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getText(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  setText(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    text: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unsetText(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    setText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      text: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unsetText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "SetText(bytes,bytes,bytes,string)"(
      host?: null,
      name?: null,
      tld?: null,
      text?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; text: string }
    >;

    SetText(
      host?: null,
      name?: null,
      tld?: null,
      text?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; text: string }
    >;

    "UnsetText(bytes,bytes,bytes)"(
      host?: null,
      name?: null,
      tld?: null
    ): TypedEventFilter<
      [string, string, string],
      { host: string; name: string; tld: string }
    >;

    UnsetText(
      host?: null,
      name?: null,
      tld?: null
    ): TypedEventFilter<
      [string, string, string],
      { host: string; name: string; tld: string }
    >;
  };

  estimateGas: {
    getText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      text: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unsetText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      text: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unsetText(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}