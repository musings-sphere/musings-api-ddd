import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { User } from "../../domain";
import { JWTToken } from "../../domain/jwt";
import { IUserRepo } from "../../repos/userRepo";
import { IAuthService } from "../../services/authService";
import { RefreshAccessTokenDTO } from "./refreshAccessTokenDTO";
import { RefreshAccessTokenErrors } from "./refreshAccessTokenErrors";

type Response = Either<
	RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
	Result<JWTToken>
>;

export class RefreshAccessTokenUseCase
	implements UseCase<RefreshAccessTokenDTO, Promise<Response>>
{
	private userRepo: IUserRepo;
	private authService: IAuthService;

	constructor(userRepo: IUserRepo, authService: IAuthService) {
		this.userRepo = userRepo;
		this.authService = authService;
	}

	public async execute(req: RefreshAccessTokenDTO): Promise<Response> {
		const { refreshToken } = req;
		let user: User;
		let username: string;

		try {
			// Get the username for the user that owns the refresh token
			try {
				username = await this.authService.getUserNameFromRefreshToken(
					refreshToken
				);
			} catch (err) {
				return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
			}

			try {
				// get the user by username
				user = await this.userRepo.getUserByUserName(username);
			} catch (err) {
				return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
			}

			const accessToken: JWTToken = this.authService.signJWT({
				userName: user.userName.value,
				email: user.email.value,
				isEmailVerified: user.isEmailVerified,
				userId: user.userId.id.toString(),
				adminUser: user.isAdmin,
			});

			// sign a new jwt for that user
			user.setAccessToken(accessToken, refreshToken);

			// save it
			await this.authService.saveAuthenticatedUser(user);

			// return the new access token
			return right(Result.ok<JWTToken>(accessToken));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
