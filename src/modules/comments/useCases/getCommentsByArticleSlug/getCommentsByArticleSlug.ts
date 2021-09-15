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
import { GetCommentsByArticleSlugErrors } from "./getCommentsByArticleSlugErrors";
import { GetCommentsByArticleSlugRequestDTO } from "./getCommentsByArticleSlugRequestDTO";

type Response = Either<
	| GetCommentsByArticleSlugErrors.ArticleNotFoundError
	| AppError.UnexpectedError,
	Result<CommentDetails[]>
>;

export class GetCommentsByArticleSlug
	implements UseCase<any, Promise<Response>>
{
	private commentRepo: ICommentRepo;
	private authorRepo: IAuthorRepo;

	constructor(commentRepo: ICommentRepo, authorRepo: IAuthorRepo) {
		this.commentRepo = commentRepo;
		this.authorRepo = authorRepo;
	}

	public async execute(
		req: GetCommentsByArticleSlugRequestDTO
	): Promise<Response> {
		let authorId: AuthorId;
		let comments: CommentDetails[];
		const { slug, offset } = req;
		const isAuthenticated = !!req.userId === true;

		if (isAuthenticated) {
			authorId = await this.authorRepo.getAuthorByUserId(req.userId);
		}

		try {
			try {
				comments = await this.commentRepo.getCommentDetailsByArticleSlug(
					slug,
					authorId,
					offset
				);
			} catch (err) {
				return left(new AppError.UnexpectedError(err as Error));
			}

			return right(Result.ok<CommentDetails[]>(comments));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
