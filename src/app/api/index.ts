require("source-map-support/register");

import { setEnvironmentVariable } from "../../utils/set-environment-variable";
import app from "./app";

async function main() {
  await setEnvironmentVariable();
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
