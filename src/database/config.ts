import { Dialect, Sequelize } from "sequelize";
import { config } from "../config";
import { AppLogger } from "../shared/logger";

const logger = new AppLogger("Database");

const {
	database: { name, username, password, dialect, host },
} = config;

const sequelize = new Sequelize(name, username, password, {
	host,
	dialect: dialect as Dialect,
	port: 5432,
	logQueryParameters: config.isDev,
	logging: (query, time) => {
		logger.log(time + "ms" + " " + query);
	},
	benchmark: true,
});

sequelize.authenticate().catch((e) => logger.error(e));

export default sequelize;
