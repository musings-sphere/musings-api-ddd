import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { ArticleDTO } from "../../dtos";
import { ArticleDetailsMap } from "../../mappers";
import { GetArticleBySlug } from "./getArticleBySlug";
import { GetArticleBySlugDTO } from "./getArticleBySlugDTO";

export class GetArticleBySlugController extends BaseController {
	private useCase: GetArticleBySlug;

	constructor(useCase: GetArticleBySlug) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetArticleBySlugDTO = {
			slug: req.query.slug as string,
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
				const articleDetails = result.value.getValue();
				return this.ok<{ article: ArticleDTO }>(res, {
					article: ArticleDetailsMap.toDTO(articleDetails),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
