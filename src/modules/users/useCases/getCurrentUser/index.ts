import { getUserByUserName } from "../getUserByUserName";
import { GetCurrentUserController } from "./getCurrentUserController";

const getCurrentUserController = new GetCurrentUserController(
	getUserByUserName
);

export { getCurrentUserController };
