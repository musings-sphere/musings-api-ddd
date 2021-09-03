import { config } from "../config";
import { Article } from "./models";

const { isDev } = config;

const dbInit = async (): Promise<void> => {
	await Article.sync({ alter: isDev });
};

export default dbInit;
