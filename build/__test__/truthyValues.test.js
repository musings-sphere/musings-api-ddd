"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const truthyValues_1 = tslib_1.__importDefault(require("../truthyValues"));
describe("The truthy values helper function", () => {
	it("should return true for a object with elements", () => {
		const object = { name: "masha" };
		expect(truthyValues_1.default(object)).toBeTruthy();
	});
	it("should return false for an empty object", () => {
		const object = {};
		expect(truthyValues_1.default(object)).toBeTruthy();
	});
});
//# sourceMappingURL=truthyValues.test.js.map
