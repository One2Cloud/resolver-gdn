require("source-map-support/register");

import app from "./app";

if (process.env.GLOBAL_SECRET_VALUE) {
  const vars: { [key: string]: string } = JSON.parse(process.env.GLOBAL_SECRET_VALUE);
  for (const _var in vars) {
    process.env[_var] = vars[_var];
  }
}

async function main() {
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server listening on port ${process.env.PORT || 8080}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
