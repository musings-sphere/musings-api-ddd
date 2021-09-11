import { Router, Response, Request } from "express";
import { middleware } from "../../../../app";
import { createUserController } from "../../useCases/createUser";
import { deleteUserController } from "../../useCases/deleteUser";
import { getCurrentUserController } from "../../useCases/getCurrentUser";
import { getUserByUserNameController } from "../../useCases/getUserByUserName";
import { loginController } from "../../useCases/login";
import { logoutController } from "../../useCases/logout";
import { refreshAccessTokenController } from "../../useCases/refreshAccessToken";

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) =>
	createUserController.execute(req, res)
);

userRouter.post("/login", (req: Request, res: Response) =>
	loginController.execute(req, res)
);

userRouter.get(
	"/me",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => getCurrentUserController.execute(req, res)
);

userRouter.post(
	"/logout",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => logoutController.execute(req, res)
);

userRouter.post("/token/refresh", (req: Request, res: Response) =>
	refreshAccessTokenController.execute(req, res)
);

userRouter.get(
	"/:username",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) =>
		getUserByUserNameController.execute(req, res)
);

userRouter.delete(
	"/:userId",
	middleware.ensureAuthenticated(),
	(req: Request, res: Response) => deleteUserController.execute(req, res)
);

export { userRouter };
