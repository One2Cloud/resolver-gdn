require("source-map-support/register");
import * as dotenv from "dotenv";
import path from "path";
import serverless from "@vendia/serverless-express";
import app from "./src/app";
console.log("path: ", path.join(__dirname, ".env.runtime"));
console.log("process_cwd: ", process.cwd());

dotenv.config({ path: path.join(__dirname, ".env.runtime") });
dotenv.config({ path: path.join(process.cwd(), ".env.runtime") });
export const handler = serverless({ app });
