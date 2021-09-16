import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { DownVoteArticle } from "./downVoteArticle";
import { DownVoteArticleDTO } from "./downVoteArticleDTO";
import { DownVoteArticleErrors } from "./downVoteArticleErrors";

export class DownVoteArticleController extends BaseController {
	private useCase: DownVoteArticle;

	constructor(useCase: DownVoteArticle) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		const dto: DownVoteArticleDTO = {
			userId: userId,
			slug: req.body.slug,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case DownVoteArticleErrors.AuthorNotFoundError:
					case DownVoteArticleErrors.ArticleNotFoundError:
						return this.notFound(res, error.errorValue().message);
					case DownVoteArticleErrors.AlreadyDownVotedError:
						return this.conflict(res, error.errorValue().message);
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
