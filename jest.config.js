module.exports = {
	verbose: true,
	globals: {
		"ts-jest": {
			tsconfig: "<rootDir>/tsconfig.json",
		},
	},
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "json"],
	coverageReporters: ["html", "json", "lcov", "text", "clover"],
	modulePathIgnorePatterns: ["<rootDir>/node_modules"],
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/interface.d.ts",
		"!src/**/*interfaces.d.ts",
	],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	testEnvironment: "node",
	setupFilesAfterEnv: ["<rootDir>/src/shared/testing/setupJest.ts"],
};
