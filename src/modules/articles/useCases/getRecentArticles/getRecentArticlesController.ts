import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { ArticleDetailsMap } from "../../mappers";
import { GetRecentArticles } from "./getRecentArticles";
import { GetRecentArticlesRequestDTO } from "./getRecentArticlesRequestDTO";
import { GetRecentArticlesResponseDTO } from "./getRecentArticlesResponseDTO";

export class GetRecentArticlesController extends BaseController {
	private useCase: GetRecentArticles;

	constructor(useCase: GetRecentArticles) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
		const dto: GetRecentArticlesRequestDTO = {
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
				return this.ok<GetRecentArticlesResponseDTO>(res, {
					articles: articleDetails.map((d) => ArticleDetailsMap.toDTO(d)),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
