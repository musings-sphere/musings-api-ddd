"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTruthyValuesFromObject = (object) => {
	if (!object) {
		return [];
	}
	try {
		return Object.keys(object).filter((key) => object[key] === true);
	} catch (err) {
		return [];
	}
};
exports.default = getTruthyValuesFromObject;
//# sourceMappingURL=truthyValues.js.map
