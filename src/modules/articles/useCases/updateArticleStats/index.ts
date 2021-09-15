import { commentVotesRepo } from "../../../comments/repo";
import { articleRepo, articlesVotesRepo } from "../../repos";
import { UpdateArticleStats } from "./updateArticleStats";

const updatePostStats = new UpdateArticleStats(
	articleRepo,
	articlesVotesRepo,
	commentVotesRepo
);

export { updatePostStats };
