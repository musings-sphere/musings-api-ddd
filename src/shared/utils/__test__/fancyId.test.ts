import { fancyID } from "../fancyID";

describe("FancyID ", () => {
	it("should check length of ID", function () {
		const id = fancyID.generate();
		expect(id.length).toEqual(20);
	});

	test("should check we a distinct values created", function () {
		const id1 = fancyID.generate();
		const id2 = fancyID.generate();
		expect(id1).not.toEqual(id2);
	});
});
