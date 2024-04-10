require("source-map-support/register");

import app from "./app";
import ServerlessExpress from "@codegenie/serverless-express";

export const index = ServerlessExpress({ app });
