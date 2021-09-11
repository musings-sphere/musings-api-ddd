import { AppError, Either, Result } from "../../../../shared/core";
import { CreateUserErrors } from "./createUserErrors";

export type CreateUserResponse = Either<
	| CreateUserErrors.EmailAlreadyExistsError
	| CreateUserErrors.UsernameTakenError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;
