import "source-map-support/register";
import main from "./main";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
