import "source-map-support/register";

import _ from "lodash";
import { Lambda } from "@aws-sdk/client-lambda";
import { Network, getNetworkConfig } from "../network-config";
import { JsonRpcProvider } from "@ethersproject/providers";
import { EdnsEventType } from "../constants/event-type.constant";
import fs from "fs";
import path from "path";
import { setEnvironmentVariable } from "../utils/set-environment-variable";

if (!process.env.NETWORK) throw new Error("NETWORK environment variable is not set");

const NETWORK = parseInt(process.env.NETWORK) as Network;

const CONTRACTS_METADATA: { [key: number]: { [key: string]: { hash: string; block: number } } } = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "static/contracts_metadata.json"), "utf8"),
);

const METADATA = CONTRACTS_METADATA[NETWORK];
if (!METADATA) throw new Error(`Contracts metadata for network ${NETWORK} not found`);

const BATCH = 200;

async function main() {
  await setEnvironmentVariable();

  const NetworkConfig = await getNetworkConfig();

  const client = new Lambda({ region: "us-east-1" });

  const networkConfig = NetworkConfig[NETWORK];

  const provider = new JsonRpcProvider(networkConfig.url);

  const TO = await provider.getBlockNumber();

  for (let _from = METADATA["Registrar"].block; _from <= TO; _from += BATCH) {
    try {
      const eventTypes = _.values(EdnsEventType);
      for (const eventType of eventTypes) {
        let _to = _from + BATCH;

        const latest = await provider.getBlockNumber();
        console.log(`[${latest}] Invoking ${eventType} for ${_from} - ${_to}.`);

        if (_to > TO) {
          await client.invokeAsync({
            FunctionName: "EDNS-Sync-Event",
            InvokeArgs: JSON.stringify({
              chainId: networkConfig.chainId,
              from: _from,
              to: await provider.getBlockNumber(),
              eventType,
            }),
          });
        } else {
          await client.invokeAsync({
            FunctionName: "EDNS-Sync-Event",
            InvokeArgs: JSON.stringify({
              chainId: networkConfig.chainId,
              from: _from,
              to: _to,
              eventType,
            }),
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
