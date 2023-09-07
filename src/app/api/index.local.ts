import * as dotenv from "dotenv";
import app from "./app";

dotenv.config();

async function main() {
	app.listen(8080, (): void => {
		console.log(`Core API service start listening on 8080`);
	});
}

try {
	main();
} catch (error) {
	console.error(error);
	process.exit(1);
}
