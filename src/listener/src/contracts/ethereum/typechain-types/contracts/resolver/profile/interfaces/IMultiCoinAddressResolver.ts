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
} from "../../../../common";

export interface IMultiCoinAddressResolverInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getMultiCoinAddress"
      | "setMultiCoinAddress"
      | "unsetMultiCoinAddress"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "SetMultiCoinAddress" | "UnsetMultiCoinAddress"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getMultiCoinAddress",
    values: [BytesLike, BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMultiCoinAddress",
    values: [BytesLike, BytesLike, BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unsetMultiCoinAddress",
    values: [BytesLike, BytesLike, BytesLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getMultiCoinAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMultiCoinAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsetMultiCoinAddress",
    data: BytesLike
  ): Result;
}

export namespace SetMultiCoinAddressEvent {
  export type InputTuple = [
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    coin: BigNumberish,
    address_: BytesLike
  ];
  export type OutputTuple = [
    host: string,
    name: string,
    tld: string,
    coin: bigint,
    address_: string
  ];
  export interface OutputObject {
    host: string;
    name: string;
    tld: string;
    coin: bigint;
    address_: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace UnsetMultiCoinAddressEvent {
  export type InputTuple = [
    host: BytesLike,
    name: BytesLike,
    tld: BytesLike,
    coin: BigNumberish
  ];
  export type OutputTuple = [
    host: string,
    name: string,
    tld: string,
    coin: bigint
  ];
  export interface OutputObject {
    host: string;
    name: string;
    tld: string;
    coin: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IMultiCoinAddressResolver extends BaseContract {
  connect(runner?: ContractRunner | null): IMultiCoinAddressResolver;
  waitForDeployment(): Promise<this>;

  interface: IMultiCoinAddressResolverInterface;

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

  getMultiCoinAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, coin: BigNumberish],
    [string],
    "view"
  >;

  setMultiCoinAddress: TypedContractMethod<
    [
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      coin: BigNumberish,
      address_: BytesLike
    ],
    [void],
    "payable"
  >;

  unsetMultiCoinAddress: TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, coin: BigNumberish],
    [void],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getMultiCoinAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, coin: BigNumberish],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "setMultiCoinAddress"
  ): TypedContractMethod<
    [
      host: BytesLike,
      name: BytesLike,
      tld: BytesLike,
      coin: BigNumberish,
      address_: BytesLike
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "unsetMultiCoinAddress"
  ): TypedContractMethod<
    [host: BytesLike, name: BytesLike, tld: BytesLike, coin: BigNumberish],
    [void],
    "payable"
  >;

  getEvent(
    key: "SetMultiCoinAddress"
  ): TypedContractEvent<
    SetMultiCoinAddressEvent.InputTuple,
    SetMultiCoinAddressEvent.OutputTuple,
    SetMultiCoinAddressEvent.OutputObject
  >;
  getEvent(
    key: "UnsetMultiCoinAddress"
  ): TypedContractEvent<
    UnsetMultiCoinAddressEvent.InputTuple,
    UnsetMultiCoinAddressEvent.OutputTuple,
    UnsetMultiCoinAddressEvent.OutputObject
  >;

  filters: {
    "SetMultiCoinAddress(bytes,bytes,bytes,uint256,bytes)": TypedContractEvent<
      SetMultiCoinAddressEvent.InputTuple,
      SetMultiCoinAddressEvent.OutputTuple,
      SetMultiCoinAddressEvent.OutputObject
    >;
    SetMultiCoinAddress: TypedContractEvent<
      SetMultiCoinAddressEvent.InputTuple,
      SetMultiCoinAddressEvent.OutputTuple,
      SetMultiCoinAddressEvent.OutputObject
    >;

    "UnsetMultiCoinAddress(bytes,bytes,bytes,uint256)": TypedContractEvent<
      UnsetMultiCoinAddressEvent.InputTuple,
      UnsetMultiCoinAddressEvent.OutputTuple,
      UnsetMultiCoinAddressEvent.OutputObject
    >;
    UnsetMultiCoinAddress: TypedContractEvent<
      UnsetMultiCoinAddressEvent.InputTuple,
      UnsetMultiCoinAddressEvent.OutputTuple,
      UnsetMultiCoinAddressEvent.OutputObject
    >;
  };
}