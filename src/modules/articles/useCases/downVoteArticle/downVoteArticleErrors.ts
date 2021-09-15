import { Result, UseCaseError } from "../../../../shared/core";

export namespace DownVoteArticleErrors {
	export class AuthorNotFoundError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Couldn't find a author to upVote the article.`,
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

	export class AlreadyDownVotedError extends Result<UseCaseError> {
		constructor(articleId: string, authorId: string) {
			super(false, {
				message: `This article was already downVoted, articleId {${articleId}}, authorId {${authorId}}.`,
			} as UseCaseError);
		}
	}
}
