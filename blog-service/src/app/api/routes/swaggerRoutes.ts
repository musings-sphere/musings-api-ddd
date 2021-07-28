import { Router } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "../../docs";

export default (app: Router): void => {
	app.use("/docs", serve, setup(swaggerConfig));
};
