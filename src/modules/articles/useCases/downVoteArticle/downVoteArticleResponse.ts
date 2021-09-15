import { AppError, Either, Result } from "../../../../shared/core";
import { DownVoteArticleErrors } from "./downVoteArticleErrors";

export type DownVoteArticleResponse = Either<
	| DownVoteArticleErrors.AuthorNotFoundError
	| DownVoteArticleErrors.AlreadyDownVotedError
	| DownVoteArticleErrors.ArticleNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
