import { Request, Response } from "express";
import { AddPost, AddPostRequestDTO } from "../../../domain";
import { BaseController, CodeHttp } from "../../../shared/frameworks";
import { TextUtils } from "../../../shared/utils/textUtils";

export class AddPostController extends BaseController {
	private addPost: AddPost;

	public constructor(addPost: AddPost) {
		super();
		this.addPost = addPost;
	}

	public buildDTO(httpRequest: Request): AddPostRequestDTO {
		const userAgent = httpRequest.headers["user-agent"];
		const referer = httpRequest.headers.referer;

		return {
			author: httpRequest.body.author,
			text: TextUtils.sanitize(httpRequest.body.text),
			ip: httpRequest.ip,
			referer: referer,
			browser: userAgent,
		};
	}

	protected async executeImpl(req: Request, res: Response): Promise<Response> {
		try {
			const dto = this.buildDTO(req);
			const useCaseResult = await this.addPost.execute(dto);

			if (useCaseResult.error) {
				return this.badRequest(res, useCaseResult.error);
			}

			return this.ok(res, useCaseResult.getValue, CodeHttp.CREATED);
		} catch (e) {
			return this.fail(res, e as Error);
		}
	}
}
