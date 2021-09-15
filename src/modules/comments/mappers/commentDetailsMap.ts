import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { ArticleSlug, ArticleTitle } from "../../articles/domain";
import { AuthorDetailsMap } from "../../author/mappers";
import {
	CommentDetails,
	CommentId,
	CommentText,
	CommentVote,
} from "../domain";
import { CommentDTO } from "../dtos";
import { CommentVoteMap } from "./commentVoteMap";

export class CommentDetailsMap implements Mapper<CommentDetails> {
	public static toDomain(raw: any): CommentDetails {
		const votes: CommentVote[] = raw.CommentVotes
			? raw.CommentVotes.map((v) => CommentVoteMap.toDomain(v))
			: [];

		const commentDetailsOrError = CommentDetails.create({
			articleTitle: ArticleTitle.create({
				value: raw.Article.title,
			}).getValue(),
			commentId: CommentId.create(
				new UniqueEntityID(raw.comment_id)
			).getValue(),
			text: CommentText.create({ value: raw.text }).getValue(),
			author: AuthorDetailsMap.toDomain(raw.Member),
			createdAt: raw.createdAt,
			articleSlug: ArticleSlug.createFromExisting(raw.Article.slug).getValue(),
			parentCommentId: raw.parent_comment_id
				? CommentId.create(
						new UniqueEntityID(raw.parent_comment_id)
				  ).getValue()
				: null,
			points: raw.points,
			wasUpVotedByMe: !!votes.find((v) => v.isUpVote()),
			wasDownVotedByMe: !!votes.find((v) => v.isDownVote()),
		});

		commentDetailsOrError.isFailure
			? console.error(commentDetailsOrError.error)
			: "";

		return commentDetailsOrError.isSuccess
			? commentDetailsOrError.getValue()
			: null;
	}

	public static toDTO(commentDetails: CommentDetails): CommentDTO {
		return {
			postSlug: commentDetails.articleSlug.value,
			commentId: commentDetails.commentId.id.toString(),
			parentCommentId: commentDetails.parentCommentId
				? commentDetails.parentCommentId.id.toString()
				: null,
			text: commentDetails.text.value,
			author: AuthorDetailsMap.toDTO(commentDetails.author),
			createdAt: commentDetails.createdAt,
			childComments: [],
			articleTitle: commentDetails.articleTitle.value,
			points: commentDetails.points,
			wasUpVotedByMe: commentDetails.wasUpVotedByMe,
			wasDownVotedByMe: commentDetails.wasDownVotedByMe,
		};
	}
}
