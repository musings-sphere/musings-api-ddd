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
import { GetPopularArticlesRequestDTO } from "./getPopularArticlesRequestDTO";

type Response = Either<AppError.UnexpectedError, Result<ArticleDetails[]>>;

export class GetPopularArticles
	implements UseCase<GetPopularArticlesRequestDTO, Promise<Response>>
{
	private articleRepo: IArticleRepo;

	constructor(postRepo: IArticleRepo) {
		this.articleRepo = postRepo;
	}

	public async execute(req: GetPopularArticlesRequestDTO): Promise<Response> {
		try {
			const articles = await this.articleRepo.getPopularArticles(req.offset);
			return right(Result.ok<ArticleDetails[]>(articles));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
