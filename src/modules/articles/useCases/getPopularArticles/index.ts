import { articleRepo } from "../../repos";
import { GetPopularArticles } from "./getPopularArticles";
import { GetPopularArticlesController } from "./getPopularArticlesController";

const getPopularArticles = new GetPopularArticles(articleRepo);

const getPopularArticlesController = new GetPopularArticlesController(
	getPopularArticles
);

export { getPopularArticles, getPopularArticlesController };
