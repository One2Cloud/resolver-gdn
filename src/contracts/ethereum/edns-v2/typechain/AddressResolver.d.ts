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

interface AddressResolverInterface extends ethers.utils.Interface {
  functions: {
    "ADMIN_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "MAX_LABEL_LENGTH()": FunctionFragment;
    "MIN_LABEL_LENGTH()": FunctionFragment;
    "getAddress(bytes,bytes,bytes)": FunctionFragment;
    "getReverseAddress(address)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "getSynchronizer()": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "receiveSync(bytes)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setAddress(bytes,bytes,bytes,address)": FunctionFragment;
    "setReverseAddress(bytes,bytes,bytes,address)": FunctionFragment;
    "setSynchronizer(address)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "unsetAddress(bytes,bytes,bytes)": FunctionFragment;
    "unsetReverseAddress(bytes,bytes,bytes,address)": FunctionFragment;
    "upgradeTo(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
    "valid(bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MAX_LABEL_LENGTH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MIN_LABEL_LENGTH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAddress",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getReverseAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getSynchronizer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "receiveSync",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddress",
    values: [BytesLike, BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setReverseAddress",
    values: [BytesLike, BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setSynchronizer",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unsetAddress",
    values: [BytesLike, BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unsetReverseAddress",
    values: [BytesLike, BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "upgradeTo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "valid", values: [BytesLike]): string;

  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MAX_LABEL_LENGTH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MIN_LABEL_LENGTH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReverseAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSynchronizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveSync",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setAddress", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setReverseAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSynchronizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsetAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsetReverseAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "upgradeTo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "valid", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "BeaconUpgraded(address)": EventFragment;
    "ExecuteSync(bool,bytes)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "RequestSync(bytes)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "SetAddress(bytes,bytes,bytes,address)": EventFragment;
    "SetReverseAddress(bytes,bytes,bytes,address)": EventFragment;
    "SyncError(bytes,bytes)": EventFragment;
    "UnsetAddress(bytes,bytes,bytes)": EventFragment;
    "UnsetReverseAddress(bytes,bytes,bytes,address)": EventFragment;
    "Upgraded(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "BeaconUpgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExecuteSync"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestSync"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetReverseAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SyncError"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnsetAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UnsetReverseAddress"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
}

export type AdminChangedEvent = TypedEvent<
  [string, string] & { previousAdmin: string; newAdmin: string }
>;

export type BeaconUpgradedEvent = TypedEvent<[string] & { beacon: string }>;

export type ExecuteSyncEvent = TypedEvent<
  [boolean, string] & { success: boolean; ews: string }
>;

export type InitializedEvent = TypedEvent<[number] & { version: number }>;

export type RequestSyncEvent = TypedEvent<[string] & { ews: string }>;

export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string] & {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type SetAddressEvent = TypedEvent<
  [string, string, string, string] & {
    host: string;
    name: string;
    tld: string;
    address_: string;
  }
>;

export type SetReverseAddressEvent = TypedEvent<
  [string, string, string, string] & {
    host: string;
    name: string;
    tld: string;
    address_: string;
  }
>;

export type SyncErrorEvent = TypedEvent<
  [string, string] & { ews: string; reason: string }
>;

export type UnsetAddressEvent = TypedEvent<
  [string, string, string] & { host: string; name: string; tld: string }
>;

export type UnsetReverseAddressEvent = TypedEvent<
  [string, string, string, string] & {
    host: string;
    name: string;
    tld: string;
    address_: string;
  }
>;

export type UpgradedEvent = TypedEvent<[string] & { implementation: string }>;

export class AddressResolver extends BaseContract {
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

  interface: AddressResolverInterface;

  functions: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    MAX_LABEL_LENGTH(overrides?: CallOverrides): Promise<[BigNumber]>;

    MIN_LABEL_LENGTH(overrides?: CallOverrides): Promise<[BigNumber]>;

    getAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getReverseAddress(
      address_: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getSynchronizer(overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    receiveSync(
      ews: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSynchronizer(
      synchronizer_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    unsetAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unsetReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    valid(label: BytesLike, overrides?: CallOverrides): Promise<[boolean]>;
  };

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  MAX_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

  MIN_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

  getAddress(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getReverseAddress(
    address_: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  getSynchronizer(overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  receiveSync(
    ews: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setAddress(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    address_: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setReverseAddress(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    address_: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSynchronizer(
    synchronizer_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  unsetAddress(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unsetReverseAddress(
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    address_: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeTo(
    newImplementation: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: string,
    data: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  valid(label: BytesLike, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    MAX_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

    MIN_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

    getAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getReverseAddress(
      address_: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    getSynchronizer(overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    receiveSync(ews: BytesLike, overrides?: CallOverrides): Promise<void>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setSynchronizer(
      synchronizer_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    unsetAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    unsetReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeTo(
      newImplementation: string,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    valid(label: BytesLike, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    "AdminChanged(address,address)"(
      previousAdmin?: null,
      newAdmin?: null
    ): TypedEventFilter<
      [string, string],
      { previousAdmin: string; newAdmin: string }
    >;

    AdminChanged(
      previousAdmin?: null,
      newAdmin?: null
    ): TypedEventFilter<
      [string, string],
      { previousAdmin: string; newAdmin: string }
    >;

    "BeaconUpgraded(address)"(
      beacon?: string | null
    ): TypedEventFilter<[string], { beacon: string }>;

    BeaconUpgraded(
      beacon?: string | null
    ): TypedEventFilter<[string], { beacon: string }>;

    "ExecuteSync(bool,bytes)"(
      success?: null,
      ews?: null
    ): TypedEventFilter<[boolean, string], { success: boolean; ews: string }>;

    ExecuteSync(
      success?: null,
      ews?: null
    ): TypedEventFilter<[boolean, string], { success: boolean; ews: string }>;

    "Initialized(uint8)"(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    Initialized(
      version?: null
    ): TypedEventFilter<[number], { version: number }>;

    "RequestSync(bytes)"(
      ews?: null
    ): TypedEventFilter<[string], { ews: string }>;

    RequestSync(ews?: null): TypedEventFilter<[string], { ews: string }>;

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      previousAdminRole?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; previousAdminRole: string; newAdminRole: string }
    >;

    "RoleGranted(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes32,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "SetAddress(bytes,bytes,bytes,address)"(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    SetAddress(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    "SetReverseAddress(bytes,bytes,bytes,address)"(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    SetReverseAddress(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    "SyncError(bytes,bytes)"(
      ews?: null,
      reason?: null
    ): TypedEventFilter<[string, string], { ews: string; reason: string }>;

    SyncError(
      ews?: null,
      reason?: null
    ): TypedEventFilter<[string, string], { ews: string; reason: string }>;

    "UnsetAddress(bytes,bytes,bytes)"(
      host?: null,
      name?: null,
      tld?: null
    ): TypedEventFilter<
      [string, string, string],
      { host: string; name: string; tld: string }
    >;

    UnsetAddress(
      host?: null,
      name?: null,
      tld?: null
    ): TypedEventFilter<
      [string, string, string],
      { host: string; name: string; tld: string }
    >;

    "UnsetReverseAddress(bytes,bytes,bytes,address)"(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    UnsetReverseAddress(
      host?: null,
      name?: null,
      tld?: null,
      address_?: null
    ): TypedEventFilter<
      [string, string, string, string],
      { host: string; name: string; tld: string; address_: string }
    >;

    "Upgraded(address)"(
      implementation?: string | null
    ): TypedEventFilter<[string], { implementation: string }>;

    Upgraded(
      implementation?: string | null
    ): TypedEventFilter<[string], { implementation: string }>;
  };

  estimateGas: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    MAX_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

    MIN_LABEL_LENGTH(overrides?: CallOverrides): Promise<BigNumber>;

    getAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReverseAddress(
      address_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSynchronizer(overrides?: CallOverrides): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    receiveSync(
      ews: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSynchronizer(
      synchronizer_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    unsetAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unsetReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    valid(label: BytesLike, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    MAX_LABEL_LENGTH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MIN_LABEL_LENGTH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReverseAddress(
      address_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSynchronizer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    receiveSync(
      ews: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSynchronizer(
      synchronizer_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    unsetAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unsetReverseAddress(
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      address_: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeTo(
      newImplementation: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: string,
      data: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    valid(
      label: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}