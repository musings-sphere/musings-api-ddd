import { Result, UseCaseError } from "../../../../shared/core";

export namespace CreateArticleErrors {
	export class AuthorDoesntExistError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `The author doesn't exist for this account.`,
			} as UseCaseError);
		}
	}
}
