import { AuthorId } from "../../author/domain";
import { ArticleId, ArticleVote, ArticleVotes } from "../domain";
import { VoteType } from "../domain/vote";

export interface IArticleVotesRepo {
	exists(
		articleId: ArticleId,
		authorId: AuthorId,
		voteType: VoteType
	): Promise<boolean>;
	getVotesForArticleByAuthorId(
		articleId: ArticleId,
		authorId: AuthorId
	): Promise<ArticleVote[]>;
	countArticleUpVotesByArticleId(articleId: ArticleId): Promise<number>;
	countArticleDownVotesByArticleId(articleId: ArticleId): Promise<number>;
	saveBulk(votes: ArticleVotes): Promise<any>;
	save(votes: ArticleVote): Promise<any>;
	delete(vote: ArticleVote): Promise<any>;
}
