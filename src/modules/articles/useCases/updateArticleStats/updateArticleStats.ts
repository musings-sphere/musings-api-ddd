import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { ICommentVotesRepo } from "../../../comments/repo/commentVotesRepo";
import { Article } from "../../domain";
import { IArticleRepo } from "../../repos/articleRepo";
import { IArticleVotesRepo } from "../../repos/articleVotesRepo";
import { UpdateArticleStatsDTO } from "./updateArticleStatsDTO";
import { UpdateArticleStatsErrors } from "./updateArticleStatsErrors";

type Response = Either<
	UpdateArticleStatsErrors.ArticleNotFoundError | AppError.UnexpectedError,
	Result<void>
>;

export class UpdateArticleStats
	implements UseCase<UpdateArticleStatsDTO, Promise<Response>>
{
	private articleRepo: IArticleRepo;
	private articleVotesRepo: IArticleVotesRepo;
	private commentVotesRepo: ICommentVotesRepo;

	constructor(
		articleRepo: IArticleRepo,
		articleVotesRepo: IArticleVotesRepo,
		commentVotesRepo: ICommentVotesRepo
	) {
		this.articleRepo = articleRepo;
		this.articleVotesRepo = articleVotesRepo;
		this.commentVotesRepo = commentVotesRepo;
	}

	public async execute(response: UpdateArticleStatsDTO): Promise<Response> {
		const { articleId } = response;
		let article: Article;

		try {
			try {
				article = await this.articleRepo.getArticleByArticleId(
					response.articleId
				);
			} catch (err) {
				return left(
					new UpdateArticleStatsErrors.ArticleNotFoundError(articleId)
				);
			}

			const commentCount: number =
				await this.articleRepo.getNumberOfCommentsByArticleId(
					response.articleId
				);

			// Update comment count
			article.updateTotalNumberComments(commentCount);

			// Update article points
			const [
				numArticleUpVotes,
				numArticleDownVotes,
				commentUpVotes,
				commentDownVotes,
			] = await Promise.all([
				this.articleVotesRepo.countArticleUpVotesByArticleId(
					article.articleId
				),
				this.articleVotesRepo.countArticleDownVotesByArticleId(
					article.articleId
				),
				this.commentVotesRepo.countAllArticleCommentUpVotesExcludingOP(
					article.articleId
				),
				this.commentVotesRepo.countAllArticleCommentDownVotesExcludingOP(
					article.articleId
				),
			]);

			article.updatePostScore(
				numArticleUpVotes,
				numArticleDownVotes,
				commentUpVotes,
				commentDownVotes
			);

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
