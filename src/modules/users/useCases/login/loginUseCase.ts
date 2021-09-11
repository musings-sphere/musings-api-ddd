import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { AppLogger } from "../../../../shared/logger";
import { User, UserName, UserPassword } from "../../domain";
import { JWTToken, RefreshToken } from "../../domain/jwt";
import { IUserRepo } from "../../repos/userRepo";
import { IAuthService } from "../../services/authService";
import { LoginDTO, LoginDTOResponse } from "./loginDTO";
import { LoginUseCaseErrors } from "./loginErrors";

type Response = Either<
	| LoginUseCaseErrors.PasswordDoesntMatchError
	| LoginUseCaseErrors.UserNameDoesntExistError
	| AppError.UnexpectedError,
	Result<LoginDTOResponse>
>;

export class LoginUserUseCase implements UseCase<LoginDTO, Promise<Response>> {
	private userRepo: IUserRepo;
	private authService: IAuthService;
	public logger = new AppLogger(LoginUserUseCase.name);

	constructor(userRepo: IUserRepo, authService: IAuthService) {
		this.userRepo = userRepo;
		this.authService = authService;
	}

	public async execute(request: LoginDTO): Promise<Response> {
		let user: User;
		let userName: UserName;
		let password: UserPassword;

		try {
			const userNameOrError = UserName.create({ userName: request.userName });
			const passwordOrError = UserPassword.create({ value: request.password });
			const payloadResult = Result.combine([userNameOrError, passwordOrError]);

			if (payloadResult.isFailure) {
				return left(Result.fail<any>(payloadResult.error));
			}

			userName = userNameOrError.getValue();
			password = passwordOrError.getValue();

			try {
				user = await this.userRepo.getUserByUserName(userName);
			} catch (e) {
				return left(new LoginUseCaseErrors.UserNameDoesntExistError());
			}

			const userFound = !!user;

			if (!userFound) {
				return left(new LoginUseCaseErrors.UserNameDoesntExistError());
			}

			const passwordValid = await user.password.comparePassword(
				password.value
			);

			if (!passwordValid) {
				return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
			}

			if (!user.isEmailVerified) {
				return left(new LoginUseCaseErrors.UserIsNotVerified());
			}

			const accessToken: JWTToken = this.authService.signJWT({
				userName: user.userName.value,
				email: user.email.value,
				isEmailVerified: user.isEmailVerified,
				userId: user.userId.id.toString(),
				adminUser: user.isAdmin,
			});

			const refreshToken: RefreshToken = this.authService.createRefreshToken();

			user.setAccessToken(accessToken, refreshToken);

			await this.authService.saveAuthenticatedUser(user);

			return right(
				Result.ok<LoginDTOResponse>({
					accessToken,
					refreshToken,
				})
			);
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
