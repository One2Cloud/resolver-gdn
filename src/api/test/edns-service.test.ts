import { Net } from "../src/network-config";
import { EdnsService } from "../src/services/edns.service";

async function main(){

  const service = new EdnsService();

  // 1. Get Address with passing chainId
  const address_result = await service.getAddressRecord('hello-world-sezto._universal', {chainId: 43113, net: Net.TESTNET});
  console.log(address_result);

  // 1. Get Address without passing chainId
  const address_result2 = await service.getAddressRecord('hello-world-sezto._universal', {net: Net.TESTNET});
  console.log(address_result2);

}

main();