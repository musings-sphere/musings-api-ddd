import { Router, Response, Request } from "express";
import { middleware } from "../../../../app";
import { downVoteCommentController } from "../../useCases/downVoteComment";
import { getCommentByCommentIdController } from "../../useCases/getCommentByCommentId";
import { getCommentsByArticleSlugController } from "../../useCases/getCommentsByArticleSlug";
import { replyToCommentController } from "../../useCases/replyToComment";
import { replyToArticleController } from "../../useCases/replyToPost";
import { upVoteCommentController } from "../../useCases/upVoteComment";

const commentRouter = Router();

commentRouter.get(
	"/",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) =>
		getCommentsByArticleSlugController.execute(req, res)
);

commentRouter.post(
	"/",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => replyToArticleController.execute(req, res)
);

commentRouter.post(
	"/:commentId/reply",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => replyToCommentController.execute(req, res)
);

commentRouter.get(
	"/:commentId",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) =>
		getCommentByCommentIdController.execute(req, res)
);

commentRouter.post(
	"/:commentId/upVote",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) => upVoteCommentController.execute(req, res)
);

commentRouter.post(
	"/:commentId/downVote",
	middleware.includeDecodedTokenIfExists(),
	(req: Request, res: Response) => downVoteCommentController.execute(req, res)
);

export { commentRouter };
