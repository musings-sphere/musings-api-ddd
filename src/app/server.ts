// import { AppConfig } from "../../../shared/types/appConfig";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Application, default as express } from "express";
import helmet from "helmet";
import { config } from "../config";
import dbInit from "../database/init";
import { AppLogger } from "../shared/logger";
import routes from "./api/routes/v1";

type AppConfig = {
	port: number;
	mode: string;
};

const {
	api: { prefix },
} = config;

export class Server {
	private app: Application;
	private config: AppConfig;
	private logger = new AppLogger(Server.name);

	public constructor(config: AppConfig) {
		this.app = express();
		this.config = config;
	}

	public start(): Application {
		dbInit().then(() => this.logger.log("Database is healthy."));
		if (!this.app) {
			this.app = express();
		}

		this.configApp();

		this.app.listen(this.config.port, () => {
			this.logger.log(`
      ######################################################
      😎 App listening on port: ${this.config.port} in ${this.config.mode} mode. 😎
      ######################################################
    `);
		});

		return this.app;
	}

	private configApp(): void {
		const app = this.app;
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(cors());
		app.use(compression());
		app.use(helmet());
		app.use(prefix, routes());
	}
}
