import { articleRepo } from "../../repos";
import { GetArticleBySlug } from "./getArticleBySlug";
import { GetArticleBySlugController } from "./getArticleBySlugController";

const getArticleBySlug = new GetArticleBySlug(articleRepo);
const getArticleBySlugController = new GetArticleBySlugController(
	getArticleBySlug
);

export { getArticleBySlug, getArticleBySlugController };
