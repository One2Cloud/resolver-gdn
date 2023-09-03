require("source-map-support/register");
import path from "path";
import serverless from "@vendia/serverless-express";
import app from "./app";
import fs from "fs";

const environment = fs.readFileSync(path.join(__dirname, ".env.runtime"), "utf8");

const lines = environment.split("\n").map((l) => l.split("="));
lines.forEach((line) => {
	const [key, value] = line;
	process.env[key] = value;
});

export const handler = serverless({ app });
