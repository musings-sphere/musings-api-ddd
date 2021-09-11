import { Result, UseCaseError } from "../../../../shared/core";

export namespace GetUserByUserNameErrors {
	export class UserNotFoundError extends Result<UseCaseError> {
		constructor(userName: string) {
			super(false, {
				message: `No user with the username ${userName} was found`,
			} as UseCaseError);
		}
	}
}
