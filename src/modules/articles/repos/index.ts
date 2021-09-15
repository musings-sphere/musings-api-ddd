import { Article, ArticleVote } from "../../../database/models";
import { commentRepo } from "../../comments/repo";
import { SequelizeArticlesRepo } from "./implementations/sequelizeArticleRepo";
import { SequelizeArticleVotesRepo } from "./implementations/sequelizeArticleVotesRepo";

const articlesVotesRepo = new SequelizeArticleVotesRepo(ArticleVote);
const articleRepo = new SequelizeArticlesRepo(
	Article,
	commentRepo,
	articlesVotesRepo
);

export { articleRepo, articlesVotesRepo };
