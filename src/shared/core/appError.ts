import { Result } from "./result";
import { UseCaseError } from "./useCaseError";

export namespace AppError {
	export class UnexpectedError extends Result<UseCaseError> {
		public constructor(err: Error) {
			super(false, {
				message: err.message ? err.message : "An unexpected error occurred.",
				error: err,
			} as UseCaseError);

			this.logger.error("[AppError] =>", err);
		}

		public static create(err: Error): UnexpectedError {
			return new UnexpectedError(err);
		}
	}
}
