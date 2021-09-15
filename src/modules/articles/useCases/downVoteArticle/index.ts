import { authorRepo } from "../../../author/repo";
import { articleRepo, articlesVotesRepo } from "../../repos";
import { articleService } from "../../services";
import { DownVoteArticle } from "./downVoteArticle";
import { DownVoteArticleController } from "./downVoteArticleController";

const downVoteArticle = new DownVoteArticle(
	authorRepo,
	articleRepo,
	articlesVotesRepo,
	articleService
);

const downVoteArticleController = new DownVoteArticleController(
	downVoteArticle
);

export { downVoteArticle, downVoteArticleController };
