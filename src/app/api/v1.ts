import { Router, Request, Response } from "express";
import { articleRouter } from "../../modules/articles/http/routes";
import { authorRouter } from "../../modules/author/http/routes";
import { commentRouter } from "../../modules/comments/http/routes";
import { userRouter } from "../../modules/users/http/routes";

const v1Router = Router();

v1Router.get("/", (_req: Request, res: Response) => {
	return res.json({ message: "Yo! we're up" });
});

v1Router.use("/users", userRouter);
v1Router.use("/authors", authorRouter);
v1Router.use("/articles", articleRouter);
v1Router.use("/comments", commentRouter);

export { v1Router };
