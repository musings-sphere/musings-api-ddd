import { Request, Response } from "express";
import { AppLogger } from "../../shared/logger";
import { CodeHttp } from "./codeHttp";

export abstract class BaseController {
	private logger = new AppLogger(BaseController.name);

	public static jsonResponse(
		res: Response,
		code: number,
		message: string
	): Response {
		return res.status(code).json({ message });
	}

	public async execute(req: Request, res: Response): Promise<void | Response> {
		try {
			await this.executeImpl(req, res);
		} catch (err) {
			this.logger.error("[BaseController]: Uncaught controller error", err);
			this.fail(res, "An unexpected error occurred");
		}
	}

	public ok<T>(res: Response, dto?: T, message?: string): Response {
		if (!!dto) {
			res.type("application/json");

			return BaseController.jsonResponse(
				res,
				CodeHttp.OK,
				message ? message : "Ok"
			);
		} else {
			return res.sendStatus(CodeHttp.OK);
		}
	}

	public created<T>(res: Response, dto?: T, message?: string): Response {
		if (!!dto) {
			res.type("application/json");

			return BaseController.jsonResponse(
				res,
				CodeHttp.CREATED,
				message ? message : "Created"
			);
		} else {
			return res.sendStatus(CodeHttp.CREATED);
		}
	}

	public badRequest(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.BAD_REQUEST,
			message ? message : "Bad request"
		);
	}

	public unauthorized(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.UNAUTHORIZED,
			message ? message : "Unauthorized"
		);
	}

	public paymentRequired(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.PAYMENT_REQUIRED,
			message ? message : "Payment required"
		);
	}

	public forbidden(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.FORBIDDEN,
			message ? message : "Forbidden"
		);
	}

	public notFound(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.NOT_FOUND,
			message ? message : "Not found"
		);
	}

	public conflict(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.CONFLICT,
			message ? message : "Conflict"
		);
	}

	public tooMany(res: Response, message?: string): Response {
		return BaseController.jsonResponse(
			res,
			CodeHttp.TOO_MANY,
			message ? message : "Too many requests"
		);
	}

	public fail(res: Response, error: Error | string): Response {
		return res.status(CodeHttp.SERVER_ERROR).json({
			message: error.toString(),
		});
	}

	protected abstract executeImpl(
		req: Request,
		res: Response
	): Promise<void | Response>;
}
