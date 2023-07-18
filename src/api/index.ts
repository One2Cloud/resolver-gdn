require("source-map-support/register");
import * as dotenv from "dotenv";
import serverless from "@vendia/serverless-express";
import app from "./src/app";
dotenv.config({ path: ".env.runtime" });
export const handler = serverless({ app });
