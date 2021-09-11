import {
	AppError,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { User, UserEmail, UserName, UserPassword } from "../../domain";
import { IUserRepo } from "../../repos/userRepo";
import { CreateUserDTO } from "./createUserDTO";
import { CreateUserErrors } from "./createUserErrors";
import { CreateUserResponse } from "./createUserResponse";

export class CreateUserUseCase
	implements UseCase<CreateUserDTO, Promise<CreateUserResponse>>
{
	private userRepo: IUserRepo;

	constructor(userRepo: IUserRepo) {
		this.userRepo = userRepo;
	}

	async execute(request: CreateUserDTO): Promise<CreateUserResponse> {
		const emailOrError = UserEmail.create(request.email);
		const passwordOrError = UserPassword.create({ value: request.password });
		const userNameOrError = UserName.create({ userName: request.userName });

		const dtoResult = Result.combine([
			emailOrError,
			passwordOrError,
			userNameOrError,
		]);

		if (dtoResult.isFailure) {
			return left(Result.fail<void>(dtoResult.error)) as CreateUserResponse;
		}

		const email: UserEmail = emailOrError.getValue();
		const password: UserPassword = passwordOrError.getValue();
		const userName: UserName = userNameOrError.getValue();

		try {
			const userAlreadyExists = await this.userRepo.exists(email);

			if (userAlreadyExists) {
				return left(
					new CreateUserErrors.EmailAlreadyExistsError(email.value)
				) as CreateUserResponse;
			}

			try {
				const alreadyCreatedUserByUserName =
					await this.userRepo.getUserByUserName(userName);

				const userNameTaken = !!alreadyCreatedUserByUserName === true;

				if (userNameTaken) {
					return left(
						new CreateUserErrors.UsernameTakenError(userName.value)
					) as CreateUserResponse;
				}
			} catch (err) {}

			const userOrError: Result<User> = User.create({
				email,
				password,
				userName,
			});

			if (userOrError.isFailure) {
				return left(
					Result.fail<User>(userOrError.error.toString())
				) as CreateUserResponse;
			}

			const user: User = userOrError.getValue();

			await this.userRepo.save(user);

			return right(Result.ok<void>());
		} catch (err) {
			return left(
				new AppError.UnexpectedError(err as Error)
			) as CreateUserResponse;
		}
	}
}
