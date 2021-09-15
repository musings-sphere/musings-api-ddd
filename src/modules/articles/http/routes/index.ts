import { Router, Response, Request } from "express";
import { middleware } from "../../../../app";
import { createArticleController } from "../../useCases/createArticle";
import { downVoteArticleController } from "../../useCases/downVoteArticle";
import { getArticleBySlugController } from "../../useCases/getArticleBySlug";
import { getPopularArticlesController } from "../../useCases/getPopularArticles";
import { getRecentArticlesController } from "../../useCases/getRecentArticles";
import { upVoteArticleController } from "../../useCases/upVoteArticle";

const articleRouter = Router();

articleRouter.post(
	"/",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => createArticleController.execute(req, res)
);

articleRouter.get(
	"/recent",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) =>
		getRecentArticlesController.execute(req, res)
);

articleRouter.get(
	"/popular",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) =>
		getPopularArticlesController.execute(req, res)
);

articleRouter.get(
	"/",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) => getArticleBySlugController.execute(req, res)
);

articleRouter.post(
	"/upvote",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => upVoteArticleController.execute(req, res)
);

articleRouter.post(
	"/downvote",
	middleware.ensureAuthenticated(),
	(req: Request, res) => downVoteArticleController.execute(req, res)
);

export { articleRouter };
