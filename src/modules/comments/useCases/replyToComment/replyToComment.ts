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
import { ArticleService } from "../../../articles/services/articleService";
import { Author } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import { Comment, CommentText } from "../../domain";
import { ICommentRepo } from "../../repo/commentRepo";
import { ReplyToCommentDTO } from "./replyToCommentDTO";
import { ReplyToCommentErrors } from "./replyToCommentErrors";

type Response = Either<
	| ReplyToCommentErrors.CommentNotFoundError
	| ReplyToCommentErrors.ArticleNotFoundError
	| ReplyToCommentErrors.AuthorNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;

export class ReplyToComment
	implements UseCase<ReplyToCommentDTO, Promise<Response>>
{
	private authorRepo: IAuthorRepo;
	private articleRepo: IArticleRepo;
	private commentRepo: ICommentRepo;
	private articleService: ArticleService;

	constructor(
		authorRepo: IAuthorRepo,
		articleRepo: IArticleRepo,
		commentRepo: ICommentRepo,
		articleService: ArticleService
	) {
		this.authorRepo = authorRepo;
		this.articleRepo = articleRepo;
		this.commentRepo = commentRepo;
		this.articleService = articleService;
	}

	private async getArticle(
		slug: ArticleSlug
	): Promise<
		Either<ReplyToCommentErrors.ArticleNotFoundError, Result<Article>>
	> {
		try {
			const article = await this.articleRepo.getArticleBySlug(slug.value);
			return right(Result.ok<Article>(article));
		} catch (err) {
			return left(new ReplyToCommentErrors.ArticleNotFoundError(slug.value));
		}
	}

	private async getAuthor(
		userId: string
	): Promise<
		Either<ReplyToCommentErrors.AuthorNotFoundError, Result<Author>>
	> {
		try {
			const author = await this.authorRepo.getAuthorByUserId(userId);
			return right(Result.ok<Author>(author));
		} catch (err) {
			return left(new ReplyToCommentErrors.AuthorNotFoundError(userId));
		}
	}

	private async getParentComment(
		commentId: string
	): Promise<
		Either<ReplyToCommentErrors.CommentNotFoundError, Result<Comment>>
	> {
		try {
			const comment = await this.commentRepo.getCommentByCommentId(commentId);
			return right(Result.ok<Comment>(comment));
		} catch (err) {
			return left(new ReplyToCommentErrors.CommentNotFoundError(commentId));
		}
	}

	public async execute(req: ReplyToCommentDTO): Promise<Response> {
		let article: Article;
		let author: Author;
		let slug: ArticleSlug;
		let parentComment: Comment;
		const { userId, parentCommentId } = req;

		try {
			const slugOrError = ArticleSlug.createFromExisting(req.slug);

			if (slugOrError.isFailure) {
				return left(slugOrError);
			}

			slug = slugOrError.getValue();

			const asyncResults = await Promise.all([
				this.getArticle(slug),
				this.getAuthor(userId),
				this.getParentComment(parentCommentId),
			]);

			for (let result of asyncResults) {
				if (result.isLeft()) {
					return left(result.value);
				}
			}

			const [articleResult, authorResult, parentCommentResult] = asyncResults;

			article = (articleResult.value as Result<Article>).getValue();
			author = (authorResult.value as Result<Author>).getValue();
			parentComment = (
				parentCommentResult.value as Result<Comment>
			).getValue();

			const commentTextOrError = CommentText.create({ value: req.comment });

			if (commentTextOrError.isFailure) {
				return left(commentTextOrError);
			}

			const commentText: CommentText = commentTextOrError.getValue();

			const replyToCommentResult: Either<
				Result<any>,
				Result<void>
			> = this.articleService.replyToComment(
				article,
				author,
				parentComment,
				commentText
			);

			if (replyToCommentResult.isLeft()) {
				return left(replyToCommentResult.value);
			}

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
