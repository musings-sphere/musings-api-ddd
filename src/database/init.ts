import { config } from "../config";
import { Article, BaseUser } from "./models";

const { isDev } = config;

const dbInit = async (): Promise<void> => {
	await Article.sync({ alter: isDev });
	await BaseUser.sync({ alter: isDev });
};

export default dbInit;
