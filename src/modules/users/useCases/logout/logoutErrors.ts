import { Result, UseCaseError } from "../../../../shared/core";

export namespace LogoutErrors {
	export class UserNotFoundOrDeletedError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `User not found or doesn't exist anymore.`,
			} as UseCaseError);
		}
	}
}
