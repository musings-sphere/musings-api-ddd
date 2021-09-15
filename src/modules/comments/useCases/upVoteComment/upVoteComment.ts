import {
	AppError,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { Article } from "../../../articles/domain";
import { IArticleRepo } from "../../../articles/repos/articleRepo";
import { ArticleService } from "../../../articles/services/articleService";
import { Author } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import { Comment, CommentVote } from "../../domain";
import { ICommentRepo } from "../../repo/commentRepo";
import { ICommentVotesRepo } from "../../repo/commentVotesRepo";
import { UpVoteCommentDTO } from "./upVoteCommentDTO";
import { UpvoteCommentErrors } from "./upVoteCommentErrors";
import { UpVoteCommentResponse } from "./upVoteCommentResonse";

export class UpVoteComment
	implements UseCase<UpVoteCommentDTO, Promise<UpVoteCommentResponse>>
{
	private articleRepo: IArticleRepo;
	private authorRepo: IAuthorRepo;
	private commentRepo: ICommentRepo;
	private commentVotesRepo: ICommentVotesRepo;
	private articleService: ArticleService;

	constructor(
		articleRepo: IArticleRepo,
		authorRepo: IAuthorRepo,
		commentRepo: ICommentRepo,
		commentVotesRepo: ICommentVotesRepo,
		articleService: ArticleService
	) {
		this.articleRepo = articleRepo;
		this.authorRepo = authorRepo;
		this.commentRepo = commentRepo;
		this.commentVotesRepo = commentVotesRepo;
		this.articleService = articleService;
	}

	public async execute(req: UpVoteCommentDTO): Promise<UpVoteCommentResponse> {
		let author: Author;
		let article: Article;
		let comment: Comment;
		let existingVotesOnCommentByMember: CommentVote[];

		try {
			try {
				author = await this.authorRepo.getAuthorByUserId(req.userId);
			} catch (err) {
				return left(new UpvoteCommentErrors.AuthorNotFoundError());
			}

			try {
				comment = await this.commentRepo.getCommentByCommentId(req.commentId);
			} catch (err) {
				return left(
					new UpvoteCommentErrors.CommentNotFoundError(req.commentId)
				);
			}

			try {
				article = await this.articleRepo.getArticleByArticleId(
					comment.articleId.id.toString()
				);
			} catch (err) {
				return left(
					new UpvoteCommentErrors.ArticleNotFoundError(req.commentId)
				);
			}

			existingVotesOnCommentByMember =
				await this.commentVotesRepo.getVotesForCommentByMemberId(
					comment.commentId,
					author.authorId
				);

			const upvoteCommentResult = this.articleService.upVoteComment(
				article,
				author,
				comment,
				existingVotesOnCommentByMember
			);

			if (upvoteCommentResult.isLeft()) {
				return left(upvoteCommentResult.value);
			}

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
