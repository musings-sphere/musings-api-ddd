import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { User } from "../../../users/domain";
import { IUserRepo } from "../../../users/repos/userRepo";
import { Author } from "../../domain";
import { IAuthorRepo } from "../../repo/authorRepo";
import { CreateAuthorDTO } from "./createAuthorDTO";
import { CreateAuthorErrors } from "./createAuthorErrors";

type Response = Either<
	| CreateAuthorErrors.AuthorAlreadyExistsError
	| CreateAuthorErrors.UserDoesntExistError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;

export class CreateAuthor
	implements UseCase<CreateAuthorDTO, Promise<Response>>
{
	private authorRepo: IAuthorRepo;
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo, authorRepo: IAuthorRepo) {
		this.userRepo = userRepo;
		this.authorRepo = authorRepo;
	}

	public async execute(request: CreateAuthorDTO): Promise<Response> {
		let user: User;
		let author: Author;
		const { userId } = request;

		try {
			try {
				user = await this.userRepo.getUserByUserId(userId);
			} catch (err) {
				return left(new CreateAuthorErrors.UserDoesntExistError(userId));
			}

			try {
				author = await this.authorRepo.getAuthorByUserId(userId);
				const authorExists = !!author === true;

				if (authorExists) {
					return left(new CreateAuthorErrors.AuthorAlreadyExistsError(userId));
				}
			} catch (err) {}

			// Member doesn't exist already (good), so we want to create it
			const authorOrError: Result<Author> = Author.create({
				userId: user.userId,
				userName: user.userName,
			});

			if (authorOrError.isFailure) {
				return left(authorOrError);
			}

			author = authorOrError.getValue();

			await this.authorRepo.save(author);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
