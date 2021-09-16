import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { Article, ArticleSlug } from "../../../articles/domain";
import { IArticleRepo } from "../../../articles/repos/articleRepo";
import { Author } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import { CommentText, Comment } from "../../domain";
import { ReplyToArticleDTO } from "./replyToArticleDTO";
import { ReplyToArticleErrors } from "./replyToArticleErrors";

type Response = Either<
	| ReplyToArticleErrors.ArticleNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;

export class ReplyToArticle
	implements UseCase<ReplyToArticleDTO, Promise<Response>>
{
	private authorRepo: IAuthorRepo;
	private articleRepo: IArticleRepo;

	constructor(authorRepo: IAuthorRepo, articleRepo: IArticleRepo) {
		this.authorRepo = authorRepo;
		this.articleRepo = articleRepo;
	}

	public async execute(req: ReplyToArticleDTO): Promise<Response> {
		let article: Article;
		let author: Author;
		let slug: ArticleSlug;
		const { userId } = req;
		try {
			const slugOrError = ArticleSlug.createFromExisting(req.slug);
			if (slugOrError.isFailure) {
				return left(slugOrError);
			}

			slug = slugOrError.getValue();

			try {
				[article, author] = await Promise.all([
					this.articleRepo.getArticleBySlug(slug.value),
					this.authorRepo.getAuthorByUserId(userId),
				]);
			} catch (err) {
				return left(new ReplyToArticleErrors.ArticleNotFoundError(slug.value));
			}

			const commentTextOrError = CommentText.create({
				value: req.comment,
			});

			if (commentTextOrError.isFailure) {
				return left(commentTextOrError);
			}

			const commentOrError = Comment.create({
				authorId: author.authorId,
				text: commentTextOrError.getValue(),
				articleId: article.articleId,
			});

			if (commentOrError.isFailure) {
				return left(commentOrError);
			}

			const comment: Comment = commentOrError.getValue();

			article.addComment(comment);

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
