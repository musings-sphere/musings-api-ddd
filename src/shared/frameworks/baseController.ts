import { Request, Response } from "express";
import { CodeHttp } from "./codeHttp";

export abstract class BaseController {
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
			this.fail(res, "An unexpected error occurred");
		}
	}

	public ok<T>(res: Response, dto?: T, created?: CodeHttp): Response {
		const codeHttp = created || CodeHttp.OK;
		if (dto) {
			res.type("application/json");

			return res.status(codeHttp).json(dto);
		} else {
			return res.sendStatus(codeHttp);
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