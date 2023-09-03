import { Router } from "express";
import EdnsRouter from "./edns.router";

const router = Router();

router.use(EdnsRouter);

export default router;
