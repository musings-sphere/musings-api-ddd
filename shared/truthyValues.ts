const getTruthyValuesFromObject = (
	object: Record<string, unknown>
): string[] => {
	if (!object) {
		return [];
	}
	try {
		return Object.keys(object).filter((key) => object[key] === true);
	} catch (err) {
		return [];
	}
};

export default getTruthyValuesFromObject;
