import { commentRepo, commentVotesRepo } from "../../repo";
import { UpdateCommentStats } from "./updateCommentStats";

const updateCommentStats = new UpdateCommentStats(
	commentRepo,
	commentVotesRepo
);

export { updateCommentStats };
