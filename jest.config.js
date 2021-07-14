module.exports = {
	verbose: true,
	roots: ["<rootDir>/shared"],
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
		"shared/**/*.ts",
		"src/**/*.ts",
		"!src/**/interface.d.ts",
		"!src/**/*interfaces.d.ts",
		"!shared/installDependencies.ts",
		"!shared/types/**/*.ts",
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
	setupFilesAfterEnv: ["<rootDir>/shared/testing/setupJest.ts"],
	moduleNameMapper: {
		//   "^@dataproviders/(.*)$": "<rootDir>/src/dataproviders/$1",
		//   "^@domain/(.*)$": "<rootDir>/src/domain/$1",
		//   "^@frameworks/(.*)$": "<rootDir>/src/frameworks/$1",
		"^@shared/(.*)$": "<rootDir>/shared/$1",
		"^@test/(.*)$": "<rootDir>/test/$1",
	},
};
