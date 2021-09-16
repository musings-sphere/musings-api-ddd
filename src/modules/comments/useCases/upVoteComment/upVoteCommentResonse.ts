import { AppError, Either, Result } from "../../../../shared/core";
import { UpVoteArticleErrors } from "../../../articles/useCases/upVoteArticle/upVoteArticleErrors";
import { UpvoteCommentErrors } from "./upVoteCommentErrors";

export type UpVoteCommentResponse = Either<
	| UpVoteArticleErrors.ArticleNotFoundError
	| UpvoteCommentErrors.CommentNotFoundError
	| UpvoteCommentErrors.AuthorNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
