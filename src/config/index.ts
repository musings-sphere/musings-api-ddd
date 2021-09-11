import dotenv from "dotenv";
import { Dialect } from "sequelize";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error && process.env.NODE_ENV === "production")
	throw new Error("⚠️  Couldn't find .env file  ⚠️");

export const defaultPort = 8080;
export const port = process.env.PORT ? +process.env.PORT : defaultPort;

const dbName = (mode: string): string => {
	let db: string;
	switch (mode) {
		case "test":
			db = process.env.MUSINGS_DB_TEST_DB_NAME as string;
			break;
		case "production":
			db = process.env.MUSINGS_DB_PROD_DB_NAME as string;
			break;
		default:
			db = process.env.MUSINGS_DB_DEV_DB_NAME as string;
	}

	return db;
};

interface Config {
	isDev: boolean;
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
	logs: {
		level: string;
	};
	database: {
		username: string;
		password: string;
		name: string;
		host: string;
		dialect: Dialect;
	};
	auth: {
		secret: string;
		tokenExpiryTime: number;
		redisServerPort: number;
		redisServerUrl: string;
		redisConnectionString: string;
	};
	moderator: {
		key: string;
		url: string;
	};
	spamUrl: string;
}

export const config: Config = {
	isDev: process.env.NODE_ENV === "development",
	api: {
		prefix: "/api/v1",
	},
	express: {
		mode: process.env.NODE_ENV ?? "development",
		port: port,
	},
	mongodb: {
		url: process.env.DATABASE_URL as string,
		name: process.env.DATABASE_NAME as string,
	},
	logs: {
		level: process.env.LOG_LEVEL || "silly",
	},
	database: {
		username: process.env.MUSINGS_DB_USER,
		password: process.env.MUSINGS_DB_PASS,
		name: dbName(process.env.NODE_ENV as string),
		host: process.env.MUSINGS_DB_HOST,
		dialect: "postgres",
	},
	moderator: {
		key: process.env.MODERATOR_API_KEY as string,
		url: process.env.MODERATOR_API_URL as string,
	},
	spamUrl: process.env.SPAM_API_URL as string,
	auth: {
		secret: process.env.MUSINGS_APP_SECRET,
		tokenExpiryTime: 300,
		redisConnectionString: process.env.REDIS_URL,
		redisServerPort: +process.env.MUSINGS_REDIS_PORT || 6379,
		redisServerUrl: process.env.MUSINGS_REDIS_URL,
	},
};
