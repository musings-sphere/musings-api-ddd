import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { TextUtils } from "../../../../shared/utils";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { ReplyToComment } from "./replyToComment";
import { ReplyToCommentDTO } from "./replyToCommentDTO";
import { ReplyToCommentErrors } from "./replyToCommentErrors";

export class ReplyToCommentController extends BaseController {
	private useCase: ReplyToComment;

	constructor(useCase: ReplyToComment) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		const dto: ReplyToCommentDTO = {
			comment: TextUtils.sanitize(req.body.comment),
			userId: userId,
			slug: req.query.slug as string,
			parentCommentId: req.params.commentId,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case ReplyToCommentErrors.ArticleNotFoundError:
						return this.notFound(res, error.errorValue().message);
					case ReplyToCommentErrors.CommentNotFoundError:
						return this.notFound(res, error.errorValue().message);
					case ReplyToCommentErrors.AuthorNotFoundError:
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
