import uniqueElements from "../uniqueElements";

describe("The unique helper function", () => {
	it("should return an array with distinct elements", () => {
		const arr = ["a", "b", "a"];

		expect(uniqueElements(arr)).toBeDistinct();
	});

	it("should return the original array if length is less than 2", () => {
		const arr = ["a"];

		expect(uniqueElements(arr)).toBeDistinct();
	});
});
