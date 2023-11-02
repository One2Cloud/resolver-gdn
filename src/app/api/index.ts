require("source-map-support/register");

import app from "./app";

async function main() {
	app.listen(process.env.PORT || 8080, () => {
		console.log(`Server listening on port ${process.env.PORT || 8080}`);
	});
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
