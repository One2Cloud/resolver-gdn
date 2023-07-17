import Redis from "ioredis";
import { REDIS_ENDPOINT } from "../useContract";

const client = new Redis(REDIS_ENDPOINT);

async function index() {
  // await client.hset("edns:host:hello-world-1686291824._universal:records", "address", "0x0607B743A0D0c223D04F9E046043799ab895B268");
  // await client.hset("edns:host:hello-world-1686291824._universal:records", "nft", '["0x0c9663115b36Fa95D18E71D59054117BCb0342Ef",{"type": "BigNumber","hex": "0xbc614e"}]');
  // await client.hset("edns:host:hello-world-1686291824._universal:records", "text", "test_setText");
  // await client.hset("edns:host:hello-world-1686291824._universal:records", "typed_text:testtype", "text of testtype");
  // await client.sadd('edns:account:0x0607B743A0D0c223D04F9E046043799ab895B268:domains', 'another_test._universal');
  // await client.sadd("edns:account:0xCD58F85e6Ec23733143599Fe0f982fC1d3f6C12c:domains", "hello-world-1686291824._universal");
  await client.hset("edns:testnet:domain:hello-world-sezto._universal:info", "chain", "43113");
}

index()
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
