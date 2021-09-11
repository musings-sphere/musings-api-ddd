import { userRepo } from "../../repos";
import { authService } from "../../services";
import { RefreshAccessTokenController } from "./refreshAccessTokenController";
import { RefreshAccessTokenUseCase } from "./refreshAccessTokenUseCase";

const refreshAccessToken = new RefreshAccessTokenUseCase(
	userRepo,
	authService
);

const refreshAccessTokenController = new RefreshAccessTokenController(
	refreshAccessToken
);

export { refreshAccessToken, refreshAccessTokenController };
