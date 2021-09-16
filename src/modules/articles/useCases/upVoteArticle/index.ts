import { authorRepo } from "../../../author/repo";
import { articleRepo, articlesVotesRepo } from "../../repos";
import { articleService } from "../../services";
import { UpVoteArticle } from "./upVoteArticle";
import { UpVoteArticleController } from "./upVoteArticleController";

const upVoteArticle = new UpVoteArticle(
	authorRepo,
	articleRepo,
	articlesVotesRepo,
	articleService
);

const upVoteArticleController = new UpVoteArticleController(upVoteArticle);

export { upVoteArticle, upVoteArticleController };
