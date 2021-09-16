import { Result } from "../result";
import { UseCaseError } from "../useCaseError";

describe("Use case error", () => {
	it("should generate an error object", () => {
		class TestUseCaseError extends Result<UseCaseError> {
			constructor() {
				super(false, {
					message: `Error: This is a test error.`,
				} as UseCaseError);
			}
		}
		const errorObject = new TestUseCaseError();
		expect(errorObject).toBeInstanceOf(TestUseCaseError);
		expect(errorObject.errorValue().message).toEqual(
			"Error: This is a test error."
		);
	});
});
