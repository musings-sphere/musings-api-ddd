import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { TextUtils } from "../../../../shared/utils";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { ReplyToArticle } from "./replyToArticle";
import { ReplyToArticleDTO } from "./replyToArticleDTO";
import { ReplyToArticleErrors } from "./replyToArticleErrors";

export class ReplyToArticleController extends BaseController {
	private useCase: ReplyToArticle;

	constructor(useCase: ReplyToArticle) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		const dto: ReplyToArticleDTO = {
			comment: TextUtils.sanitize(req.body.comment),
			userId: userId,
			slug: req.query.slug as string,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case ReplyToArticleErrors.ArticleNotFoundError:
						return this.notFound(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
