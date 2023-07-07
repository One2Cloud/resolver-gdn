import app from "./src";
import _ from "lodash";
import { join } from "path";
import express, { NextFunction, Request, Response } from 'express';
import router from "./src/routers";



app.get('/endpoint', (req: Request, res: Response) => {
  // sendResponse(res, { address: '0x0000000000' }, 200, true, 'GetAddress');
});

app.use('/', router)

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   // sendError(res, err.message, err.status || 500);
// });

try {
  const port: number = _.toNumber(process.env.PORT) || 3000;
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}
