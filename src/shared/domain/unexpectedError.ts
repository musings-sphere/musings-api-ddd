import { Result } from "./result";

export class UnexpectedError extends Result<void> {
	// TODO: Implement logger here?
	public constructor() {
		super(false, "An unexpected error occurred.");
	}
}
