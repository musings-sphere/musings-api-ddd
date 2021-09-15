import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { DownVoteComment } from "./downVoteComment";
import { DownVoteCommentDTO } from "./downVoteCommentDTO";
import { DownvoteCommentErrors } from "./downVoteCommentErrors";

export class DownVoteCommentController extends BaseController {
	private useCase: DownVoteComment;

	constructor(useCase: DownVoteComment) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		const dto: DownVoteCommentDTO = {
			userId: userId,
			commentId: req.params.commentId,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case DownvoteCommentErrors.AuthorNotFoundError:
					case DownvoteCommentErrors.ArticleNotFoundError:
					case DownvoteCommentErrors.CommentNotFoundError:
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
