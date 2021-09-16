import { Comment, CommentVote } from "../../../database/models";
import {
	SequelizeCommentRepo,
	SequelizeCommentVotesRepo,
} from "./implementations";

const commentVotesRepo = new SequelizeCommentVotesRepo(CommentVote);
const commentRepo = new SequelizeCommentRepo(Comment, commentVotesRepo);

export { commentRepo, commentVotesRepo };
