import { Result, UseCaseError } from "../../../../shared/core";

export namespace DownvoteCommentErrors {
	export class AuthorNotFoundError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Couldn't find a author to downvote the comment.`,
			} as UseCaseError);
		}
	}

	export class CommentNotFoundError extends Result<UseCaseError> {
		constructor(commentId: string) {
			super(false, {
				message: `Couldn't find a comment with id {${commentId}}.`,
			} as UseCaseError);
		}
	}

	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(commentId: string) {
			super(false, {
				message: `Couldn't find a article for comment {${commentId}}.`,
			} as UseCaseError);
		}
	}
}
