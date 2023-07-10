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
// import { EdnsV2FromContractService, EdnsV2FromRedisService } from './edns-v2.service';

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

export interface IOptions{
  on_chain?: boolean;
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
  public async queryEdnsAddress(fqdn: string, options?: IOptions){

    // const v2RedisService = new EdnsV2FromRedisService();
    // const v2ContractService = new EdnsV2FromContractService();

    // let address: string  | undefined;

    // if (options?.on_chain === undefined || options?.on_chain === true) {
    //   const result = await v2RedisService.getAddressRecord(fqdn);
    //   if (result) address = result.address;
    // } else {
    //   const result = await v2ContractService.getAddressRecord(fqdn);
    //   if (result) address = result.address;
    // }

    // if (address) return { address };


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
  }

  //Get NFT
  public async queryEdnsNft(fqdn: string): Promise<IQueryOutput> {
    const provider = new JsonRpcProvider(RPC_ENDPOINT);
    const Resolver = ResolverFactory.connect(
      RESOLVER_CONTRACT_ADDRESS,
      provider
    );

    const {subdomain, domain, tld} = this.getDomainSubdomainTld(fqdn);

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
  }

  // public async queryEdnsMetadata(tokenId: string) {
  //   const provider = new JsonRpcProvider(RPC_ENDPOINT);
  //   const Regisrar = RegistrarFactory.connect(RESOLVER_CONTRACT_ADDRESS,provider);

  // }
}
