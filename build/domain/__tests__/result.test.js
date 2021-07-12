"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("../result");
describe("Result class", () => {
	const successObject = result_1.Result.ok("Operation OK");
	const failObject = result_1.Result.fail("This is an error");
	it("should create a success object", () => {
		expect(successObject.isSuccess).toBe(true);
		expect(successObject.error).toBeNull();
		expect(successObject.getValue).toStrictEqual("Operation OK");
	});
	it("should create a fail result object", () => {
		expect(failObject.isSuccess).toBe(false);
		expect(failObject.error).toEqual("This is an error");
		expect(() => {
			failObject.getValue;
		}).toThrowError();
	});
});
//# sourceMappingURL=result.test.js.map
