import { Either, left, Result, right } from "../../../shared/core";
import { Author } from "../../author/domain";
import { Comment, CommentText, CommentVote } from "../../comments/domain";
import { DownVoteCommentResponse } from "../../comments/useCases/downVoteComment/downVoteCommentResponse";
import { UpVoteCommentResponse } from "../../comments/useCases/upVoteComment/upVoteCommentResonse";
import { Article, ArticleVote } from "../domain";
import { DownVoteArticleResponse } from "../useCases/downVoteArticle/downVoteArticleResponse";

export class ArticleService {
	public downVoteComment(
		article: Article,
		author: Author,
		comment: Comment,
		existingVotesOnCommentByMember: CommentVote[]
	): DownVoteCommentResponse {
		// If it was already down voted, do nothing.
		const existingDownvote: CommentVote = existingVotesOnCommentByMember.find(
			(v) => v.isDownVote()
		);

		const downvoteAlreadyExists = !!existingDownvote;

		if (downvoteAlreadyExists) {
			// Do nothing
			return right(Result.ok<void>());
		}

		// If upvote exists, we need to remove it.
		const existingUpvote: CommentVote = existingVotesOnCommentByMember.find(
			(v) => v.isUpVote()
		);

		const upvoteAlreadyExists = !!existingUpvote;

		if (upvoteAlreadyExists) {
			comment.removeVote(existingUpvote);

			article.updateComment(comment);

			return right(Result.ok<void>());
		}

		// Neither, let's create the downvote ourselves.
		const downvoteOrError = CommentVote.createDownvote(
			author.authorId,
			comment.commentId
		);

		if (downvoteOrError.isFailure) {
			return left(downvoteOrError);
		}

		const downvote: CommentVote = downvoteOrError.getValue();
		comment.addVote(downvote);
		article.updateComment(comment);

		return right(Result.ok<void>());
	}

	public upVoteComment(
		article: Article,
		author: Author,
		comment: Comment,
		existingVotesOnCommentByMember: CommentVote[]
	): UpVoteCommentResponse {
		// If upvote already exists
		const existingUpVote: CommentVote = existingVotesOnCommentByMember.find(
			(v) => v.isUpVote()
		);

		const upVoteAlreadyExists = !!existingUpVote;
		if (upVoteAlreadyExists) {
			// Do nothing
			return right(Result.ok<void>());
		}

		// If downvote exists, we need to promote the remove it.
		const existingDownVote: CommentVote = existingVotesOnCommentByMember.find(
			(v) => v.isDownVote()
		);

		const downVoteAlreadyExists = !!existingDownVote;
		if (downVoteAlreadyExists) {
			comment.removeVote(existingDownVote);

			article.updateComment(comment);

			return right(Result.ok<void>());
		}

		// Otherwise, give the comment an upvote
		const upVoteOrError = CommentVote.createUpVote(
			author.authorId,
			comment.commentId
		);

		if (upVoteOrError.isFailure) {
			return left(upVoteOrError);
		}

		const upvote: CommentVote = upVoteOrError.getValue();
		comment.addVote(upvote);

		article.updateComment(comment);

		return right(Result.ok<void>());
	}

	public downVoteArticle(
		article: Article,
		author: Author,
		existingVotesOnArticleByAuthor: ArticleVote[]
	): DownVoteArticleResponse {
		// If already downVoted, do nothing
		const existingDownVote: ArticleVote = existingVotesOnArticleByAuthor.find(
			(v) => v.isDownVote()
		);

		const downVoteAlreadyExists = !!existingDownVote;

		if (downVoteAlreadyExists) {
			return right(Result.ok<void>());
		}

		// If upvote exists, we need to remove it
		const existingUpVote: ArticleVote = existingVotesOnArticleByAuthor.find(
			(v) => v.isUpVote()
		);

		const upVoteAlreadyExists = !!existingUpVote;

		if (upVoteAlreadyExists) {
			article.removeVote(existingUpVote);

			return right(Result.ok<void>());
		}

		// Otherwise, we get to create the downVote now
		const downVoteOrError = ArticleVote.createDownVote(
			author.authorId,
			article.articleId
		);

		if (downVoteOrError.isFailure) {
			return left(downVoteOrError);
		}

		const downVote: ArticleVote = downVoteOrError.getValue();
		article.addVote(downVote);

		return right(Result.ok<void>());
	}

	public upVoteArticle(
		article: Article,
		author: Author,
		existingVotesOnArticleByAuthor: ArticleVote[]
	): UpVoteCommentResponse {
		const existingUpVote: ArticleVote = existingVotesOnArticleByAuthor.find(
			(v) => v.isUpVote()
		);

		// If already upVoted, do nothing
		const upVoteAlreadyExists = !!existingUpVote;

		if (upVoteAlreadyExists) {
			return right(Result.ok<void>());
		}

		// If downVoted, remove the downvote
		const existingDownVote: ArticleVote = existingVotesOnArticleByAuthor.find(
			(v) => v.isDownVote()
		);

		const downVoteAlreadyExists = !!existingDownVote;

		if (downVoteAlreadyExists) {
			article.removeVote(existingDownVote);
			return right(Result.ok<void>());
		}

		// Otherwise, add upVote
		const upVoteOrError = ArticleVote.createUpVote(
			author.authorId,
			article.articleId
		);

		if (upVoteOrError.isFailure) {
			return left(upVoteOrError);
		}

		const upVote: ArticleVote = upVoteOrError.getValue();
		article.addVote(upVote);

		return right(Result.ok<void>());
	}

	public replyToComment(
		article: Article,
		author: Author,
		parentComment: Comment,
		newCommentText: CommentText
	): Either<Result<any>, Result<void>> {
		const commentOrError = Comment.create({
			authorId: author.authorId,
			text: newCommentText,
			articleId: article.articleId,
			parentCommentId: parentComment.commentId,
		});

		if (commentOrError.isFailure) {
			return left(commentOrError);
		}

		const comment: Comment = commentOrError.getValue();

		article.addComment(comment);

		return right(Result.ok<void>());
	}
}
