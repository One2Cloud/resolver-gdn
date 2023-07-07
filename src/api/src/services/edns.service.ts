import * as ethers from "ethers";
import { formatsByName } from "@ensdomains/address-encoder";
import { RESOLVER_CONTRACT_ADDRESS, RPC_ENDPOINT, CHAINID } from "../useContract";
import {
  PublicResolver,
  PublicResolver__factory as ResolverFactory,
} from "../../typechain";
import {
  BaseRegistrarController,
  BaseRegistrarController__factory as RegistrarFactory,
} from "../../typechain";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  LookupAddress,
  LookUpText,
  LookupDomainFromAddress,
  TextType,
} from "@edns/sdk";
import { isEnumMember } from "typescript";
import { errorTransform } from './errorTransform';

const contractList: {[key: number]: {resolverAddress: string, rpcUrl: string}} = {
  43113: {
    resolverAddress: '0xa869',
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc'
  }
};

export interface IQueryOutput{
  result?: any;
  error?: Error;
}

export class EdnsService {

  private getDomainSubdomainTld(fqdn:string, _type?: string): { domain: Uint8Array, subdomain: Uint8Array, tld: Uint8Array } {
    
    let domain, subdomain, tld, type;
    
    //Check if it has a subdomain
    const subdomainCount = fqdn.split(".").length - 2;
    // e.g. test.hello-123._universal has 3 - 2 = 1 subdomain

    //Get subdomain
    if (subdomainCount === 1) {
      const _subdomain = fqdn.split(".")[0];
      if (_subdomain !== "") {
        subdomain = ethers.utils.toUtf8Bytes(_subdomain);
      } else {
        subdomain = ethers.utils.toUtf8Bytes("@");
      }
    } else if (subdomainCount === 0) {
      subdomain = ethers.utils.toUtf8Bytes("@");
    } else {
      throw new Error('INVALID_DOMAIN');
    }

    //Get domain and tld
    domain = ethers.utils.toUtf8Bytes(fqdn.split(".")[subdomainCount]);
    // e.g. test.hello-123._universal has 1 subdomain, [1] got hello-123
    tld = ethers.utils.toUtf8Bytes(fqdn.split(".")[subdomainCount + 1]);
    // e.g. test.hello-123._universal has 1 subdomain, [2] got _universal

    // console.log( { subdomain,domain,tld } );

    return { subdomain, domain, tld}
  }

  // Get Domain Record
  //fqdn - web3 domain name
  public async queryEdnsAddress(fqdn: string): Promise<IQueryOutput>{
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );

    const {subdomain, domain, tld} = this.getDomainSubdomainTld(fqdn);

    let getAddressError;

    // Get EDNS-V2 contract getAddress function
    
    let result;
    try {
      result = await Resolver.callStatic.getAddress(subdomain, domain, tld)
    } catch (error) {
      getAddressError = error
    }

    // Address undefined / not found:
    if (result === "0x0000000000000000000000000000000000000000" || result === undefined || getAddressError) {
      // Then try to find in v1
      try {
        const resultv1 = await LookupAddress(fqdn, "ETH");
        // Address undefined / not found but found in v1:
        if (resultv1 !== undefined && ethers.utils.isAddress(resultv1)) {
          return {
            result: { 'address': result },
          };
        } else {
          // Address also not found in v1:
          // Defining error:
          if (getAddressError){
            // Resolver.callStatic.getAddress gave an error: returned that error
            // e.g. DOMAIN_EXPIRED
            // console.log("got error: ", getAddressError)
            return {
              error: errorTransform(getAddressError)
            }
          } else if (result === "0x0000000000000000000000000000000000000000" || resultv1 === "0x0000000000000000000000000000000000000000") {
            // Resolver.callStatic.getAddress returned 0x0000000000000000000000000000000000000000: new Error as undefined
            return {
              result: { 'address': result },
              error: new Error('RECORD_UNDEFINED')
            }
          } else {
            return {
              result: { 'address': result},
              error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
            }
          }
        }
      // v1 LookupAddress function gave an error: returned that error
      } catch (error) {
        return {
          error: errorTransform(error)
        }
      }
    } else {
      // Nothing wrong and it's valid address
      if (ethers.utils.isAddress(result)) {
        return {
          result: { 'address': result }
        }
      // Nothing wrong but it's invalid address
      } else {
        return {
          error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
        }
      }
    }

