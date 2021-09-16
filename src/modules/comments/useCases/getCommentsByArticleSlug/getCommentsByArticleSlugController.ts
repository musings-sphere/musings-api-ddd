import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { CommentDetailsMap } from "../../mappers";
import { GetCommentsByArticleSlug } from "./getCommentsByArticleSlug";
import { GetCommentsByArticleSlugRequestDTO } from "./getCommentsByArticleSlugRequestDTO";
import { GetCommentsByArticleSlugResponseDTO } from "./getCommentsByArticleSlugResponseDTO";

export class GetCommentsByArticleSlugController extends BaseController {
	private useCase: GetCommentsByArticleSlug;

	constructor(useCase: GetCommentsByArticleSlug) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetCommentsByArticleSlugRequestDTO = {
			slug: req.query.slug as string,
			offset: +req.query.offset,
			userId: req.decoded ? req.decoded.userId : null,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				const commentDetails = result.value.getValue();
				return this.ok<GetCommentsByArticleSlugResponseDTO>(res, {
					comments: commentDetails.map((c) => CommentDetailsMap.toDTO(c)),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
