require("source-map-support/register");
import * as dotenv from "dotenv";
import path from "path";
import serverless from "@vendia/serverless-express";
import app from "./src/app";
import fs from "fs";

const envirament = fs.readFile(path.join(__dirname, ".env.runtime"), (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log(envirament);

console.log("path: ", path.join(__dirname, ".env.runtime"));
console.log("process_cwd: ", process.cwd());

dotenv.config({ path: path.join(__dirname, ".env.runtime") });
dotenv.config({ path: path.join(process.cwd(), ".env.runtime") });
export const handler = serverless({ app });
