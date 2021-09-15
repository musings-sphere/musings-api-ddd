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
import { UpVoteArticleDTO } from "./upVoteArticleDTO";
import { UpVoteArticleErrors } from "./upVoteArticleErrors";
import { UpVoteArticleResponse } from "./upVoteArticleResponse";

export class UpVoteArticle
	implements UseCase<UpVoteArticleDTO, Promise<UpVoteArticleResponse>>
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

	public async execute(req: UpVoteArticleDTO): Promise<UpVoteArticleResponse> {
		let author: Author;
		let article: Article;
		let existingVotesOnArticleByAuthor: ArticleVote[];

		try {
			try {
				author = await this.authorRepo.getAuthorByUserId(req.userId);
			} catch (err) {
				return left(new UpVoteArticleErrors.AuthorNotFoundError());
			}

			try {
				article = await this.articleRepo.getArticleBySlug(req.slug);
			} catch (err) {
				return left(new UpVoteArticleErrors.ArticleNotFoundError(req.slug));
			}

			existingVotesOnArticleByAuthor =
				await this.articleVotesRepo.getVotesForArticleByAuthorId(
					article.articleId,
					author.authorId
				);

			const upvotePostResult = this.articleService.upVoteArticle(
				article,
				author,
				existingVotesOnArticleByAuthor
			);

			if (upvotePostResult.isLeft()) {
				return left(upvotePostResult.value);
			}

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
