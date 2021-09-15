import { authorRepo } from "../../../author/repo";
import { commentRepo } from "../../repo";
import { GetCommentsByArticleSlug } from "./getCommentsByArticleSlug";
import { GetCommentsByArticleSlugController } from "./getCommentsByArticleSlugController";

const getCommentsByArticleSlug = new GetCommentsByArticleSlug(
	commentRepo,
	authorRepo
);

const getCommentsByArticleSlugController =
	new GetCommentsByArticleSlugController(getCommentsByArticleSlug);

export { getCommentsByArticleSlug, getCommentsByArticleSlugController };
