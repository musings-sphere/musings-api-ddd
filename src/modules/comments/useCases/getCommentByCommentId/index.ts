import { authorRepo } from "../../../author/repo";
import { commentRepo } from "../../repo";
import { GetCommentByCommentId } from "./getCommentByCommentId";
import { GetCommentByCommentIdController } from "./getCommentByCommentIdController";

const getCommentByCommentId = new GetCommentByCommentId(
	commentRepo,
	authorRepo
);

const getCommentByCommentIdController = new GetCommentByCommentIdController(
	getCommentByCommentId
);

export { getCommentByCommentId, getCommentByCommentIdController };
