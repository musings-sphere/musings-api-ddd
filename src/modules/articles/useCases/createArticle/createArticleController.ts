import { BaseController } from "../../../../app/models";
import { TextUtils } from "../../../../shared/utils";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { CreateArticle } from "./createArticle";
import { CreateArticleDTO } from "./createArticleDTO";
import { CreateArticleErrors } from "./createArticleErrors";

export class CreateArticleController extends BaseController {
	private useCase: CreateArticle;

	constructor(useCase: CreateArticle) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: any): Promise<any> {
		const { userId } = req.decoded;

		const dto: CreateArticleDTO = {
			title: TextUtils.sanitize(req.body.title),
			text: TextUtils.sanitize(req.body.text),
			userId: userId,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case CreateArticleErrors.AuthorDoesntExistError:
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
