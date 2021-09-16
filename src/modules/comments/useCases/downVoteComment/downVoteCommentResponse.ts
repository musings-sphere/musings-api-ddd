import { AppError, Either, Result } from "../../../../shared/core";
import { DownvoteCommentErrors } from "./downVoteCommentErrors";

export type DownVoteCommentResponse = Either<
	| DownvoteCommentErrors.CommentNotFoundError
	| DownvoteCommentErrors.AuthorNotFoundError
	| DownvoteCommentErrors.ArticleNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
