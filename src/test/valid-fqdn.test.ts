import { isValidFqdn } from "../utils/is-valid-fqdn";

const FQDN = "oqwdqwddwq._ether";

async function main() {
  const valid = isValidFqdn(FQDN);
  console.log({ FQDN, valid });
}

main();
