/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../common";

export interface AddressResolverInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "ADMIN_ROLE"
      | "DEFAULT_ADMIN_ROLE"
      | "MAX_LABEL_LENGTH"
      | "MIN_LABEL_LENGTH"
      | "getAddress"
      | "getReverseAddress"
      | "getRoleAdmin"
      | "getSynchronizer"
      | "grantRole"
      | "hasRole"
      | "proxiableUUID"
      | "receiveSync"
      | "renounceRole"
      | "revokeRole"
      | "setAddress"
      | "setReverseAddress"
      | "setSynchronizer"
      | "supportsInterface"
      | "unsetAddress"
      | "unsetReverseAddress"
      | "upgradeTo"
      | "upgradeToAndCall"
      | "valid"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdminChanged"
      | "BeaconUpgraded"
      | "ExecuteSync"
      | "Initialized"
      | "RequestSync"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
      | "SetAddress"
      | "SetReverseAddress"
      | "SyncError"
      | "UnsetAddress"
      | "UnsetReverseAddress"
      | "Upgraded"
  ): EventFragment;

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
    values: [AddressLike]
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
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
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
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setAddress",
    values: [BytesLike, BytesLike, BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setReverseAddress",
    values: [BytesLike, BytesLike, BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setSynchronizer",
    values: [AddressLike]
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
    values: [BytesLike, BytesLike, BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeTo",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [AddressLike, BytesLike]
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
}

export namespace AdminChangedEvent {
  export type InputTuple = [previousAdmin: AddressLike, newAdmin: AddressLike];
  export type OutputTuple = [previousAdmin: string, newAdmin: string];
  export interface OutputObject {
    previousAdmin: string;
    newAdmin: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BeaconUpgradedEvent {
  export type InputTuple = [beacon: AddressLike];
  export type OutputTuple = [beacon: string];
  export interface OutputObject {
    beacon: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ExecuteSyncEvent {
  export type InputTuple = [success: boolean, ews: BytesLike];
  export type OutputTuple = [success: boolean, ews: string];
  export interface OutputObject {
    success: boolean;
    ews: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RequestSyncEvent {
  export type InputTuple = [ews: BytesLike];
  export type OutputTuple = [ews: string];
  export interface OutputObject {
    ews: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetAddressEvent {
  export type InputTuple = [
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    address_: AddressLike
  ];
  export type OutputTuple = [
    host: string,
    name: string,
    tld: string,
    address_: string
  ];
  export interface OutputObject {
    host: string;
    name: string;
    tld: string;
    address_: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetReverseAddressEvent {
  export type InputTuple = [
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    address_: AddressLike
  ];
  export type OutputTuple = [
    host: string,
    name: string,
    tld: string,
    address_: string
  ];
  export interface OutputObject {
    host: string;
    name: string;
    tld: string;
    address_: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SyncErrorEvent {
  export type InputTuple = [ews: BytesLike, reason: BytesLike];
  export type OutputTuple = [ews: string, reason: string];
  export interface OutputObject {
    ews: string;
    reason: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnsetAddressEvent {
  export type InputTuple = [host: BytesLike, name: BytesLike, tld: BytesLike];
  export type OutputTuple = [host: string, name: string, tld: string];
  export interface OutputObject {
    host: string;
    name: string;
    tld: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnsetReverseAddressEvent {
  export type InputTuple = [address_: AddressLike];
  export type OutputTuple = [address_: string];
  export interface OutputObject {
    address_: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UpgradedEvent {
  export type InputTuple = [implementation: AddressLike];
  export type OutputTuple = [implementation: string];
  export interface OutputObject {
    implementation: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AddressResolver extends BaseContract {
  connect(runner?: ContractRunner | null): AddressResolver;
  waitForDeployment(): Promise<this>;

  interface: AddressResolverInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  MAX_LABEL_LENGTH: TypedContractMethod<[], [bigint], "view">;

  MIN_LABEL_LENGTH: TypedContractMethod<[], [bigint], "view">;

  getAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike],
    [string],
    "view"
  >;

  getReverseAddress: TypedContractMethod<
    [address_: AddressLike],
    [string],
    "view"
  >;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  getSynchronizer: TypedContractMethod<[], [string], "view">;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  proxiableUUID: TypedContractMethod<[], [string], "view">;

  receiveSync: TypedContractMethod<[ews: BytesLike], [void], "nonpayable">;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  setAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;

  setReverseAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;

  setSynchronizer: TypedContractMethod<
    [synchronizer_: AddressLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceID: BytesLike],
    [boolean],
    "view"
  >;

  unsetAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike],
    [void],
    "payable"
  >;

  unsetReverseAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;

  upgradeTo: TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeToAndCall: TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  valid: TypedContractMethod<[label: BytesLike], [boolean], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "MAX_LABEL_LENGTH"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "MIN_LABEL_LENGTH"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "getReverseAddress"
  ): TypedContractMethod<[address_: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "getSynchronizer"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "proxiableUUID"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "receiveSync"
  ): TypedContractMethod<[ews: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setReverseAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "setSynchronizer"
  ): TypedContractMethod<[synchronizer_: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceID: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "unsetAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "unsetReverseAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, address_: AddressLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "upgradeTo"
  ): TypedContractMethod<
    [newImplementation: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "upgradeToAndCall"
  ): TypedContractMethod<
    [newImplementation: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "valid"
  ): TypedContractMethod<[label: BytesLike], [boolean], "view">;

  getEvent(
    key: "AdminChanged"
  ): TypedContractEvent<
    AdminChangedEvent.InputTuple,
    AdminChangedEvent.OutputTuple,
    AdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "BeaconUpgraded"
  ): TypedContractEvent<
    BeaconUpgradedEvent.InputTuple,
    BeaconUpgradedEvent.OutputTuple,
    BeaconUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "ExecuteSync"
  ): TypedContractEvent<
    ExecuteSyncEvent.InputTuple,
    ExecuteSyncEvent.OutputTuple,
    ExecuteSyncEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "RequestSync"
  ): TypedContractEvent<
    RequestSyncEvent.InputTuple,
    RequestSyncEvent.OutputTuple,
    RequestSyncEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;
  getEvent(
    key: "SetAddress"
  ): TypedContractEvent<
    SetAddressEvent.InputTuple,
    SetAddressEvent.OutputTuple,
    SetAddressEvent.OutputObject
  >;
  getEvent(
    key: "SetReverseAddress"
  ): TypedContractEvent<
    SetReverseAddressEvent.InputTuple,
    SetReverseAddressEvent.OutputTuple,
    SetReverseAddressEvent.OutputObject
  >;
  getEvent(
    key: "SyncError"
  ): TypedContractEvent<
    SyncErrorEvent.InputTuple,
    SyncErrorEvent.OutputTuple,
    SyncErrorEvent.OutputObject
  >;
  getEvent(
    key: "UnsetAddress"
  ): TypedContractEvent<
    UnsetAddressEvent.InputTuple,
    UnsetAddressEvent.OutputTuple,
    UnsetAddressEvent.OutputObject
  >;
  getEvent(
    key: "UnsetReverseAddress"
  ): TypedContractEvent<
    UnsetReverseAddressEvent.InputTuple,
    UnsetReverseAddressEvent.OutputTuple,
    UnsetReverseAddressEvent.OutputObject
  >;
  getEvent(
    key: "Upgraded"
  ): TypedContractEvent<
    UpgradedEvent.InputTuple,
    UpgradedEvent.OutputTuple,
    UpgradedEvent.OutputObject
  >;

  filters: {
    "AdminChanged(address,address)": TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;
    AdminChanged: TypedContractEvent<
      AdminChangedEvent.InputTuple,
      AdminChangedEvent.OutputTuple,
      AdminChangedEvent.OutputObject
    >;

    "BeaconUpgraded(address)": TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;
    BeaconUpgraded: TypedContractEvent<
      BeaconUpgradedEvent.InputTuple,
      BeaconUpgradedEvent.OutputTuple,
      BeaconUpgradedEvent.OutputObject
    >;

    "ExecuteSync(bool,bytes)": TypedContractEvent<
      ExecuteSyncEvent.InputTuple,
      ExecuteSyncEvent.OutputTuple,
      ExecuteSyncEvent.OutputObject
    >;
    ExecuteSync: TypedContractEvent<
      ExecuteSyncEvent.InputTuple,
      ExecuteSyncEvent.OutputTuple,
      ExecuteSyncEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "RequestSync(bytes)": TypedContractEvent<
      RequestSyncEvent.InputTuple,
      RequestSyncEvent.OutputTuple,
      RequestSyncEvent.OutputObject
    >;
    RequestSync: TypedContractEvent<
      RequestSyncEvent.InputTuple,
      RequestSyncEvent.OutputTuple,
      RequestSyncEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;

    "SetAddress(bytes,bytes,bytes,address)": TypedContractEvent<
      SetAddressEvent.InputTuple,
      SetAddressEvent.OutputTuple,
      SetAddressEvent.OutputObject
    >;
    SetAddress: TypedContractEvent<
      SetAddressEvent.InputTuple,
      SetAddressEvent.OutputTuple,
      SetAddressEvent.OutputObject
    >;

    "SetReverseAddress(bytes,bytes,bytes,address)": TypedContractEvent<
      SetReverseAddressEvent.InputTuple,
      SetReverseAddressEvent.OutputTuple,
      SetReverseAddressEvent.OutputObject
    >;
    SetReverseAddress: TypedContractEvent<
      SetReverseAddressEvent.InputTuple,
      SetReverseAddressEvent.OutputTuple,
      SetReverseAddressEvent.OutputObject
    >;

    "SyncError(bytes,bytes)": TypedContractEvent<
      SyncErrorEvent.InputTuple,
      SyncErrorEvent.OutputTuple,
      SyncErrorEvent.OutputObject
    >;
    SyncError: TypedContractEvent<
      SyncErrorEvent.InputTuple,
      SyncErrorEvent.OutputTuple,
      SyncErrorEvent.OutputObject
    >;

    "UnsetAddress(bytes,bytes,bytes)": TypedContractEvent<
      UnsetAddressEvent.InputTuple,
      UnsetAddressEvent.OutputTuple,
      UnsetAddressEvent.OutputObject
    >;
    UnsetAddress: TypedContractEvent<
      UnsetAddressEvent.InputTuple,
      UnsetAddressEvent.OutputTuple,
      UnsetAddressEvent.OutputObject
    >;

    "UnsetReverseAddress(address)": TypedContractEvent<
      UnsetReverseAddressEvent.InputTuple,
      UnsetReverseAddressEvent.OutputTuple,
      UnsetReverseAddressEvent.OutputObject
    >;
    UnsetReverseAddress: TypedContractEvent<
      UnsetReverseAddressEvent.InputTuple,
      UnsetReverseAddressEvent.OutputTuple,
      UnsetReverseAddressEvent.OutputObject
    >;

    "Upgraded(address)": TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
    Upgraded: TypedContractEvent<
      UpgradedEvent.InputTuple,
      UpgradedEvent.OutputTuple,
      UpgradedEvent.OutputObject
    >;
  };
}
