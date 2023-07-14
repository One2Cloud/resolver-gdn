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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IDNSRecordResolverInterface extends ethers.utils.Interface {
  functions: {
    "dnsRecord(bytes32,bytes32,uint16)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "dnsRecord",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "dnsRecord", data: BytesLike): Result;

  events: {
    "DNSRecordChanged(bytes32,bytes,uint16,bytes)": EventFragment;
    "DNSRecordDeleted(bytes32,bytes,uint16)": EventFragment;
    "DNSZoneCleared(bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DNSRecordChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSRecordDeleted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DNSZoneCleared"): EventFragment;
}

export type DNSRecordChangedEvent = TypedEvent<
  [string, string, number, string] & {
    node: string;
    name: string;
    resource: number;
    record: string;
  }
>;

export type DNSRecordDeletedEvent = TypedEvent<
  [string, string, number] & { node: string; name: string; resource: number }
>;

export type DNSZoneClearedEvent = TypedEvent<[string] & { node: string }>;

export class IDNSRecordResolver extends BaseContract {
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

  interface: IDNSRecordResolverInterface;

  functions: {
    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  dnsRecord(
    node: BytesLike,
    name: BytesLike,
    resource: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "DNSRecordChanged(bytes32,bytes,uint16,bytes)"(
      node?: BytesLike | null,
      name?: null,
      resource?: null,
      record?: null
    ): TypedEventFilter<
      [string, string, number, string],
      { node: string; name: string; resource: number; record: string }
    >;

    DNSRecordChanged(
      node?: BytesLike | null,
      name?: null,
      resource?: null,
      record?: null
    ): TypedEventFilter<
      [string, string, number, string],
      { node: string; name: string; resource: number; record: string }
    >;

    "DNSRecordDeleted(bytes32,bytes,uint16)"(
      node?: BytesLike | null,
      name?: null,
      resource?: null
    ): TypedEventFilter<
      [string, string, number],
      { node: string; name: string; resource: number }
    >;

    DNSRecordDeleted(
      node?: BytesLike | null,
      name?: null,
      resource?: null
    ): TypedEventFilter<
      [string, string, number],
      { node: string; name: string; resource: number }
    >;

    "DNSZoneCleared(bytes32)"(
      node?: BytesLike | null
    ): TypedEventFilter<[string], { node: string }>;

    DNSZoneCleared(
      node?: BytesLike | null
    ): TypedEventFilter<[string], { node: string }>;
  };

  estimateGas: {
    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    dnsRecord(
      node: BytesLike,
      name: BytesLike,
      resource: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
