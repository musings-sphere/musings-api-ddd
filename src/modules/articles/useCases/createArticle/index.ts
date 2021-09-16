import { authorRepo } from "../../../author/repo";
import { articleRepo } from "../../repos";
import { CreateArticle } from "./createArticle";
import { CreateArticleController } from "./createArticleController";

const createArticle = new CreateArticle(articleRepo, authorRepo);
const createArticleController = new CreateArticleController(createArticle);

export { createArticle, createArticleController };
