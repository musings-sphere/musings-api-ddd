export const defaultPort = 8080;
export const port = process.env.PORT ? +process.env.PORT : defaultPort;

interface Config {
	api: {
		prefix: string;
	};
	express: {
		mode: string;
		port: number;
	};
	mongodb: {
		url: string;
		name: string;
	};
}

export const config: Config = {
	api: {
		prefix: "/api",
	},
	express: {
		mode: process.env.NODE_ENV || "development",
		port: port,
	},
	mongodb: {
		url: process.env.DATABASE_URL,
		name: process.env.DATABASE_NAME,
	},
};
