const postgres = require("pg").Pool;
require("dotenv").config();

const {
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_DEV_DB_NAME,
	DB_TEST_DB_NAME,
	NODE_ENV,
} = process.env;

const dbName = NODE_ENV === "development" ? DB_DEV_DB_NAME : DB_TEST_DB_NAME;
const connection = postgres.Connection({
	host: DB_HOST,
});
