import { articleRepo } from "../../../articles/repos";
import { articleService } from "../../../articles/services";
import { authorRepo } from "../../../author/repo";
import { commentRepo } from "../../repo";
import { ReplyToComment } from "./replyToComment";
import { ReplyToCommentController } from "./replyToCommentController";

const replyToComment = new ReplyToComment(
	authorRepo,
	articleRepo,
	commentRepo,
	articleService
);

const replyToCommentController = new ReplyToCommentController(replyToComment);

export { replyToComment, replyToCommentController };
