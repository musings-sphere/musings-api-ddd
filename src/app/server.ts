import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Application, default as express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "../config";
import dbInit from "../database/init";
import { AppLogger } from "../shared/logger";
import { v1Router } from "./api/v1";

type AppConfig = {
	port: number;
	mode: string;
};

const {
	logs,
	cors: { origin, credentials },
	api: { prefix },
} = config;

export class Server {
	private app: Application;
	private config: AppConfig;
	private logger = new AppLogger(Server.name);

	public constructor(config: AppConfig) {
		this.app = express();
		this.config = config;

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeRoutes();
	}

	private connectToDatabase() {
		dbInit().then(() => this.logger.log("Database is healthy."));
	}

	public initializeRoutes() {
		this.app.use(prefix, v1Router);
	}

	public listen(): Application {
		if (!this.app) {
			this.app = express();
		}

		this.app.listen(this.config.port, () => {
			this.logger.log(`
      ======================================================
      😎 App listening on port: ${this.config.port} in ${this.config.mode} mode. 😎
      ======================================================
    `);
		});

		return this.app;
	}

	private initializeMiddlewares(): void {
		const app = this.app;
		const stream = this.logger.stream;
		// @ts-expect-error
		// app.use(morgan(logs.format, { stream }));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(cookieParser());
		app.use(cors({ origin, credentials }));
		app.use(compression());
		app.use(helmet());
	}
}
