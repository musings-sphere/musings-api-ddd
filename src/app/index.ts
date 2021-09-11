import { authService } from "../modules/users/services";
import { Middleware } from "./middlewares";

const middleware = new Middleware(authService);

export { middleware };
