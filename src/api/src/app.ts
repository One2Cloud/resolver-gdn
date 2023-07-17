import express, { Application, Request, Response } from "express";
import routers from "./routers";
import morgan = require("morgan");
import cors = require("cors");
import compression from "compression";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/healthcheck", (req: Request, res: Response): Response => {
  return res.status(200).send();
});

app.use(routers);

export default app;
