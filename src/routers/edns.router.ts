import { Request, Response, NextFunction } from "express";
import * as express from "express";
import EdnsController from "../controllers/edns.controller";
import { errorHandler } from "../middleware/returnHandler";
import { UnknownOperationError } from "../errors/operation-not-found.error";

const router = express.Router();
router.get("/record/:fqdn", EdnsController.getAllRecords, errorHandler);
router.get("/record/:fqdn/chain", EdnsController.getUrlRecord, errorHandler);

router.get("/record/:address/domain", EdnsController.getReverseAddressRecord, errorHandler);
router.get("/record/:fqdn/address/list", EdnsController.getMultiCoinAddressList, errorHandler);
router.get("/record/:fqdn/address/:coin", EdnsController.getMultiCoinAddressRecord, errorHandler);
router.get("/record/:fqdn/address", EdnsController.getAddressRecord, errorHandler);
router.get("/record/:fqdn/nft/:chainId", EdnsController.getNftRecord, errorHandler);
router.get("/record/:fqdn/text/list", EdnsController.getTypedTextList, errorHandler);
router.get("/record/:fqdn/text/:typed", EdnsController.getTypedTextRecord, errorHandler);
router.get("/record/:fqdn/text", EdnsController.getTextRecord, errorHandler);
router.get("/domain/:fqdn", EdnsController.getDomain, errorHandler);
router.get("/owner/:fqdn", EdnsController.getOwner, errorHandler);
router.get("/expiry/:fqdn", EdnsController.getExpiry, errorHandler);
router.get("/account/:account", EdnsController.getDomainsByAccount, errorHandler);
router.get("/host/:fqdn", EdnsController.getHost, errorHandler);

router.post("/revalidate/:fqdn", EdnsController.revalidate, errorHandler);

router.get(
  "/*",
  (req: Request, res: Response, next: NextFunction) => {
    next(new UnknownOperationError());
  },
  errorHandler,
);

export default router;
