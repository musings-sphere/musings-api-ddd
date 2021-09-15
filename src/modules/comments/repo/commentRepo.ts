import { AuthorId } from "../../author/domain";
import { CommentDetails, CommentId, Comment } from "../domain";

export interface ICommentRepo {
	exists(commentId: string): Promise<boolean>;
	getCommentDetailsByArticleSlug(
		slug: string,
		authorId?: AuthorId,
		offset?: number
	): Promise<CommentDetails[]>;
	getCommentDetailsByCommentId(
		commentId: string,
		authorId?: AuthorId
	): Promise<CommentDetails>;
	getCommentByCommentId(commentId: string): Promise<Comment>;
	save(comment: Comment): Promise<void>;
	saveBulk(comments: Comment[]): Promise<void>;
	deleteComment(commentId: CommentId): Promise<void>;
}
