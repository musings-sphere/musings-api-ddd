import { Result, UseCaseError } from "../../../../shared/core";

export namespace RefreshAccessTokenErrors {
	export class RefreshTokenNotFound extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Refresh token doesn't exist`,
			} as UseCaseError);
		}
	}

	export class UserNotFoundOrDeletedError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `User not found or doesn't exist anymore.`,
			} as UseCaseError);
		}
	}
}
