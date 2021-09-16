import { getAuthorByUserName } from "../getAuthorByUserName";
import { GetCurrentAuthorController } from "./getCurrentAuthorController";

const getCurrentAuthorController = new GetCurrentAuthorController(
	getAuthorByUserName
);

export { getCurrentAuthorController };
