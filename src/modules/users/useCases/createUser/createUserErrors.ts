import { Result, UseCaseError } from "../../../../shared/core";

export namespace CreateUserErrors {
	export class EmailAlreadyExistsError extends Result<UseCaseError> {
		constructor(email: string) {
			super(false, {
				message: `The email ${email} associated for this account already exists.`,
			} as UseCaseError);
		}
	}

	export class InvalidEmailError extends Result<UseCaseError> {
		constructor() {
			super(false, {
				message: "Invalid email address.",
			} as UseCaseError);
		}
	}

	export class UsernameTakenError extends Result<UseCaseError> {
		constructor(username: string) {
			super(false, {
				message: `The username ${username} was already taken.`,
			} as UseCaseError);
		}
	}
}
