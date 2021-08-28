import { Router } from "express";
import postRoutes from "./postRoutes";
import swaggerRoutes from "./swaggerRoutes";

export default (): Router => {
	const app = Router();
	postRoutes(app);
	swaggerRoutes(app);

	return app;
};
