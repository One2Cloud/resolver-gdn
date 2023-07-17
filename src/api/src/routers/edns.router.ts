import { Request, Response, NextFunction } from "express";
import * as express from "express";
import EdnsController from "../controllers/edns.controller";
import { errorHandler } from "../middleware/returnHandler";

const router = express.Router();

router.get("/record/:address/domain", EdnsController.getReverseAddressRecord, errorHandler);
router.get("/record/:fqdn/address/:coin", EdnsController.getMultiCoinAddressRecord, errorHandler);
router.get("/record/:fqdn/address", EdnsController.getAddressRecord, errorHandler);
router.get("/record/:fqdn/nft/:chainId", EdnsController.getNftRecord, errorHandler);
router.get("/record/:fqdn/text/:typed", EdnsController.getTypedTextRecord, errorHandler);
router.get("/record/:fqdn/text", EdnsController.getTextRecord, errorHandler);

router.get(
  "/*",
  (req: Request, res: Response, next: NextFunction) => {
    next(new Error("UNKNOWN_ROUTE"));
  },
  errorHandler,
);

export default router;
