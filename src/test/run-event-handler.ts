import { main as EventHandler, IBody } from "../app/listener/handler";
import { EdnsEventType } from "../constants/event-type.constant";
import { setEnvironmentVariable } from "../utils/set-environment-variable";
import { Net } from "../network-config";
import { DomainProvider } from "../constants/domain-provider.constant";

//@ts-ignore
const body: IBody = {
  data: {
    host: "nexusguard",
    name: "nedomian",
    tld: "meta",
  },
  eventType: EdnsEventType.REVALIDATE,
  fqdn: "nexusguard.nedomian.meta",
  net: Net.MAINNET,
  provider: DomainProvider.EDNS,
};

async function index() {
  await setEnvironmentVariable();

  await EventHandler(body);
}

index()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
