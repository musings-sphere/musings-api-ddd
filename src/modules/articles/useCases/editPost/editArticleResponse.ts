import { AppError, Either, Result } from "../../../../shared/core";
import { EditArticleErrors } from "./editArticleErrors";

export type EditArticleResponse = Either<
	| EditArticleErrors.ArticleNotFoundError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
