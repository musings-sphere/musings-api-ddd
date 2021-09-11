import { userRepo } from "../../repos";
import { authService } from "../../services";
import { LoginController } from "./loginController";
import { LoginUserUseCase } from "./loginUseCase";

const loginUseCase = new LoginUserUseCase(userRepo, authService);
const loginController = new LoginController(loginUseCase);

export { loginController, loginUseCase };
