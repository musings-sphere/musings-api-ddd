import { articleRepo } from "../../repos";
import { GetRecentArticles } from "./getRecentArticles";
import { GetRecentArticlesController } from "./getRecentArticlesController";

const getRecentArticles = new GetRecentArticles(articleRepo);
const getRecentArticlesController = new GetRecentArticlesController(
	getRecentArticles
);

export { getRecentArticles, getRecentArticlesController };
