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

export interface ISynchronizerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "estimateSyncFee"
      | "getRemoteSynchronizer"
      | "getUserDefaultProvider"
      | "setRemoteSynchronizer"
      | "setUserDefaultProvider"
      | "sync"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "ApplicationError" | "IncomingSync" | "OutgoingSync"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "estimateSyncFee",
    values: [BigNumberish, BigNumberish, BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRemoteSynchronizer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserDefaultProvider",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setRemoteSynchronizer",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setUserDefaultProvider",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sync",
    values: [AddressLike, BigNumberish, BigNumberish, BigNumberish[], BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "estimateSyncFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRemoteSynchronizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserDefaultProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRemoteSynchronizer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUserDefaultProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sync", data: BytesLike): Result;
}

export namespace ApplicationErrorEvent {
  export type InputTuple = [action: BigNumberish, reason: string];
  export type OutputTuple = [action: bigint, reason: string];
  export interface OutputObject {
    action: bigint;
    reason: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace IncomingSyncEvent {
  export type InputTuple = [action: BigNumberish, target: AddressLike];
  export type OutputTuple = [action: bigint, target: string];
  export interface OutputObject {
    action: bigint;
    target: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OutgoingSyncEvent {
  export type InputTuple = [
    action: BigNumberish,
    provider: BigNumberish,
    dstChains: BigNumberish[]
  ];
  export type OutputTuple = [
    action: bigint,
    provider: bigint,
    dstChains: bigint[]
  ];
  export interface OutputObject {
    action: bigint;
    provider: bigint;
    dstChains: bigint[];
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ISynchronizer extends BaseContract {
  connect(runner?: ContractRunner | null): ISynchronizer;
  waitForDeployment(): Promise<this>;

  interface: ISynchronizerInterface;

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

  estimateSyncFee: TypedContractMethod<
    [
      action: BigNumberish,
      provider: BigNumberish,
      dstChains: BigNumberish[],
      ews: BytesLike
    ],
    [bigint],
    "view"
  >;

  getRemoteSynchronizer: TypedContractMethod<
    [chain: BigNumberish],
    [string],
    "view"
  >;

  getUserDefaultProvider: TypedContractMethod<
    [user: AddressLike],
    [bigint],
    "view"
  >;

  setRemoteSynchronizer: TypedContractMethod<
    [chain: BigNumberish, target: AddressLike],
    [void],
    "nonpayable"
  >;

  setUserDefaultProvider: TypedContractMethod<
    [user: AddressLike, provider: BigNumberish],
    [void],
    "nonpayable"
  >;

  sync: TypedContractMethod<
    [
      sender: AddressLike,
      action: BigNumberish,
      provider: BigNumberish,
      dstChains: BigNumberish[],
      ews: BytesLike
    ],
    [void],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "estimateSyncFee"
  ): TypedContractMethod<
    [
      action: BigNumberish,
      provider: BigNumberish,
      dstChains: BigNumberish[],
      ews: BytesLike
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRemoteSynchronizer"
  ): TypedContractMethod<[chain: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getUserDefaultProvider"
  ): TypedContractMethod<[user: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "setRemoteSynchronizer"
  ): TypedContractMethod<
    [chain: BigNumberish, target: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setUserDefaultProvider"
  ): TypedContractMethod<
    [user: AddressLike, provider: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "sync"
  ): TypedContractMethod<
    [
      sender: AddressLike,
      action: BigNumberish,
      provider: BigNumberish,
      dstChains: BigNumberish[],
      ews: BytesLike
    ],
    [void],
    "payable"
  >;

  getEvent(
    key: "ApplicationError"
  ): TypedContractEvent<
    ApplicationErrorEvent.InputTuple,
    ApplicationErrorEvent.OutputTuple,
    ApplicationErrorEvent.OutputObject
  >;
  getEvent(
    key: "IncomingSync"
  ): TypedContractEvent<
    IncomingSyncEvent.InputTuple,
    IncomingSyncEvent.OutputTuple,
    IncomingSyncEvent.OutputObject
  >;
  getEvent(
    key: "OutgoingSync"
  ): TypedContractEvent<
    OutgoingSyncEvent.InputTuple,
    OutgoingSyncEvent.OutputTuple,
    OutgoingSyncEvent.OutputObject
  >;

  filters: {
    "ApplicationError(uint8,string)": TypedContractEvent<
      ApplicationErrorEvent.InputTuple,
      ApplicationErrorEvent.OutputTuple,
      ApplicationErrorEvent.OutputObject
    >;
    ApplicationError: TypedContractEvent<
      ApplicationErrorEvent.InputTuple,
      ApplicationErrorEvent.OutputTuple,
      ApplicationErrorEvent.OutputObject
    >;

    "IncomingSync(uint8,address)": TypedContractEvent<
      IncomingSyncEvent.InputTuple,
      IncomingSyncEvent.OutputTuple,
      IncomingSyncEvent.OutputObject
    >;
    IncomingSync: TypedContractEvent<
      IncomingSyncEvent.InputTuple,
      IncomingSyncEvent.OutputTuple,
      IncomingSyncEvent.OutputObject
    >;

    "OutgoingSync(uint8,uint8,uint8[])": TypedContractEvent<
      OutgoingSyncEvent.InputTuple,
      OutgoingSyncEvent.OutputTuple,
      OutgoingSyncEvent.OutputObject
    >;
    OutgoingSync: TypedContractEvent<
      OutgoingSyncEvent.InputTuple,
      OutgoingSyncEvent.OutputTuple,
      OutgoingSyncEvent.OutputObject
    >;
  };
}