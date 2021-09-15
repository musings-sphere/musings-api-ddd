import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { CommentDetailsMap } from "../../mappers";
import { GetCommentByCommentId } from "./getCommentByCommentId";
import { GetCommentByCommentIdErrors } from "./getCommentByCommentIdErrors";
import { GetCommentByCommentIdRequestDTO } from "./getCommentByCommentIdRequestDTO";
import { GetCommentByCommentIdResponseDTO } from "./getCommentByCommentIdResponseDTO";

export class GetCommentByCommentIdController extends BaseController {
	private useCase: GetCommentByCommentId;

	constructor(useCase: GetCommentByCommentId) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetCommentByCommentIdRequestDTO = {
			commentId: req.params.commentId,
			userId: req.decoded ? req.decoded.userId : null,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case GetCommentByCommentIdErrors.CommentNotFoundError:
						return this.notFound(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				const commentDetails = result.value.getValue();
				return this.ok<GetCommentByCommentIdResponseDTO>(res, {
					comment: CommentDetailsMap.toDTO(commentDetails),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
