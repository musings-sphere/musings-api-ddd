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
	moderator: {
		key: string;
		url: string;
	};
	spamUrl: string;
}

export const config: Config = {
	api: {
		prefix: "/api",
	},
	express: {
		mode: process.env.NODE_ENV ?? "development",
		port: port,
	},
	mongodb: {
		url: process.env.DATABASE_URL as string,
		name: process.env.DATABASE_NAME as string,
	},
	moderator: {
		key: process.env.MODERATOR_API_KEY as string,
		url: process.env.MODERATOR_API_URL as string,
	},
	spamUrl: process.env.SPAM_API_URL as string,
};