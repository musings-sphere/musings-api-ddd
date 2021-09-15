import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { AuthorId } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import { CommentDetails } from "../../domain";
import { ICommentRepo } from "../../repo/commentRepo";
import { GetCommentByCommentIdErrors } from "./getCommentByCommentIdErrors";
import { GetCommentByCommentIdRequestDTO } from "./getCommentByCommentIdRequestDTO";

type Response = Either<
	GetCommentByCommentIdErrors.CommentNotFoundError | AppError.UnexpectedError,
	Result<CommentDetails>
>;

export class GetCommentByCommentId
	implements UseCase<GetCommentByCommentIdRequestDTO, Promise<Response>>
{
	private commentRepo: ICommentRepo;
	private authorRepo: IAuthorRepo;

	constructor(commentRepo: ICommentRepo, authorRepo: IAuthorRepo) {
		this.commentRepo = commentRepo;
		this.authorRepo = authorRepo;
	}

	public async execute(
		req: GetCommentByCommentIdRequestDTO
	): Promise<Response> {
		let comment: CommentDetails;
		let authorId: AuthorId;

		try {
			const isAuthenticated = !!req.userId === true;

			if (isAuthenticated) {
				authorId = await this.authorRepo.getAuthorByUserId(req.userId);
			}

			try {
				comment = await this.commentRepo.getCommentDetailsByCommentId(
					req.commentId,
					authorId
				);
			} catch (err) {
				return left(
					new GetCommentByCommentIdErrors.CommentNotFoundError(req.commentId)
				);
			}

			return right(Result.ok<CommentDetails>(comment));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
