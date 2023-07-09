import { Request, Response, NextFunction } from "express";
import * as express from "express";
import EdnsController from "../controllers/edns.controller";
// -------------------Separate Router---------------------------------------------
// import recordRouter from './edns-record.router'
// -------------------Separate Router---------------------------------------------
import { errorHandler, responseHandler } from "../middleware/returnHandler";

const router = express.Router();

// Get Domain's Address Record
router.get("/record/:fqdn/address", EdnsController.queryEdnsAddress, responseHandler, errorHandler);

// Get Address's NFT Record
router.get("/record/:fqdn/nft", EdnsController.queryEdnsNft, responseHandler, errorHandler);

// Get Address's Text Record
router.get("/record/:fqdn/text", EdnsController.queryEdnsText, responseHandler, errorHandler);

// Get Address's Domain Record
router.get("/record/:address/domain", EdnsController.queryEdnsDomain, responseHandler, errorHandler);

// Get Address's Text Record with Type
router.get("/record/:fqdn/text/:type", EdnsController.queryEdnsTypeText, responseHandler, errorHandler);

// -------------------Separate Router---------------------------------------------

// // Get Domain's Address Record
// router.get("/:fqdn/address", EdnsController.queryEdnsAddress, responseHandler, errorHandler);

// // Get Address's NFT Record
// router.get("/:fqdn/nft", EdnsController.queryEdnsNft, responseHandler, errorHandler);

// // Get Address's Text Record
// router.get("/:fqdn/text", EdnsController.queryEdnsText, responseHandler, errorHandler);

// // Get Address's Domain Record
// router.get("/:address/domain", EdnsController.queryEdnsDomain, responseHandler, errorHandler);

// // Get Address's Text Record with Type
// router.get("/:fqdn/text/:type", EdnsController.queryEdnsTypeText, responseHandler, errorHandler);

// const router = express.Router();
// router.use("/record", recordRouter, responseHandler as any, errorHandler);
// -------------------Separate Router---------------------------------------------

router.get(
  "/*",
  (req: Request, res: Response, next: NextFunction) => {
    next(new Error("UNKNOWN_ROUTE"));
  },
  errorHandler,
);

export default router;
