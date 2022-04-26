import { Server } from "./app/server";
import { config } from "./config";

const app = new Server(config.express);

app.listen();
