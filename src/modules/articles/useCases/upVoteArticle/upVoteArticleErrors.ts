import { Result, UseCaseError } from "../../../../shared/core";

export namespace UpVoteArticleErrors {
	export class AuthorNotFoundError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Couldn't find an author to upvote the article.`,
			} as UseCaseError);
		}
	}

	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(slug: string) {
			super(false, {
				message: `Couldn't find a article by slug {${slug}}.`,
			} as UseCaseError);
		}
	}

	export class AlreadyUpVotedError extends Result<UseCaseError> {
		constructor(articleId: string, authorId: string) {
			super(false, {
				message: `This article was already upVoted articleId {${articleId}}, memberId {${authorId}}.`,
			} as UseCaseError);
		}
	}
}
