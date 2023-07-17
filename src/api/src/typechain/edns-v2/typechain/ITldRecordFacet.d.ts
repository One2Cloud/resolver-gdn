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

interface ITldRecordFacetInterface extends ethers.utils.Interface {
  functions: {
    "getChains(bytes32)": FunctionFragment;
    "getClass(bytes32)": FunctionFragment;
    "getExpiry(bytes32)": FunctionFragment;
    "getOwner(bytes32)": FunctionFragment;
    "getResolver(bytes32)": FunctionFragment;
    "getTokenId(bytes)": FunctionFragment;
    "getWrapper(bytes32)": FunctionFragment;
    "isEnable(bytes32)": FunctionFragment;
    "isExists(bytes32)": FunctionFragment;
    "setEnable(bytes32,bool)": FunctionFragment;
    "setExpiry(bytes32,uint64)": FunctionFragment;
    "setOwner(bytes32,address)": FunctionFragment;
    "setRecord(uint8[],bytes,address,address,uint64,bool,uint8)": FunctionFragment;
    "setResolver(bytes32,address)": FunctionFragment;
    "setWrapper(bytes32,bool,address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getChains",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "getClass", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getExpiry",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "getResolver",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getWrapper",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "isEnable", values: [BytesLike]): string;
  encodeFunctionData(functionFragment: "isExists", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setEnable",
    values: [BytesLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setExpiry",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwner",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRecord",
    values: [
      BigNumberish[],
      BytesLike,
      string,
      string,
      BigNumberish,
      boolean,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setResolver",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setWrapper",
    values: [BytesLike, boolean, string]
  ): string;

  decodeFunctionResult(functionFragment: "getChains", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getClass", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getExpiry", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getWrapper", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isEnable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isExists", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setEnable", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setExpiry", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setRecord", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setWrapper", data: BytesLike): Result;

  events: {
    "NewTld(uint8,bytes,address)": EventFragment;
    "RemoveTld(bytes32)": EventFragment;
    "SetTldEnable(bytes32,bool)": EventFragment;
    "SetTldExpiry(bytes32,uint64)": EventFragment;
    "SetTldOwner(bytes32,address)": EventFragment;
    "SetTldResolver(bytes32,address)": EventFragment;
    "SetTldWrapper(bytes32,address,bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewTld"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveTld"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTldEnable"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTldExpiry"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTldOwner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTldResolver"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetTldWrapper"): EventFragment;
}

export type NewTldEvent = TypedEvent<
  [number, string, string] & { class_: number; tld: string; owner: string }
>;

export type RemoveTldEvent = TypedEvent<[string] & { tld: string }>;

export type SetTldEnableEvent = TypedEvent<
  [string, boolean] & { tld: string; enable: boolean }
>;

export type SetTldExpiryEvent = TypedEvent<
  [string, BigNumber] & { tld: string; expiry: BigNumber }
>;

export type SetTldOwnerEvent = TypedEvent<
  [string, string] & { tld: string; owner: string }
>;

export type SetTldResolverEvent = TypedEvent<
  [string, string] & { tld: string; resolver: string }
>;

export type SetTldWrapperEvent = TypedEvent<
  [string, string, boolean] & { tld: string; wrapper: string; enable: boolean }
>;

export class ITldRecordFacet extends BaseContract {
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

  interface: ITldRecordFacetInterface;

  functions: {
    getChains(tld: BytesLike, overrides?: CallOverrides): Promise<[number[]]>;

    getClass(tld: BytesLike, overrides?: CallOverrides): Promise<[number]>;

    getExpiry(tld: BytesLike, overrides?: CallOverrides): Promise<[BigNumber]>;

    getOwner(tld: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getResolver(tld: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getTokenId(
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getWrapper(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[[boolean, string] & { enable: boolean; address_: string }]>;

    isEnable(tld: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;

    isExists(tld: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;

    setEnable(
      tld: BytesLike,
      enable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setExpiry(
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRecord(
      chains: BigNumberish[],
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      enable: boolean,
      class_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setResolver(
      tld: BytesLike,
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setWrapper(
      tld: BytesLike,
      enable_: boolean,
      wrapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getChains(tld: BytesLike, overrides?: CallOverrides): Promise<number[]>;

  getClass(tld: BytesLike, overrides?: CallOverrides): Promise<number>;

  getExpiry(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

  getOwner(tld: BytesLike, overrides?: CallOverrides): Promise<string>;

  getResolver(tld: BytesLike, overrides?: CallOverrides): Promise<string>;

  getTokenId(
    tld: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getWrapper(
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<[boolean, string] & { enable: boolean; address_: string }>;

  isEnable(tld: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  isExists(tld: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  setEnable(
    tld: BytesLike,
    enable: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setExpiry(
    tld: BytesLike,
    expiry: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    tld: BytesLike,
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRecord(
    chains: BigNumberish[],
    tld: BytesLike,
    owner: string,
    resolver: string,
    expiry: BigNumberish,
    enable: boolean,
    class_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setResolver(
    tld: BytesLike,
    resolver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setWrapper(
    tld: BytesLike,
    enable_: boolean,
    wrapper: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getChains(tld: BytesLike, overrides?: CallOverrides): Promise<number[]>;

    getClass(tld: BytesLike, overrides?: CallOverrides): Promise<number>;

    getExpiry(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getOwner(tld: BytesLike, overrides?: CallOverrides): Promise<string>;

    getResolver(tld: BytesLike, overrides?: CallOverrides): Promise<string>;

    getTokenId(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getWrapper(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean, string] & { enable: boolean; address_: string }>;

    isEnable(tld: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    isExists(tld: BytesLike, overrides?: CallOverrides): Promise<boolean>;

    setEnable(
      tld: BytesLike,
      enable: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setExpiry(
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setOwner(
      tld: BytesLike,
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setRecord(
      chains: BigNumberish[],
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      enable: boolean,
      class_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setResolver(
      tld: BytesLike,
      resolver: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setWrapper(
      tld: BytesLike,
      enable_: boolean,
      wrapper: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "NewTld(uint8,bytes,address)"(
      class_?: null,
      tld?: null,
      owner?: null
    ): TypedEventFilter<
      [number, string, string],
      { class_: number; tld: string; owner: string }
    >;

    NewTld(
      class_?: null,
      tld?: null,
      owner?: null
    ): TypedEventFilter<
      [number, string, string],
      { class_: number; tld: string; owner: string }
    >;

    "RemoveTld(bytes32)"(
      tld?: null
    ): TypedEventFilter<[string], { tld: string }>;

    RemoveTld(tld?: null): TypedEventFilter<[string], { tld: string }>;

    "SetTldEnable(bytes32,bool)"(
      tld?: null,
      enable?: null
    ): TypedEventFilter<[string, boolean], { tld: string; enable: boolean }>;

    SetTldEnable(
      tld?: null,
      enable?: null
    ): TypedEventFilter<[string, boolean], { tld: string; enable: boolean }>;

    "SetTldExpiry(bytes32,uint64)"(
      tld?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { tld: string; expiry: BigNumber }
    >;

    SetTldExpiry(
      tld?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, BigNumber],
      { tld: string; expiry: BigNumber }
    >;

    "SetTldOwner(bytes32,address)"(
      tld?: null,
      owner?: null
    ): TypedEventFilter<[string, string], { tld: string; owner: string }>;

    SetTldOwner(
      tld?: null,
      owner?: null
    ): TypedEventFilter<[string, string], { tld: string; owner: string }>;

    "SetTldResolver(bytes32,address)"(
      tld?: null,
      resolver?: null
    ): TypedEventFilter<[string, string], { tld: string; resolver: string }>;

    SetTldResolver(
      tld?: null,
      resolver?: null
    ): TypedEventFilter<[string, string], { tld: string; resolver: string }>;

    "SetTldWrapper(bytes32,address,bool)"(
      tld?: null,
      wrapper?: null,
      enable?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { tld: string; wrapper: string; enable: boolean }
    >;

    SetTldWrapper(
      tld?: null,
      wrapper?: null,
      enable?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { tld: string; wrapper: string; enable: boolean }
    >;
  };

  estimateGas: {
    getChains(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getClass(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getExpiry(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getOwner(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getResolver(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    getTokenId(
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getWrapper(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    isEnable(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    isExists(tld: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;

    setEnable(
      tld: BytesLike,
      enable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setExpiry(
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRecord(
      chains: BigNumberish[],
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      enable: boolean,
      class_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setResolver(
      tld: BytesLike,
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setWrapper(
      tld: BytesLike,
      enable_: boolean,
      wrapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getChains(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClass(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getExpiry(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwner(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getResolver(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenId(
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getWrapper(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isEnable(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isExists(
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setEnable(
      tld: BytesLike,
      enable: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setExpiry(
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRecord(
      chains: BigNumberish[],
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      enable: boolean,
      class_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setResolver(
      tld: BytesLike,
      resolver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setWrapper(
      tld: BytesLike,
      enable_: boolean,
      wrapper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
