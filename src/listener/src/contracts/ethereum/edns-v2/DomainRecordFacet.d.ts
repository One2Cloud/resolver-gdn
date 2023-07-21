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

interface DomainRecordFacetInterface extends ethers.utils.Interface {
  functions: {
    "ADMIN_ROLE()": FunctionFragment;
    "BRIDGE_ROLE()": FunctionFragment;
    "DEFAULT_ADMIN_ROLE()": FunctionFragment;
    "OPERATOR_ROLE()": FunctionFragment;
    "REGISTRAR_ROLE()": FunctionFragment;
    "ROOT_ROLE()": FunctionFragment;
    "WRAPPER_ROLE()": FunctionFragment;
    "bridge(bytes32,bytes32)": FunctionFragment;
    "getExpiry(bytes32,bytes32)": FunctionFragment;
    "getName(bytes32,bytes32)": FunctionFragment;
    "getOwner(bytes32,bytes32)": FunctionFragment;
    "getResolver(bytes32,bytes32)": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "getTokenId(bytes,bytes)": FunctionFragment;
    "getUser(bytes32,bytes32)": FunctionFragment;
    "getUserExpiry(bytes32,bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "isExists(bytes32,bytes32)": FunctionFragment;
    "isLive(bytes32,bytes32)": FunctionFragment;
    "isOperator(bytes32,bytes32,address)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setExpiry(bytes32,bytes32,uint64)": FunctionFragment;
    "setOperator(bytes32,bytes32,address,bool)": FunctionFragment;
    "setOwner(bytes32,bytes32,address)": FunctionFragment;
    "setRecord(bytes,bytes,address,address,uint64)": FunctionFragment;
    "setResolver(bytes32,bytes32,address)": FunctionFragment;
    "setUser(bytes32,bytes32,address,uint64)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "BRIDGE_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "OPERATOR_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "REGISTRAR_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ROOT_ROLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "WRAPPER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "bridge",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getExpiry",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getName",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getOwner",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getResolver",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUser",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserExpiry",
    values: [BytesLike, BytesLike]
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
    functionFragment: "isExists",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isLive",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isOperator",
    values: [BytesLike, BytesLike, string]
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
    functionFragment: "setExpiry",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setOperator",
    values: [BytesLike, BytesLike, string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setOwner",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setRecord",
    values: [BytesLike, BytesLike, string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setResolver",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setUser",
    values: [BytesLike, BytesLike, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "ADMIN_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "BRIDGE_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "OPERATOR_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "REGISTRAR_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ROOT_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "WRAPPER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "bridge", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getExpiry", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getName", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getUser", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getUserExpiry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isExists", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isLive", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isOperator", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setExpiry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setRecord", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setResolver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setUser", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;

  events: {
    "DomainBridged(bytes32,bytes32,uint8)": EventFragment;
    "NewDomain(bytes,bytes,address,uint64)": EventFragment;
    "RemoveDomain(bytes32,bytes32)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "SetDomainExpiry(bytes32,bytes32,uint64)": EventFragment;
    "SetDomainOperator(bytes32,bytes32,address,bool)": EventFragment;
    "SetDomainOwner(bytes32,bytes32,address)": EventFragment;
    "SetDomainResolver(bytes32,bytes32,address)": EventFragment;
    "SetDomainUser(bytes32,bytes32,address,uint64)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DomainBridged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewDomain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemoveDomain"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDomainExpiry"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDomainOperator"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDomainOwner"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDomainResolver"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetDomainUser"): EventFragment;
}

export type DomainBridgedEvent = TypedEvent<
  [string, string, number] & { name: string; tld: string; dstChain: number }
>;

export type NewDomainEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    name: string;
    tld: string;
    owner: string;
    expiry: BigNumber;
  }
>;

export type RemoveDomainEvent = TypedEvent<
  [string, string] & { name: string; tld: string }
>;

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

export type SetDomainExpiryEvent = TypedEvent<
  [string, string, BigNumber] & { name: string; tld: string; expiry: BigNumber }
>;

export type SetDomainOperatorEvent = TypedEvent<
  [string, string, string, boolean] & {
    name: string;
    tld: string;
    operator: string;
    approved: boolean;
  }
>;

export type SetDomainOwnerEvent = TypedEvent<
  [string, string, string] & { name: string; tld: string; owner: string }
>;

export type SetDomainResolverEvent = TypedEvent<
  [string, string, string] & { name: string; tld: string; newResolver: string }
>;

export type SetDomainUserEvent = TypedEvent<
  [string, string, string, BigNumber] & {
    name: string;
    tld: string;
    newUser: string;
    expiry: BigNumber;
  }
>;

export class DomainRecordFacet extends BaseContract {
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

  interface: DomainRecordFacetInterface;

  functions: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    BRIDGE_ROLE(overrides?: CallOverrides): Promise<[string]>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<[string]>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<[string]>;

    REGISTRAR_ROLE(overrides?: CallOverrides): Promise<[string]>;

    ROOT_ROLE(overrides?: CallOverrides): Promise<[string]>;

    WRAPPER_ROLE(overrides?: CallOverrides): Promise<[string]>;

    bridge(
      name: BytesLike,
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getName(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getOwner(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getResolver(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    getTokenId(
      name_: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUser(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getUserExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

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

    isExists(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isLive(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isOperator(
      name: BytesLike,
      tld: BytesLike,
      _operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

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

    setExpiry(
      name: BytesLike,
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOperator(
      name: BytesLike,
      tld: BytesLike,
      operator_: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setOwner(
      name: BytesLike,
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRecord(
      name: BytesLike,
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setResolver(
      name: BytesLike,
      tld: BytesLike,
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setUser(
      name: BytesLike,
      tld: BytesLike,
      user: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  BRIDGE_ROLE(overrides?: CallOverrides): Promise<string>;

  DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

  OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

  REGISTRAR_ROLE(overrides?: CallOverrides): Promise<string>;

  ROOT_ROLE(overrides?: CallOverrides): Promise<string>;

  WRAPPER_ROLE(overrides?: CallOverrides): Promise<string>;

  bridge(
    name: BytesLike,
    tld: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getExpiry(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getName(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getOwner(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getResolver(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  getTokenId(
    name_: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUser(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<string>;

  getUserExpiry(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

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

  isExists(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isLive(
    name: BytesLike,
    tld: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isOperator(
    name: BytesLike,
    tld: BytesLike,
    _operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

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

  setExpiry(
    name: BytesLike,
    tld: BytesLike,
    expiry: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOperator(
    name: BytesLike,
    tld: BytesLike,
    operator_: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setOwner(
    name: BytesLike,
    tld: BytesLike,
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRecord(
    name: BytesLike,
    tld: BytesLike,
    owner: string,
    resolver: string,
    expiry: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setResolver(
    name: BytesLike,
    tld: BytesLike,
    resolver_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setUser(
    name: BytesLike,
    tld: BytesLike,
    user: string,
    expiry: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceID: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    BRIDGE_ROLE(overrides?: CallOverrides): Promise<string>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<string>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<string>;

    REGISTRAR_ROLE(overrides?: CallOverrides): Promise<string>;

    ROOT_ROLE(overrides?: CallOverrides): Promise<string>;

    WRAPPER_ROLE(overrides?: CallOverrides): Promise<string>;

    bridge(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    getExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getName(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getOwner(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getResolver(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    getTokenId(
      name_: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUser(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<string>;

    getUserExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    isExists(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isLive(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isOperator(
      name: BytesLike,
      tld: BytesLike,
      _operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

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

    setExpiry(
      name: BytesLike,
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setOperator(
      name: BytesLike,
      tld: BytesLike,
      operator_: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setOwner(
      name: BytesLike,
      tld: BytesLike,
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setRecord(
      name: BytesLike,
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setResolver(
      name: BytesLike,
      tld: BytesLike,
      resolver_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setUser(
      name: BytesLike,
      tld: BytesLike,
      user: string,
      expiry: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "DomainBridged(bytes32,bytes32,uint8)"(
      name?: null,
      tld?: null,
      dstChain?: null
    ): TypedEventFilter<
      [string, string, number],
      { name: string; tld: string; dstChain: number }
    >;

    DomainBridged(
      name?: null,
      tld?: null,
      dstChain?: null
    ): TypedEventFilter<
      [string, string, number],
      { name: string; tld: string; dstChain: number }
    >;

    "NewDomain(bytes,bytes,address,uint64)"(
      name?: null,
      tld?: null,
      owner?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { name: string; tld: string; owner: string; expiry: BigNumber }
    >;

    NewDomain(
      name?: null,
      tld?: null,
      owner?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { name: string; tld: string; owner: string; expiry: BigNumber }
    >;

    "RemoveDomain(bytes32,bytes32)"(
      name?: null,
      tld?: null
    ): TypedEventFilter<[string, string], { name: string; tld: string }>;

    RemoveDomain(
      name?: null,
      tld?: null
    ): TypedEventFilter<[string, string], { name: string; tld: string }>;

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

    "SetDomainExpiry(bytes32,bytes32,uint64)"(
      name?: null,
      tld?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { name: string; tld: string; expiry: BigNumber }
    >;

    SetDomainExpiry(
      name?: null,
      tld?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { name: string; tld: string; expiry: BigNumber }
    >;

    "SetDomainOperator(bytes32,bytes32,address,bool)"(
      name?: null,
      tld?: null,
      operator?: null,
      approved?: null
    ): TypedEventFilter<
      [string, string, string, boolean],
      { name: string; tld: string; operator: string; approved: boolean }
    >;

    SetDomainOperator(
      name?: null,
      tld?: null,
      operator?: null,
      approved?: null
    ): TypedEventFilter<
      [string, string, string, boolean],
      { name: string; tld: string; operator: string; approved: boolean }
    >;

    "SetDomainOwner(bytes32,bytes32,address)"(
      name?: null,
      tld?: null,
      owner?: null
    ): TypedEventFilter<
      [string, string, string],
      { name: string; tld: string; owner: string }
    >;

    SetDomainOwner(
      name?: null,
      tld?: null,
      owner?: null
    ): TypedEventFilter<
      [string, string, string],
      { name: string; tld: string; owner: string }
    >;

    "SetDomainResolver(bytes32,bytes32,address)"(
      name?: null,
      tld?: null,
      newResolver?: null
    ): TypedEventFilter<
      [string, string, string],
      { name: string; tld: string; newResolver: string }
    >;

    SetDomainResolver(
      name?: null,
      tld?: null,
      newResolver?: null
    ): TypedEventFilter<
      [string, string, string],
      { name: string; tld: string; newResolver: string }
    >;

    "SetDomainUser(bytes32,bytes32,address,uint64)"(
      name?: null,
      tld?: null,
      newUser?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { name: string; tld: string; newUser: string; expiry: BigNumber }
    >;

    SetDomainUser(
      name?: null,
      tld?: null,
      newUser?: null,
      expiry?: null
    ): TypedEventFilter<
      [string, string, string, BigNumber],
      { name: string; tld: string; newUser: string; expiry: BigNumber }
    >;
  };

  estimateGas: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    BRIDGE_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    DEFAULT_ADMIN_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    REGISTRAR_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    ROOT_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    WRAPPER_ROLE(overrides?: CallOverrides): Promise<BigNumber>;

    bridge(
      name: BytesLike,
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getName(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwner(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getResolver(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenId(
      name_: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUser(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    isExists(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLive(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isOperator(
      name: BytesLike,
      tld: BytesLike,
      _operator: string,
      overrides?: CallOverrides
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

    setExpiry(
      name: BytesLike,
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOperator(
      name: BytesLike,
      tld: BytesLike,
      operator_: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setOwner(
      name: BytesLike,
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRecord(
      name: BytesLike,
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setResolver(
      name: BytesLike,
      tld: BytesLike,
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setUser(
      name: BytesLike,
      tld: BytesLike,
      user: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    ADMIN_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    BRIDGE_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    DEFAULT_ADMIN_ROLE(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    OPERATOR_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    REGISTRAR_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROOT_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WRAPPER_ROLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bridge(
      name: BytesLike,
      tld: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getName(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwner(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getResolver(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenId(
      name_: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUser(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserExpiry(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

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

    isExists(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLive(
      name: BytesLike,
      tld: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isOperator(
      name: BytesLike,
      tld: BytesLike,
      _operator: string,
      overrides?: CallOverrides
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

    setExpiry(
      name: BytesLike,
      tld: BytesLike,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOperator(
      name: BytesLike,
      tld: BytesLike,
      operator_: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setOwner(
      name: BytesLike,
      tld: BytesLike,
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRecord(
      name: BytesLike,
      tld: BytesLike,
      owner: string,
      resolver: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setResolver(
      name: BytesLike,
      tld: BytesLike,
      resolver_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setUser(
      name: BytesLike,
      tld: BytesLike,
      user: string,
      expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceID: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
