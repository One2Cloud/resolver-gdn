import express, { Application, NextFunction, Request, Response } from "express";
import routers from "../../routers";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "../../middleware/returnHandler";
import { UnknownOperationError } from "../../errors/operation-not-found.error";

const app: Application = express();

app.disable("x-powered-by");

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/healthcheck", (req: Request, res: Response): Response => {
  return res.status(200).send();
});

app.use(routers);
app.get(
  "/*",
  (req: Request, res: Response, next: NextFunction) => {
    next(new UnknownOperationError());
  },
  errorHandler,
)
app.use(errorHandler);

export default app;
