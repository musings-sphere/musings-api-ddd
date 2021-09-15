import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { ArticleId } from "../../articles/domain";
import { AuthorId } from "../../author/domain";
import { Comment, CommentId, CommentText } from "../domain";

export class CommentMap implements Mapper<Comment> {
	public static toPersistence(comment: Comment): any {
		return {
			article_id: comment.articleId.id.toString(),
			comment_id: comment.commentId.id.toString(),
			author_id: comment.authorId.id.toString(),
			parent_comment_id: comment.parentCommentId
				? comment.parentCommentId.id.toString()
				: null,
			text: comment.text.value,
			points: comment.points,
		};
	}

	public static toDomain(raw: any): Comment {
		const commentOrError = Comment.create(
			{
				articleId: ArticleId.create(
					new UniqueEntityID(raw.post_id)
				).getValue(),
				authorId: AuthorId.create(
					new UniqueEntityID(raw.member_id)
				).getValue(),
				parentCommentId: raw.parent_comment_id
					? CommentId.create(
							new UniqueEntityID(raw.parent_comment_id)
					  ).getValue()
					: null,
				text: CommentText.create({ value: raw.text }).getValue(),
			},
			new UniqueEntityID(raw.comment_id)
		);

		commentOrError.isFailure ? console.log(commentOrError.error) : "";

		return commentOrError.isSuccess ? commentOrError.getValue() : null;
	}
}
