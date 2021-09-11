import redis, { RedisClient } from "redis";
import { config } from "../../../../config";
import { AppLogger } from "../../../../shared/logger";

const {
	isDev,
	auth: { redisServerUrl, redisServerPort, redisConnectionString },
} = config;

const logger = new AppLogger("Redis");

const redisConnection: RedisClient = isDev
	? redis.createClient(redisServerPort, redisServerUrl) // creates a new client
	: redis.createClient(redisConnectionString);

redisConnection.on("connect", () => {
	logger.log(
		`[Redis]: Connected to redis server at ${redisServerUrl}:${redisServerPort}`
	);
});

export { redisConnection };
