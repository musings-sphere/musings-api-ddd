import { ArticleId } from "../../articles/domain";
import { VoteType } from "../../articles/domain/vote";
import { AuthorId } from "../../author/domain";
import { CommentId, CommentVote, CommentVotes } from "../domain";

export interface ICommentVotesRepo {
	exists(
		commentId: CommentId,
		authorId: AuthorId,
		voteType: VoteType
	): Promise<boolean>;
	getVotesForCommentByMemberId(
		commentId: CommentId,
		authorId: AuthorId
	): Promise<CommentVote[]>;
	countUpVotesForCommentByCommentId(comment: CommentId): Promise<number>;
	countDownVotesForCommentByCommentId(comment: CommentId): Promise<number>;
	countAllArticleCommentUpVotes(articleId: ArticleId): Promise<number>;
	countAllArticleCommentDownVotes(articleId: ArticleId): Promise<number>;
	countAllArticleCommentUpVotesExcludingOP(
		articleId: ArticleId
	): Promise<number>;
	countAllArticleCommentDownVotesExcludingOP(
		articleId: ArticleId
	): Promise<number>;
	saveBulk(votes: CommentVotes): Promise<any>;
	save(vote: CommentVote): Promise<any>;
	delete(vote: CommentVote): Promise<any>;
}
