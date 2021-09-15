import { Result, UseCaseError } from "../../../../shared/core";

export namespace GetAuthorByUserNameErrors {
	export class AuthorNotFoundError extends Result<UseCaseError> {
		constructor(userName: string) {
			super(false, {
				message: `Couldn't find a author with the username ${userName}`,
			} as UseCaseError);
		}
	}
}
