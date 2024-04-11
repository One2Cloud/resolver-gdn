require("source-map-support/register");

import app from "./app";
// import ServerlessExpress from "@codegenie/serverless-express";
// export const index = ServerlessExpress({ app });
import ServerlessHttp from "serverless-http";
export const index = ServerlessHttp(app);
