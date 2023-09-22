import { Signer, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Rental, RentalInterface } from "../Rental";
export declare class Rental__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<Rental>;
    getDeployTransaction(overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): Rental;
    connect(signer: Signer): Rental__factory;
    static readonly bytecode = "0x60a06040523060805262278d0061012e5534801561001c57600080fd5b50608051611f3761005460003960008181610454015281816104940152818161067c015281816106bc015261074b0152611f376000f3fe6080604052600436106101145760003560e01c806352d1902d116100a0578063852f07ed11610064578063852f07ed146102d157806391d14854146102f1578063a217fddf14610311578063c4d66de814610326578063d547741f1461034657600080fd5b806352d1902d1461024d5780635c975abb14610262578063729540761461027a57806375b238fc1461029a5780638456cb59146102bc57600080fd5b806336568abe116100e757806336568abe146101c55780633659cfe6146101e55780633f4ba83a1461020557806349c83e861461021a5780634f1ef2861461023a57600080fd5b806301ffc9a714610119578063248a9ca31461014e5780632cc15b971461018c5780632f2ff15d146101a3575b600080fd5b34801561012557600080fd5b506101396101343660046119c8565b610366565b60405190151581526020015b60405180910390f35b34801561015a57600080fd5b5061017e6101693660046119f2565b60009081526065602052604090206001015490565b604051908152602001610145565b34801561019857600080fd5b5061017e61012e5481565b3480156101af57600080fd5b506101c36101be366004611a20565b61039d565b005b3480156101d157600080fd5b506101c36101e0366004611a20565b6103c7565b3480156101f157600080fd5b506101c3610200366004611a50565b61044a565b34801561021157600080fd5b506101c3610529565b34801561022657600080fd5b506101c3610235366004611a6d565b610549565b6101c3610248366004611aaf565b610672565b34801561025957600080fd5b5061017e61073e565b34801561026e57600080fd5b5060fb5460ff16610139565b34801561028657600080fd5b506101c3610295366004611b73565b6107f1565b3480156102a657600080fd5b5061017e600080516020611ee283398151915281565b3480156102c857600080fd5b506101c3610b25565b3480156102dd57600080fd5b506101c36102ec366004611bc8565b610b45565b3480156102fd57600080fd5b5061013961030c366004611a20565b611012565b34801561031d57600080fd5b5061017e600081565b34801561033257600080fd5b506101c3610341366004611a50565b61103d565b34801561035257600080fd5b506101c3610361366004611a20565b611148565b60006001600160e01b03198216637965db0b60e01b148061039757506301ffc9a760e01b6001600160e01b03198316145b92915050565b6000828152606560205260409020600101546103b88161116d565b6103c28383611177565b505050565b6001600160a01b038116331461043c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61044682826111fd565b5050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036104925760405162461bcd60e51b815260040161043390611c0a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166104db600080516020611e9b833981519152546001600160a01b031690565b6001600160a01b0316146105015760405162461bcd60e51b815260040161043390611c56565b61050a81611264565b604080516000808252602082019092526105269183919061127c565b50565b600080516020611ee28339815191526105418161116d565b6105266113e7565b610551611439565b33604051636178f8a560e11b8152600481018390526001600160a01b039182169184169063c2f1f14a90602401602060405180830381865afa15801561059b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105bf9190611ca2565b6001600160a01b031614806105eb5750600081815261012f60205260409020546001600160a01b031633145b6106115760405162461bcd60e51b81526020600482015260006024820152604401610433565b600081815261012f602052604080822080546001600160e01b031916815560010191909155517f6318005f6dc5a71d3e4ad5b4d1fe455ef3402d62b64573777af55bb6bfe3daab906106669083815260200190565b60405180910390a15050565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001630036106ba5760405162461bcd60e51b815260040161043390611c0a565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610703600080516020611e9b833981519152546001600160a01b031690565b6001600160a01b0316146107295760405162461bcd60e51b815260040161043390611c56565b61073282611264565b6104468282600161127c565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107de5760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610433565b50600080516020611e9b83398151915290565b6107f9611439565b6040516301ffc9a760e01b81526307e64e1160e41b60048201526001600160a01b038516906301ffc9a790602401602060405180830381865afa158015610844573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108689190611cbf565b61088e5760405162461bcd60e51b81526020600482015260006024820152604401610433565b4261012e548367ffffffffffffffff166108a89190611cf7565b10156108d05760405162461bcd60e51b81526020600482015260006024820152604401610433565b60405163534ea1ff60e01b8152600481018490526001600160a01b0385169063534ea1ff90602401602060405180830381865afa158015610915573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109399190611d0a565b61012e546109479042611cf7565b101561096f5760405162461bcd60e51b81526020600482015260006024820152604401610433565b600081116109995760405162461bcd60e51b81526020600482015260006024820152604401610433565b33604051636178f8a560e11b8152600481018590526001600160a01b039182169186169063c2f1f14a90602401602060405180830381865afa1580156109e3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a079190611ca2565b6001600160a01b031614610a375760405162461bcd60e51b81526020600482015260006024820152604401610433565b600083815261012f60205260409020546001600160a01b031615610a7757600083815261012f6020526040812080546001600160e01b0319168155600101555b6040518060600160405280610a893390565b6001600160a01b03908116825267ffffffffffffffff80861660208085018290526040948501879052600089815261012f82528581208751815493890151909516600160a01b026001600160e01b0319909316949095169390931717835593830151600190920191909155905183929186917fdcb4305943886b1b0224052deb68258d920adc34e3a36b3cfde7c1f5a931930f9190a450505050565b600080516020611ee2833981519152610b3d8161116d565b610526611481565b610b4d611439565b6040516301ffc9a760e01b81526307e64e1160e41b60048201526001600160a01b038416906301ffc9a790602401602060405180830381865afa158015610b98573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bbc9190611cbf565b610be25760405162461bcd60e51b81526020600482015260006024820152604401610433565b600082815261012f602052604090819020549051636178f8a560e11b8152600481018490526001600160a01b039182169185169063c2f1f14a90602401602060405180830381865afa158015610c3c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c609190611ca2565b6001600160a01b0316148015610cea575061012e54610c7f9042611cf7565b60405163534ea1ff60e01b8152600481018490526001600160a01b0385169063534ea1ff90602401602060405180830381865afa158015610cc4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ce89190611d0a565b115b610d105760405162461bcd60e51b81526020600482015260006024820152604401610433565b600082815261012f602052604090206001015461012d546001600160a01b03166370a08231336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610d7a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d9e9190611d0a565b10158015610e3e5750600082815261012f602052604090206001015461012d546001600160a01b031663dd62ed3e336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152306024820152604401602060405180830381865afa158015610e17573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e3b9190611d0a565b10155b610e7e5760405162461bcd60e51b8152602060048201526011602482015270125394d551919250d251539517d1955391607a1b6044820152606401610433565b61012d546001600160a01b03166323b872dd33600085815261012f6020526040908190208054600190910154915160e085901b6001600160e01b03191681526001600160a01b0393841660048201529216602483015260448201526064016020604051808303816000875af1158015610efb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f1f9190611cbf565b50600082815261012f6020526040908190205490516370182b2f60e11b8152600481018490526001600160a01b038381166024830152600160a01b90920467ffffffffffffffff1660448201529084169063e030565e90606401600060405180830381600087803b158015610f9357600080fd5b505af1158015610fa7573d6000803e3d6000fd5b5050604080518581526001600160a01b03851660208201527f1a9eef09e3eb98112d990967f199b1b15d95acac49ad80f1d9a10c67e8dc361a935001905060405180910390a150600090815261012f6020526040812080546001600160e01b03191681556001015550565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600054610100900460ff161580801561105d5750600054600160ff909116105b806110775750303b158015611077575060005460ff166001145b6110da5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610433565b6000805460ff1916600117905580156110fd576000805461ff0019166101001790555b611106826114be565b8015610446576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb384740249890602001610666565b6000828152606560205260409020600101546111638161116d565b6103c283836111fd565b61052681336114ee565b6111818282611012565b6104465760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556111b93390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6112078282611012565b156104465760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600080516020611ee28339815191526104468161116d565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff16156112af576103c283611547565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015611309575060408051601f3d908101601f1916820190925261130691810190611d0a565b60015b61136c5760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610433565b600080516020611e9b83398151915281146113db5760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610433565b506103c28383836115e3565b6113ef61160e565b60fb805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60fb5460ff161561147f5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610433565b565b611489611439565b60fb805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861141c3390565b600054610100900460ff166114e55760405162461bcd60e51b815260040161043390611d23565b61052681611657565b6114f88282611012565b61044657611505816116a1565b6115108360206116b3565b604051602001611521929190611d92565b60408051601f198184030181529082905262461bcd60e51b825261043391600401611e07565b6001600160a01b0381163b6115b45760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610433565b600080516020611e9b83398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6115ec83611856565b6000825111806115f95750805b156103c2576116088383611896565b50505050565b60fb5460ff1661147f5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610433565b600054610100900460ff1661167e5760405162461bcd60e51b815260040161043390611d23565b61012d80546001600160a01b0319166001600160a01b0392909216919091179055565b60606103976001600160a01b03831660145b606060006116c2836002611e3a565b6116cd906002611cf7565b67ffffffffffffffff8111156116e5576116e5611a99565b6040519080825280601f01601f19166020018201604052801561170f576020820181803683370190505b509050600360fc1b8160008151811061172a5761172a611e51565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061175957611759611e51565b60200101906001600160f81b031916908160001a905350600061177d846002611e3a565b611788906001611cf7565b90505b6001811115611800576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106117bc576117bc611e51565b1a60f81b8282815181106117d2576117d2611e51565b60200101906001600160f81b031916908160001a90535060049490941c936117f981611e67565b905061178b565b50831561184f5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610433565b9392505050565b61185f81611547565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b60606001600160a01b0383163b6118fe5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610433565b600080846001600160a01b0316846040516119199190611e7e565b600060405180830381855af49150503d8060008114611954576040519150601f19603f3d011682016040523d82523d6000602084013e611959565b606091505b50915091506119818282604051806060016040528060278152602001611ebb6027913961198a565b95945050505050565b6060831561199957508161184f565b61184f83838151156119ae5781518083602001fd5b8060405162461bcd60e51b81526004016104339190611e07565b6000602082840312156119da57600080fd5b81356001600160e01b03198116811461184f57600080fd5b600060208284031215611a0457600080fd5b5035919050565b6001600160a01b038116811461052657600080fd5b60008060408385031215611a3357600080fd5b823591506020830135611a4581611a0b565b809150509250929050565b600060208284031215611a6257600080fd5b813561184f81611a0b565b60008060408385031215611a8057600080fd5b8235611a8b81611a0b565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b60008060408385031215611ac257600080fd5b8235611acd81611a0b565b9150602083013567ffffffffffffffff80821115611aea57600080fd5b818501915085601f830112611afe57600080fd5b813581811115611b1057611b10611a99565b604051601f8201601f19908116603f01168101908382118183101715611b3857611b38611a99565b81604052828152886020848701011115611b5157600080fd5b8260208601602083013760006020848301015280955050505050509250929050565b60008060008060808587031215611b8957600080fd5b8435611b9481611a0b565b935060208501359250604085013567ffffffffffffffff81168114611bb857600080fd5b9396929550929360600135925050565b600080600060608486031215611bdd57600080fd5b8335611be881611a0b565b9250602084013591506040840135611bff81611a0b565b809150509250925092565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b600060208284031215611cb457600080fd5b815161184f81611a0b565b600060208284031215611cd157600080fd5b8151801515811461184f57600080fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561039757610397611ce1565b600060208284031215611d1c57600080fd5b5051919050565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60005b83811015611d89578181015183820152602001611d71565b50506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351611dca816017850160208801611d6e565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351611dfb816028840160208801611d6e565b01602801949350505050565b6020815260008251806020840152611e26816040850160208701611d6e565b601f01601f19169190910160400192915050565b808202811582820484141761039757610397611ce1565b634e487b7160e01b600052603260045260246000fd5b600081611e7657611e76611ce1565b506000190190565b60008251611e90818460208701611d6e565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775a2646970667358221220d4ac0a44590879ebaaddb2be3be351df69552c1c302f893cd05e4e0ec17b9c2b64736f6c63430008110033";
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
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): RentalInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Rental;
}