import { EdnsV2FromContractService } from "../src/services/edns-v2.service";

async function main(){

  const service = new EdnsV2FromContractService();

  // 1. Get Address
  const address_result = await service.getAddressRecord('hello-world-sezto._universal', {chainId: 43113});
  console.log(address_result);

}

main();