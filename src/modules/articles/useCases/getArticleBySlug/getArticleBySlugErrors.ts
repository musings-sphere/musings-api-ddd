import { Result, UseCaseError } from "../../../../shared/core";

export namespace GetArticleBySlugErrors {
	export class ArticleNotFoundError extends Result<UseCaseError> {
		constructor(slug: string) {
			super(false, {
				message: `Couldn't find a article by slug {${slug}}.`,
			} as UseCaseError);
		}
	}
}
