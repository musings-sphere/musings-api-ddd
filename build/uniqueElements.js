"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Get unique elements in an array, even if they're complex like nested arrays or objects
const uniqueElements = (array) => {
	if (array.length <= 1) {
		return array;
	}
	// Turn all elements into string, including arrays
	const stringElements = array.map((key) => JSON.stringify(key));
	// Get the unique elements by using ES6 Set
	const uniqueElements = [...new Set(stringElements)];
	// Turn the non-string elements back into non-strings
	return uniqueElements.map((key) => {
		// If it's an array, this will return the original array
		try {
			return JSON.parse(key);
		} catch (err) {
			// Or if it was just a string, let's just return that.
			return key;
		}
	});
};
exports.default = uniqueElements;
//# sourceMappingURL=uniqueElements.js.map
