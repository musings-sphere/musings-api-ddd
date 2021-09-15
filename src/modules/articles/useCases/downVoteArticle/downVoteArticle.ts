import {
	AppError,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { Author } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import { Article, ArticleVote } from "../../domain";
import { IArticleRepo } from "../../repos/articleRepo";
import { IArticleVotesRepo } from "../../repos/articleVotesRepo";
import { ArticleService } from "../../services/articleService";
import { DownVoteArticleDTO } from "./downVoteArticleDTO";
import { DownVoteArticleErrors } from "./downVoteArticleErrors";
import { DownVoteArticleResponse } from "./downVoteArticleResponse";

export class DownVoteArticle
	implements UseCase<DownVoteArticleDTO, Promise<DownVoteArticleResponse>>
{
	private authorRepo: IAuthorRepo;
	private articleRepo: IArticleRepo;
	private articleVotesRepo: IArticleVotesRepo;
	private articleService: ArticleService;

	constructor(
		authorRepo: IAuthorRepo,
		articleRepo: IArticleRepo,
		articleVotesRepo: IArticleVotesRepo,
		articleService: ArticleService
	) {
		this.authorRepo = authorRepo;
		this.articleRepo = articleRepo;
		this.articleVotesRepo = articleVotesRepo;
		this.articleService = articleService;
	}

	public async execute(
		req: DownVoteArticleDTO
	): Promise<DownVoteArticleResponse> {
		let author: Author;
		let article: Article;
		let existingVotesOnArticleByAuthor: ArticleVote[];

		try {
			try {
				author = await this.authorRepo.getAuthorByUserId(req.userId);
			} catch (err) {
				return left(new DownVoteArticleErrors.AuthorNotFoundError());
			}

			try {
				article = await this.articleRepo.getArticleBySlug(req.slug);
			} catch (err) {
				return left(new DownVoteArticleErrors.ArticleNotFoundError(req.slug));
			}

			existingVotesOnArticleByAuthor =
				await this.articleVotesRepo.getVotesForArticleByAuthorId(
					article.articleId,
					author.authorId
				);

			const downVoteArticleResult = this.articleService.downVoteArticle(
				article,
				author,
				existingVotesOnArticleByAuthor
			);

			if (downVoteArticleResult.isLeft()) {
				return left(downVoteArticleResult.value);
			}

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
