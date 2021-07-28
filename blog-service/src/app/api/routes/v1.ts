import { Router } from "express";
import swaggerRoutes from "./swaggerRoutes";
import blogRoutes from "./blogRoutes";

export default (): Router => {
	const app = Router();
	blogRoutes(app);
	swaggerRoutes(app);

	return app;
};
