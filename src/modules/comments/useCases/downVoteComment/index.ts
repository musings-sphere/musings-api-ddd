import { articleRepo } from "../../../articles/repos";
import { articleService } from "../../../articles/services";
import { authorRepo } from "../../../author/repo";
import { commentRepo, commentVotesRepo } from "../../repo";
import { DownVoteComment } from "./downVoteComment";
import { DownVoteCommentController } from "./downVoteCommentController";

const downVoteComment = new DownVoteComment(
	articleRepo,
	authorRepo,
	commentRepo,
	commentVotesRepo,
	articleService
);

const downVoteCommentController = new DownVoteCommentController(
	downVoteComment
);

export { downVoteComment, downVoteCommentController };
