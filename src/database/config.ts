import { Sequelize } from "sequelize";
import { config } from "../config";

const {
	database: { name, username, password, dialect, host },
} = config;

const sequelizeConnection = new Sequelize(name, username, password, {
	host,
	dialect,
	port: 5432,
	logging: true,
});

export default sequelizeConnection;
