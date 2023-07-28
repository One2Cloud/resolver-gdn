require("source-map-support/register");
import * as dotenv from "dotenv";
import path from "path";
import serverless from "@vendia/serverless-express";
import app from "./src/app";
import fs from "fs";

const environment = fs.readFileSync(path.join(__dirname, ".env.runtime"), "utf8");

const lines = environment.split("\n").map((l) => l.split("="));

for (const label of lines) {
  const [key, value] = label;
  process.env[key] = value;
}

console.log(process.env);

// console.log("path: ", path.join(__dirname, ".env.runtime"));
// console.log("process_cwd: ", process.cwd());
// dotenv.config({ path: path.resolve(__dirname, ".env.runtime") });
// dotenv.config({ path: path.resolve(process.cwd(), ".env.runtime") });
export const handler = serverless({ app });
