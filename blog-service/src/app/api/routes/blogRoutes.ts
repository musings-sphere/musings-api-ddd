import { Request, Response, Router } from "express";

const blogRoutes = Router();

export default (app: Router): void => {
	app.use("/blog", blogRoutes);

	blogRoutes.get("/", (req: Request, res: Response) => {
		return res.status(200).json({ message: "Blog get route" });
	});
};
