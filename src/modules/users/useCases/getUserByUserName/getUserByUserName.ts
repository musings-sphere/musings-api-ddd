import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { User, UserName } from "../../domain";
import { IUserRepo } from "../../repos/userRepo";
import { GetUserByUserNameDTO } from "./getUserByUserNameDTO";
import { GetUserByUserNameErrors } from "./getUserByUserNameErrors";

type Response = Either<AppError.UnexpectedError, Result<User>>;

export class GetUserByUserName
	implements UseCase<GetUserByUserNameDTO, Promise<Response>>
{
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	public async execute(request: GetUserByUserNameDTO): Promise<Response> {
		try {
			const userNameOrError = UserName.create({ name: request.userName });

			if (userNameOrError.isFailure) {
				return left(
					Result.fail<any>(userNameOrError.error.toString())
				) as Response;
			}

			const userName: UserName = userNameOrError.getValue();

			const user = await this.userRepo.getUserByUserName(userName);
			const userFound = !!user === true;

			if (!userFound) {
				return left(
					new GetUserByUserNameErrors.UserNotFoundError(userName.value)
				) as Response;
			}

			return right(Result.ok<User>(user));
		} catch (err) {
			return left(new AppError.UnexpectedError(err));
		}
	}
}
