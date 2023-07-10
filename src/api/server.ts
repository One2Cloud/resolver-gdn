import app from "./src";
import _ from "lodash";
import { join } from "path";
import express, { NextFunction, Request, Response } from 'express';
import router from "./src/routers";

app.use('/', router)

try {
  const port: number = _.toNumber(process.env.PORT) || 3000;
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
