// import { AppConfig } from "../../../shared/types/appConfig";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import { Application, default as express } from "express";
import helmet from "helmet";
import { config } from "../config";
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

	public constructor(config: AppConfig) {
		this.app = express();
		this.config = config;
	}

	public start(): Application {
		if (!this.app) {
			this.app = express();
		}

		this.configApp();

		this.app.listen(this.config.port, () => {
			console.log(
				`App listening on port: ${this.config.port} in ${this.config.mode} mode.`
			);
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
