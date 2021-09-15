import { articleRepo } from "../../../articles/repos";
import { authorRepo } from "../../../author/repo";
import { ReplyToArticle } from "./replyToArticle";
import { ReplyToArticleController } from "./replyToArticleController";

const replyToArticle = new ReplyToArticle(authorRepo, articleRepo);

const replyToArticleController = new ReplyToArticleController(replyToArticle);

export { replyToArticle, replyToArticleController };