  //   const result = await Resolver.callStatic
  //     .getAddress(subdomain, domain, tld)
  //     .then((address) => {
  //       console.log({ address });
  //       // Check if it is a valid address
  //       if (address !== "0x0000000000000000000000000000000000000000") {
  //         if (ethers.utils.isAddress(address)) {
  //           return {
  //             result: address
  //           }
  //         } else {
  //           console.log({ address });
  //           // const error = new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //           // error.result = address
  //           // throw error
  //           return {
  //             result: address, // address that is not 0x00.. and not a valid address
  //             error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //           }
  //         }
  //       } else {
  //         console.log("went into RECORD_UNDEFINED")
  //         // return undefined;
  //         return {
  //           result: address,
  //           error: new Error('RECORD_UNDEFINED')
  //         }
  //       }
  //     })
  //     .catch((error) => {
  //       // console.log({ Diu: error });
  //       // throw new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //       return {
  //         error: errorTransform(error)
  //       }
  //       // return { error };
  //       // throw new Error(`${error.reason}`);
  //     });

  //   if (result) {
  //     //Check if EDNS-V2 Contract return Address or error
  //     if (Object.keys(result).includes("error")) {
  //       try {
  //         //Query EDNS-V1 lookupAddress function
  //         const resultv1 = await LookupAddress(fqdn, "ETH");
  //         if (resultv1 !== undefined) {
  //           console.log("return resultv1");
  //           return {
  //             result: resultv1
  //           };
  //         } else {
  //           console.log("return error");
  //           // return { error: "can not find address" };
  //           return {
  //             error: new Error('RECORD_NOT_FOUND')
  //           }
  //         }
  //       } catch (error) {
  //         // console.error({ lookupAddress_Error: error });
  //         // throw new Error(`${error}`);

  //         return {
  //           error: errorTransform(error)
  //         }
          
  //         // if (error instanceof Error) {
  //         //   const newError = new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //         //   newError.stack = error.stack;
  //         //   throw newError
  //         // } else {
  //         //   throw error
  //         // }
  //       }
  //     } else {
  //       console.log("return result");
  //       return {
  //         result: result
  //       }
  //     }
  //   } else {
  //     // throw new Error("No result");
  //     return {
  //       error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //     }
  //     // throw new Error('ON_CHAIN_UNEXPECTED_ERROR')
  //   }
  // }

    // } else {
    //   console.log("No Subdomain");

    //   const _domain = ethers.utils.toUtf8Bytes(fqdn.split(".")[0]);
    //   const tld = ethers.utils.toUtf8Bytes(fqdn.split(".")[1]);

    //   _subdomain = ethers.utils.toUtf8Bytes("@");
    //   console.log({
    //     _domain,
    //     tld,
    //     _subdomain,
    //   });

  //     const result = await Resolver.callStatic
  //       .getAddress(_subdomain, _domain, tld)
  //       .then((address) => {
  //         console.log({ address });

  //         if (address !== "0x0000000000000000000000000000000000000000") {
  //           if (ethers.utils.isAddress(address)) {
  //             return { address };
  //           } else {
  //             console.log({ address });
  //           }
  //         } else {
  //           return undefined;
  //         }
  //       })
  //       .catch((error) => {
  //         console.log({ Diu: error });
  //         return { error };
  //         // throw new Error(`${error.reason}`);
  //       });
  //     console.log({ result });

  //     if (result) {
  //       if (Object.keys(result).includes("error")) {
  //         try {
  //           console.log("hi");

  //           // console.log("edns.LookupAddress", edns.LookupAddress);
  //           const resultv1 = await LookupAddress(fqdn, "ETH");
  //           console.log({ resultv1 });
  //           if (resultv1 !== undefined) {
  //             console.log("return resultv1");
  //             return { address: resultv1 };
  //           } else {
  //             console.log("return error");
  //             return { error: "can not find address" };
  //           }
  //         } catch (error) {
  //           console.error({ lookupAddress_Error: error });

