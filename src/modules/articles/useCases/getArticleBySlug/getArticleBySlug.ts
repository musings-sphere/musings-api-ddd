import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { ArticleDetails } from "../../domain";
import { IArticleRepo } from "../../repos/articleRepo";
import { GetArticleBySlugDTO } from "./getArticleBySlugDTO";
import { GetArticleBySlugErrors } from "./getArticleBySlugErrors";

type Response = Either<
	GetArticleBySlugErrors.ArticleNotFoundError | AppError.UnexpectedError,
	Result<ArticleDetails>
>;

export class GetArticleBySlug implements UseCase<any, Promise<Response>> {
	private articleRepo: IArticleRepo;

	constructor(postRepo: IArticleRepo) {
		this.articleRepo = postRepo;
	}

	public async execute(req: GetArticleBySlugDTO): Promise<Response> {
		let articleDetails: ArticleDetails;
		const { slug } = req;

		try {
			try {
				articleDetails = await this.articleRepo.getArticleDetailsBySlug(slug);
			} catch (err) {
				return left(new GetArticleBySlugErrors.ArticleNotFoundError(slug));
			}

			return right(Result.ok<ArticleDetails>(articleDetails));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
