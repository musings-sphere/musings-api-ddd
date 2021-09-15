import { Router, Response, Request } from "express";
import { getAuthorByUserNameController } from "../../useCases/getAuthorByUserName";
import { getCurrentAuthorController } from "../../useCases/getCurrentAuthor";

const authorRouter = Router();

authorRouter.get("/me", (req: Request, res: Response) =>
	getCurrentAuthorController.execute(req, res)
);

authorRouter.get("/:userName", (req: Request, res: Response) =>
	getAuthorByUserNameController.execute(req, res)
);

export { authorRouter };
