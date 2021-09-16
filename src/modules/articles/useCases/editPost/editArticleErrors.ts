import { Result, UseCaseError } from "../../../../shared/core";

export namespace EditArticleErrors {
	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(id: string) {
			super(false, {
				message: `Couldn't find an article by id {${id}}.`,
			} as UseCaseError);
		}
	}

	export class ArticleSealedError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `If an article has comments, it's sealed and cannot be edited.`,
			} as UseCaseError);
		}
	}
}
