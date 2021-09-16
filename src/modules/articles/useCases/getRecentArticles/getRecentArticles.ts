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
import { GetRecentArticlesRequestDTO } from "./getRecentArticlesRequestDTO";

type Response = Either<AppError.UnexpectedError, Result<ArticleDetails[]>>;

export class GetRecentArticles
	implements UseCase<GetRecentArticlesRequestDTO, Promise<Response>>
{
	private articleRepo: IArticleRepo;

	constructor(articleRepo: IArticleRepo) {
		this.articleRepo = articleRepo;
	}

	public async execute(req: GetRecentArticlesRequestDTO): Promise<Response> {
		try {
			const articles = await this.articleRepo.getRecentArticles(req.offset);
			return right(Result.ok<ArticleDetails[]>(articles));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
