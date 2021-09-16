import { Result, UseCaseError } from "../../../../shared/core";

export namespace CreateAuthorErrors {
	export class UserDoesntExistError extends Result<UseCaseError> {
		constructor(userId: string) {
			super(false, {
				message: `A user for user id ${userId} doesn't exist or was deleted.`,
			} as UseCaseError);
		}
	}

	export class AuthorAlreadyExistsError extends Result<UseCaseError> {
		constructor(userId: string) {
			super(false, {
				message: `Author for ${userId} already exists.`,
			} as UseCaseError);
		}
	}
}
