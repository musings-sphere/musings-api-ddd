import { Result, UseCaseError } from "../../../../shared/core";

export namespace ReplyToCommentErrors {
	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(slug: string) {
			super(false, {
				message: `Couldn't find a article by slug {${slug}}.`,
			} as UseCaseError);
		}
	}

	export class CommentNotFoundError extends Result<UseCaseError> {
		constructor(commentId: string) {
			super(false, {
				message: `Couldn't find a comment by commentId {${commentId}}.`,
			} as UseCaseError);
		}
	}

	export class AuthorNotFoundError extends Result<UseCaseError> {
		constructor(userId: string) {
			super(false, {
				message: `Couldn't find a author by userId {${userId}}.`,
			} as UseCaseError);
		}
	}
}
