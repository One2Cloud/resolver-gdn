import { Request, Response, NextFunction } from "express";
import { IGeneralResponse } from "../interfaces/IGeneralOutput.interface";
import { BaseError } from "../interfaces/BaseError.interface";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	let response: IGeneralResponse<undefined>;
	let ttl = 60;
	if (err instanceof BaseError) {
		response = {
			status: err.status,
			onchain: !!req.query.onchain,
			success: false,
			error: {
				code: err.name,
				reason: err.message,
			},
			empty: true,
		};
	} else {
		response = {
			status: 500,
			onchain: !!req.query.onchain,
			success: false,
			error: {
				code: "INTERNAL_SERVER_ERROR",
				reason: "An unexpected error occurred.",
			},
			empty: true,
		};
		console.log(err);
		ttl = 1;
	}
	res.setHeader("Cache-Control", `max-age=${ttl}`);
	return res.status(response.status).json(response);
}
