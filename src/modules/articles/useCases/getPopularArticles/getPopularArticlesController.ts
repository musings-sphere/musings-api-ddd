import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { ArticleDetailsMap } from "../../mappers";
import { GetPopularArticles } from "./getPopularArticles";
import { GetPopularArticlesRequestDTO } from "./getPopularArticlesRequestDTO";
import { GetPopularArticlesResponseDTO } from "./getPopularArticlesResponseDTO";

export class GetPopularArticlesController extends BaseController {
	private useCase: GetPopularArticles;

	constructor(useCase: GetPopularArticles) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetPopularArticlesRequestDTO = {
			offset: +req.query.offset,
			userId: !!req.decoded === true ? req.decoded.userId : null,
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
				return this.ok<GetPopularArticlesResponseDTO>(res, {
					articles: articleDetails.map((d) => ArticleDetailsMap.toDTO(d)),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
