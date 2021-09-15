import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { UpVoteComment } from "./upVoteComment";
import { UpVoteCommentDTO } from "./upVoteCommentDTO";
import { UpvoteCommentErrors } from "./upVoteCommentErrors";

export class UpVoteCommentController extends BaseController {
	private useCase: UpVoteComment;

	constructor(useCase: UpVoteComment) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userId } = req.decoded;

		const dto: UpVoteCommentDTO = {
			userId: userId,
			commentId: req.params.commentId,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case UpvoteCommentErrors.AuthorNotFoundError:
					case UpvoteCommentErrors.ArticleNotFoundError:
					case UpvoteCommentErrors.CommentNotFoundError:
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
