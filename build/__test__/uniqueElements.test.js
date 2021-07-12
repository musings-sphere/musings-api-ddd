"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const uniqueElements_1 = tslib_1.__importDefault(require("../uniqueElements"));
describe("The unique helper function", () => {
	it("should return an array with distinct elements", () => {
		const arr = ["a", "b", "a"];
		expect(uniqueElements_1.default(arr)).toBeDistinct();
	});
	it("should return the original array if length is less than 2", () => {
		const arr = ["a"];
		expect(uniqueElements_1.default(arr)).toBeDistinct();
	});
});
//# sourceMappingURL=uniqueElements.test.js.map
