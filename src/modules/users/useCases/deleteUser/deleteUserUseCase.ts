import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { AppLogger } from "../../../../shared/logger";
import { IUserRepo } from "../../repos/userRepo";
import { DeleteUserDTO } from "./deleteUserDTO";
import { DeleteUserErrors } from "./deleteUserErrors";

type Response = Either<
	AppError.UnexpectedError | DeleteUserErrors.UserNotFoundError,
	Result<void>
>;

export class DeleteUserUseCase
	implements UseCase<DeleteUserDTO, Promise<Response>>
{
	private userRepo: IUserRepo;
	public logger = new AppLogger(DeleteUserUseCase.name);

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	public async execute(request: DeleteUserDTO): Promise<any> {
		try {
			const user = await this.userRepo.getUserByUserId(request.userId);
			const userFound = !!user === true;

			if (!userFound) {
				return left(new DeleteUserErrors.UserNotFoundError());
			}

			user.delete();

			await this.userRepo.save(user);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
