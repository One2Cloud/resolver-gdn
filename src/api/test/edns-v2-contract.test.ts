import { EdnsV2FromContractService } from "../src/services/edns-v2.service";

async function main(){

  const service = new EdnsV2FromContractService();

  // // 1. Get Address
  const address_result = await service.getAddressRecord('hello-world-sezto._universal', {chainId: 43113});
  console.log(address_result);

  // 2. Get Text
  const text_result = await service.getTextRecord('hello-world-sezto._universal', {chainId: 43113});
  console.log(text_result);

  // 3. Get Typed Text
  const typedtext_result = await service.getTypedTextRecord('hello-world-sezto._universal', 'testtype',{chainId: 43113});
  console.log(typedtext_result);

  // 4. Get MultiCoin
  const multicoin_result = await service.getMultiCoinAddressRecord('hello-world-sezto._universal', '60', {chainId: 43113});
  console.log(multicoin_result);

  // 5. Get Nft
  const nft_result = await service.getNftRecord('hello-world-sezto._universal', '1' ,{chainId: 43113});
  console.log(nft_result);

}

main();