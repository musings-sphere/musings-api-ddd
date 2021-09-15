import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { Comment } from "../../domain";
import { ICommentRepo } from "../../repo/commentRepo";
import { ICommentVotesRepo } from "../../repo/commentVotesRepo";
import { UpdateCommentStatsDTO } from "./updateCommentStatsDTO";

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class UpdateCommentStats
	implements UseCase<UpdateCommentStatsDTO, Promise<Response>>
{
	private commentRepo: ICommentRepo;
	private commentVotesRepo: ICommentVotesRepo;

	constructor(commentRepo: ICommentRepo, commentVotesRepo: ICommentVotesRepo) {
		this.commentRepo = commentRepo;
		this.commentVotesRepo = commentVotesRepo;
	}

	public async execute(req: UpdateCommentStatsDTO): Promise<any> {
		try {
			// Get the comment
			const comment: Comment = await this.commentRepo.getCommentByCommentId(
				req.commentId.id.toString()
			);

			// Get number upVotes and downVotes
			let [numUpVotes, numDownVotes] = await Promise.all([
				this.commentVotesRepo.countUpVotesForCommentByCommentId(req.commentId),
				this.commentVotesRepo.countDownVotesForCommentByCommentId(
					req.commentId
				),
			]);

			comment.updateScore(numUpVotes, numDownVotes);

			await this.commentRepo.save(comment);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
