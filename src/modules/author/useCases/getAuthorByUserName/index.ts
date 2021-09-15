import { authorRepo } from "../../repo";
import { GetAuthorByUserName } from "./getAuthorByUserName";
import { GetAuthorByUserNameController } from "./getAuthorByUserNameController";

const getAuthorByUserName = new GetAuthorByUserName(authorRepo);

const getAuthorByUserNameController = new GetAuthorByUserNameController(
	getAuthorByUserName
);

export { getAuthorByUserName, getAuthorByUserNameController };
