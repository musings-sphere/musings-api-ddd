import { articleRepo } from "../../../articles/repos";
import { articleService } from "../../../articles/services";
import { authorRepo } from "../../../author/repo";
import { commentRepo, commentVotesRepo } from "../../repo";
import { UpVoteComment } from "./upVoteComment";
import { UpVoteCommentController } from "./upVoteCommentController";

const upVoteComment = new UpVoteComment(
	articleRepo,
	authorRepo,
	commentRepo,
	commentVotesRepo,
	articleService
);

const upVoteCommentController = new UpVoteCommentController(upVoteComment);

export { upVoteComment, upVoteCommentController };
