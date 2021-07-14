"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
	constructor(isSuccess, error, value) {
		this.isSuccess = isSuccess;
		this.error = error;
		this.value = value;
		Object.freeze(this);
	}
	get getValue() {
		if (!this.isSuccess) {
			throw new Error(
				"Can't get the value of an error result. Use 'errorValue' instead.",
			);
		}
		return this.value;
	}
	static ok(value) {
		return new Result(true, null, value);
	}
	static fail(error) {
		return new Result(false, error);
	}
}
exports.Result = Result;
//# sourceMappingURL=result.js.map
