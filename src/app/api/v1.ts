import { Router, Request, Response } from "express";
import { userRouter } from "../../modules/users/http/routes";

const v1Router = Router();

v1Router.get("/", (_req: Request, res: Response) => {
	return res.json({ message: "Yo! we're up" });
});

v1Router.use("/users", userRouter);

export { v1Router };
