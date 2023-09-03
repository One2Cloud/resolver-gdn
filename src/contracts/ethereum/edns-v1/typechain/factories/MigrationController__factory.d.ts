import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MigrationController, MigrationControllerInterface } from "../MigrationController";
export declare class MigrationController__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<MigrationController>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): MigrationController;
    connect(signer: Signer): MigrationController__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5061076a806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063c4d66de81461003b578063e832e3cd14610050575b600080fd5b61004e6100493660046104a1565b610063565b005b61004e61005e366004610568565b61017b565b600054610100900460ff16158080156100835750600054600160ff909116105b8061009d5750303b15801561009d575060005460ff166001145b6101055760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff191660011790558015610128576000805461ff0019166101001790555b61013182610410565b8015610177576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b6000849050600080848285805190602001206040516020016101a7929190918252602082015260400190565b604051602081830303815290604052805190602001206040516020016101ce92919061060c565b6040516020818303038152906040528051906020012060001c905085811461022c5760405162461bcd60e51b81526020600482015260116024820152700a89e968a9cbe9288be9a92a69a82a8869607b1b60448201526064016100fc565b336040516331a9108f60e11b8152600481018890526001600160a01b0391821691851690636352211e90602401602060405180830381865afa158015610276573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061029a919061062e565b6001600160a01b0316146102dd5760405162461bcd60e51b815260206004820152600a60248201526927a7262cafa7aba722a960b11b60448201526064016100fc565b6033546001600160a01b0316630deff82033878733604051636fb4072960e01b8152600481018890526001600160a01b038a1690636fb4072990602401602060405180830381865afa158015610337573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061035b919061064b565b6040518663ffffffff1660e01b815260040161037b959493929190610690565b600060405180830381600087803b15801561039557600080fd5b505af11580156103a9573d6000803e3d6000fd5b50506040516306976fed60e21b8152600481018490526001600160a01b0386169250631a5dbfb49150602401600060405180830381600087803b1580156103ef57600080fd5b505af1158015610403573d6000803e3d6000fd5b5050505050505050505050565b600054610100900460ff166104375760405162461bcd60e51b81526004016100fc906106e9565b61044081610443565b50565b600054610100900460ff1661046a5760405162461bcd60e51b81526004016100fc906106e9565b603380546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b038116811461044057600080fd5b6000602082840312156104b357600080fd5b81356104be8161048c565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126104ec57600080fd5b813567ffffffffffffffff80821115610507576105076104c5565b604051601f8301601f19908116603f0116810190828211818310171561052f5761052f6104c5565b8160405283815286602085880101111561054857600080fd5b836020870160208301376000602085830101528094505050505092915050565b6000806000806080858703121561057e57600080fd5b84356105898161048c565b935060208501359250604085013567ffffffffffffffff808211156105ad57600080fd5b6105b9888389016104db565b935060608701359150808211156105cf57600080fd5b506105dc878288016104db565b91505092959194509250565b60005b838110156106035781810151838201526020016105eb565b50506000910152565b6000835161061e8184602088016105e8565b9190910191825250602001919050565b60006020828403121561064057600080fd5b81516104be8161048c565b60006020828403121561065d57600080fd5b5051919050565b6000815180845261067c8160208601602086016105e8565b601f01601f19169290920160200192915050565b600060018060a01b03808816835260a060208401526106b260a0840188610664565b83810360408501526106c48188610664565b959091166060840152505067ffffffffffffffff919091166080909101529392505050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fea2646970667358221220466831c25b3afac601264a52286a573a5d95f242f111e69cab1b42e3aa2feb3d64736f6c63430008110033";
    static readonly abi: ({
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        outputs?: undefined;
        stateMutability?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: never[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): MigrationControllerInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): MigrationController;
}
