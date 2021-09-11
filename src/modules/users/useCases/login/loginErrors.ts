import { Result, UseCaseError } from "../../../../shared/core";

export namespace LoginUseCaseErrors {
	export class UserNameDoesntExistError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Username incorrect.`,
			} as UseCaseError);
		}
	}

	export class PasswordDoesntMatchError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `Password doesnt match error.`,
			} as UseCaseError);
		}
	}

	export class UserIsNotVerified extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: `User not verified. Kindly check your email to verify account.`,
			} as UseCaseError);
		}
	}
}
