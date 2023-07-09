import { Request, Response, NextFunction } from "express";
import * as express from "express";
import EdnsController from "../controllers/edns.controller";

const router = express.Router();
// Get Domain's Address Record
router.get("/:fqdn/address", EdnsController.queryEdnsAddress);

// Get Address's NFT Record
router.get("/:fqdn/nft", EdnsController.queryEdnsNft);

// Get Address's Text Record
router.get("/:fqdn/text", EdnsController.queryEdnsText);

// Get Address's Domain Record
router.get("/:address/domain", EdnsController.queryEdnsDomain);

// Get Address's Text Record with Type
router.get("/:fqdn/text/:type", EdnsController.queryEdnsTypeText);

router.get("/*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error("UNKNOWN_ROUTE"));
});

// router.get(
//   "/edns/record/:fqdn/multi-coin-address/:coin",
//   EdnsController.queryEdnsMultiCoinAddress
// );
// router.get("/edns/metadata", EdnsController.queryEdnsAddress);

export default router;
