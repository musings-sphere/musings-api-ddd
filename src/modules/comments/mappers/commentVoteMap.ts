import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { VoteType } from "../../articles/domain/vote";
import { AuthorId } from "../../author/domain";
import { CommentId, CommentVote } from "../domain";

export class CommentVoteMap implements Mapper<CommentVote> {
	public static toDomain(raw: any): CommentVote {
		const voteType: VoteType = raw.type;

		const commentVoteOrError = CommentVote.create(
			{
				authorId: AuthorId.create(
					new UniqueEntityID(raw.member_id)
				).getValue(),
				commentId: CommentId.create(
					new UniqueEntityID(raw.comment_id)
				).getValue(),
				type: voteType,
			},
			new UniqueEntityID(raw.comment_vote_id)
		);

		commentVoteOrError.isFailure
			? console.error(commentVoteOrError.error)
			: "";

		return commentVoteOrError.isSuccess ? commentVoteOrError.getValue() : null;
	}

	public static toPersistence(vote: CommentVote): any {
		return {
			comment_vote_id: vote.id.toString(),
			comment_id: vote.commentId.id.toString(),
			author_id: vote.authorId.id.toString(),
			type: vote.type,
		};
	}
}
