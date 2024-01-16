import { Key } from "../app/listener/handler";
import { Net } from "../network-config";

async function main() {
  console.log(Key.HOST_USER_$HASH(Net.MAINNET, "nexusguard.nedomian.meta"));
  console.log(Key.HOST_USER_$HASH(Net.MAINNET, "nexusguard.nedomian.meta") === "edns:mainnet:host:nexusguard.nedomian.meta:user");
}
main();
