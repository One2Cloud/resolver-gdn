import { EdnsV1FromContractService } from "../src/services/edns-v1.service";

async function main(){

  const service = new EdnsV1FromContractService();

  // 1. Get Address
  const address_result = await service.getAddressRecord('hello-world-sezto._universal', "ETH");
  console.log(address_result);

}

main();