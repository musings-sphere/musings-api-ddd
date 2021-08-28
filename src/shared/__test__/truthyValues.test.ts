import truthyValues from "../truthyValues";

describe("The truthy values helper function", () => {
	it("should return true for a object with elements", () => {
		const object = { name: "masha" };

		expect(truthyValues(object)).toBeTruthy();
	});

	it("should return false for an empty object", () => {
		const object = {};

		expect(truthyValues(object)).toBeTruthy();
	});
});
