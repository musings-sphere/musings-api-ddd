import { Request, Response, Router } from "express";
import { PostDomain } from "../../../domain";
import { CodeHttp } from "../../../shared/frameworks";
import { app } from "../../iocRegister";
import { AddPostController } from "../controllers";

const postRoutes = Router();
const postDomain: PostDomain = app.postMain;
const addPostController = new AddPostController(postDomain.addPost);

export default (app: Router): void => {
	app.use("/post", postRoutes);

	postRoutes.get("/", (res: Response) => {
		return res.status(CodeHttp.OK).json({ message: "Blog get route" });
	});

	postRoutes.post("/", (req: Request, res: Response) =>
		addPostController.execute(req, res)
	);
};