  //           throw new Error(`${error}`);
  //         }
  //       } else {
  //         console.log("return result");
  //         return result;
  //       }
  //     } else {
  //       throw new Error("No result");
  //     }
  //   }
  }

  //Get NFT
  public async queryEdnsNft(fqdn: string): Promise<IQueryOutput> {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );
    // let _subdomain;
    // let _domain;
    // let tld;

    // if (domain.split(".").length === 3) {
    //   console.log("wrong subdomain");

    //   _subdomain = ethers.utils.toUtf8Bytes(domain.split(".")[0]);
    //   _domain = ethers.utils.toUtf8Bytes(domain.split(".")[1]);
    //   tld = ethers.utils.toUtf8Bytes(domain.split(".")[2]);
    // } else {
    //   console.log("No subdomain");

    //   _subdomain = ethers.utils.toUtf8Bytes("@");
    //   _domain = ethers.utils.toUtf8Bytes(domain.split(".")[0]);
    //   tld = ethers.utils.toUtf8Bytes(domain.split(".")[1]);
    // }

    // console.log(_domain);
    // console.log(tld);
    // console.log(_subdomain);

    const {subdomain, domain, tld} = this.getDomainSubdomainTld(fqdn);

    // method 1
    // let result;
    // try {
    //   result = await Resolver.callStatic.getNFT(subdomain, domain, tld, CHAINID)
    //     .then((nft) => {
    //       if (nft[0] === "0x0000000000000000000000000000000000000000") {
    //         throw new Error('RECORD_NOT_FOUND');
    //       } else {
    //         return nft;
    //       }})
    // } catch (error) {
    //   throw new Error('ON_CHAIN_UNEXPECTED_ERROR')
    // }

    let result;
    try {
      result = await Resolver.callStatic.getNFT(subdomain, domain, tld, CHAINID)
    } catch (error) {
      return {
        error: errorTransform(error)
      }
    }

    if (result[0] === "0x0000000000000000000000000000000000000000") {
      return {
        result: { 'nft': result },
        error: new Error('RECORD_UNDEFINED')
      }
    } else {
      if (ethers.utils.isAddress(result[0])) {
        return {
          result: { 'nft': result }
        }
      } else {
        return {
          error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
        }
      }
    }

    // method 2
    // const result = await Resolver.callStatic
    //   .getNFT(subdomain, domain, tld, CHAINID)
    //   .then((nft) => {
    //     if (nft[0] === "0x0000000000000000000000000000000000000000") {
    //       throw new Error('RECORD_NOT_FOUND');
    //     } else {
    //       return nft;
    //     }
    //   })
    //   .catch((error) => {
    //     errorTransform(error)
    //   });

    // console.log({ result });
    // return { result };

  }
  //Get Text Record
  public async queryEdnsText(fqdn: string): Promise<IQueryOutput> {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );

    const {subdomain, domain, tld} = this.getDomainSubdomainTld(fqdn);

    let result;
    try {
      result = await Resolver.callStatic.getText(subdomain, domain, tld)
    } catch (error) {
      return {
        result: { 'text': result },
        error: errorTransform(error)
      }
    }

    if (result === "") {
      return {
        result: { 'address': result },
        error: new Error('RECORD_UNDEFINED')
      }
    } else if (result === undefined) {
      return {
        error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
      }        
    } else {
        return {
          result: { 'text': result }
        }
    }
  }

  //Get Domain
  public async queryEdnsDomain(address: string): Promise<IQueryOutput> {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );

    if(!ethers.utils.isAddress(address)) {
      return {
        error: new Error('INVALID_ADDRESS_FORMAT')
      }
    }

    let result;

    let getDomainError;
    try {
      result = await Resolver.getReverseAddress(address)
    } catch (error) {
        getDomainError = error
    }

    // Refer to queryEdnsAddress for comments on the following operations

    if (result === "" || result === undefined || getDomainError) {
      try {
        const resultv1 = await LookupDomainFromAddress(address);
        if (resultv1 !== undefined && resultv1 !== "" && resultv1 !== null) {
          return {
            result: { 'domain': resultv1 }
          };
        } else {
          if (getDomainError) {
            return {
              error: errorTransform(getDomainError)
            }
          } else if (result === "" || result === null) {
            return {
              result: result,
              error: new Error('RECORD_UNDEFINED')
            }
          } else {
            return {
              error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
            }
          }
        }
      } catch (error) {
        return {
          error: errorTransform(error)
        }
      }
    } else {
      return {
        result: { 'domain': result }
      }
    }
    // return {
    //   result: result
    // }
    // if (result) {
    //   if (Object.keys(result).includes("error") || result.domain == "") {
    //     try {
    //       const resultv1 = await LookupDomainFromAddress(address);
    //       console.log({ resultv1 });
    //       if (resultv1 !== undefined) {
    //         console.log("return resultv1");
    //         return { domain: resultv1 };
    //       } else {
    //         console.log("return error");
    //         return { error: "can not find domain" };
    //       }
    //     } catch (error) {
    //       console.error({ lookupdomain_Error: error });

    //       throw new Error(`${error}`);
    //     }
    //   } else {
    //     console.log("return result");
    //     return result;
    //   }
    // } else {
    //   throw new Error("No result");
    // }
  }
  /*
  public async queryEdnsMultiCoinAddress(fqdn: string, coin: number) {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );
    let subdomain;
    let _subdomain;
    if (fqdn.split(".").length === 3) {
      console.log("Have subdomain");

      subdomain = fqdn.split(".")[0];
      const _domain = ethers.utils.toUtf8Bytes(fqdn.split(".")[1]);
      const tld = ethers.utils.toUtf8Bytes(fqdn.split(".")[2]);

      if (subdomain !== "") {
        _subdomain = ethers.utils.toUtf8Bytes(subdomain);
      } else {
        _subdomain = ethers.utils.toUtf8Bytes("@");
      }

      const result = await Resolver.callStatic
        .getMultiCoinAddress(_subdomain, _domain, tld, coin)
        .then((address) => {
          console.log({ address });

          if (address !== "0x") {
            if (ethers.utils.isAddress(address)) {
              return { address };
            } else {
              console.log({ address });
            }
          } else {
            return undefined;
          }
        })
        .catch((error) => {
          console.log({ Diu: error });
          return { error };
          // throw new Error(`${error.reason}`);
        });
      console.log({ result });

      return result;
    } else {
      console.log("No Subdomain");

      const _domain = ethers.utils.toUtf8Bytes(fqdn.split(".")[0]);
      const tld = ethers.utils.toUtf8Bytes(fqdn.split(".")[1]);

      _subdomain = ethers.utils.toUtf8Bytes("@");
      console.log({
        _domain,
        tld,
        _subdomain,
      });

      const result = await Resolver.callStatic
        .getMultiCoinAddress(_subdomain, _domain, tld, coin)
        .then((address) => {
          console.log({ address });

          if (address !== "0x") {
            if (ethers.utils.isAddress(address)) {
              return { address };
            } else {
              console.log({ address });
            }
          } else {
            return undefined;
          }
        })
        .catch((error) => {
          console.log({ Diu: error });
          return { error };
          // throw new Error(`${error.reason}`);
        });
      console.log({ result });

      return result;
    }
  }
  */
  //Get Text Record with type
  public async queryEdnsTypeText(fqdn: string, type: string): Promise<IQueryOutput> {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );

    const {subdomain, domain, tld } = this.getDomainSubdomainTld(fqdn);
    const _type = ethers.utils.toUtf8Bytes(type)

    let result;
    try {
      result = await Resolver.callStatic.getTypedText(subdomain, domain, tld, _type)
    } catch (error) {
      return {
        error: errorTransform(error)
      }
    }

    if (result === "") {
      return {
        result: { [type]: result },
        error: new Error('RECORD_UNDEFINED')
      }
    } else if (result === undefined) {
      return {
        error: new Error('ON_CHAIN_UNEXPECTED_ERROR')
      }
    } else {
      return {
        result: { [type]: result }
      }
    }

      // const result = await Resolver.callStatic
      //   .getTypedText(_subdomain, _domain, tld, _type)
      //   .then((typetext) => {
      //     console.log({ typetext });

      //     if (typetext !== "") {
      //       return { [type]: typetext };
      //     } else {
      //       return undefined;
      //     }
      //   })
      //   .catch((error) => {
      //     console.log({ Diu: error });
      //     return { error };
      //     // throw new Error(`${error.reason}`);
      //   });

    //   if (Object.keys(TextType).includes(type)) {
    //     const resultv1 = await LookUpText(fqdn, type as TextType);
    //     const resultfin = Promise.all([result, resultv1]);
    //     return resultfin;
    //   }

    //   console.log(result );

    //   return result;
    // } else {
    //   console.log("No Subdomain");

    //   const _domain = ethers.utils.toUtf8Bytes(fqdn.split(".")[0]);
    //   const tld = ethers.utils.toUtf8Bytes(fqdn.split(".")[1]);
    //   const _type = ethers.utils.toUtf8Bytes(type);
    //   _subdomain = ethers.utils.toUtf8Bytes("@");
    //   console.log({
    //     _domain,
    //     tld,
    //     _subdomain,
    //   });

    //   const result = await Resolver.callStatic
    //     .getTypedText(_subdomain, _domain, tld, _type)
    //     .then((typetext) => {
    //       console.log({ typetext });

    //       if (typetext !== "") {
    //         return { [type]: typetext };
    //       } else {
    //         throw new Error("Not Record")
    //       }
    //     })
    //   console.log({ result });

    //   return result;
    // }
  }

  // public async queryEdnsMetadata(tokenId: string) {
  //   const provider = new JsonRpcProvider(RPC_ENDPOINT);
  //   const Regisrar = RegistrarFactory.connect(RESOLVER_CONTRACT_ADDRESS,provider);

  // }
}
