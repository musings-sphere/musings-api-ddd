import { AppError, Either, Result } from "../../../../shared/core";
import { UpVoteArticleErrors } from "./upVoteArticleErrors";

export type UpVoteArticleResponse = Either<
	| UpVoteArticleErrors.AuthorNotFoundError
	| UpVoteArticleErrors.AlreadyUpVotedError
	| UpVoteArticleErrors.ArticleNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
