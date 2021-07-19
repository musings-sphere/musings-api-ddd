interface Config {
	nodeEnv: string;
	port: number;
	apiRoot: string;
	mongodb: {
		url: string;
		name: string;
	};
}

export const config: Config = {
	nodeEnv: process.env.NODE_ENV || "development",
	port: 3000,
	apiRoot: process.env.API_ROOT,
	mongodb: {
		url: process.env.DATABASE_URL,
		name: process.env.DATABASE_NAME,
	},
};
