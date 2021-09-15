import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { AuthorId } from "../../author/domain";
import { ArticleId, ArticleVote } from "../domain";
import { VoteType } from "../domain/vote";

export class ArticleVoteMap implements Mapper<ArticleVote> {
	public static toDomain(raw: any): ArticleVote {
		const voteType: VoteType = raw.type;

		const postVoteOrError = ArticleVote.create(
			{
				authorId: AuthorId.create(new UniqueEntityID(raw.id)).getValue(),
				articleId: ArticleId.create(new UniqueEntityID(raw.id)).getValue(),
				type: voteType,
			},
			new UniqueEntityID(raw.id)
		);

		postVoteOrError.isFailure ? console.error(postVoteOrError.error) : "";

		return postVoteOrError.isSuccess ? postVoteOrError.getValue() : null;
	}

	public static toPersistence(vote: ArticleVote): any {
		return {
			id: vote.id.toString(),
			article_id: vote.articleId.id.toString(),
			author_id: vote.authorId.id.toString(),
			type: vote.type,
		};
	}
}
