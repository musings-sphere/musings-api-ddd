import { Result, UseCaseError } from "../../../../shared/core";

export namespace UpdateArticleStatsErrors {
	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(articleId: string) {
			super(false, {
				message: `Couldn't find a article by articleId {${articleId}}.`,
			} as UseCaseError);
		}
	}
}
