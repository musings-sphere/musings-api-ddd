import { userRepo } from "../../repos";
import { GetUserByUserName } from "./getUserByUserName";
import { GetUserByUserNameController } from "./getUserByUserNameController";

const getUserByUserName = new GetUserByUserName(userRepo);

const getUserByUserNameController = new GetUserByUserNameController(
	getUserByUserName
);

export { getUserByUserName, getUserByUserNameController };
