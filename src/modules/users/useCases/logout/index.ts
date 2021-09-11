import { userRepo } from "../../repos";
import { authService } from "../../services";
import { LogoutController } from "./logoutController";
import { LogoutUseCase } from "./logoutUseCase";

const logoutUseCase = new LogoutUseCase(userRepo, authService);
const logoutController = new LogoutController(logoutUseCase);

export { logoutUseCase, logoutController };
