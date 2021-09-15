import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { AuthorDetails } from "../../domain";
import { IAuthorRepo } from "../../repo/authorRepo";
import { GetAuthorByUserNameDTO } from "./getAuthorByUserNameDTO";
import { GetAuthorByUserNameErrors } from "./getAuthorByUserNameErrors";

type Response = Either<
	GetAuthorByUserNameErrors.AuthorNotFoundError | AppError.UnexpectedError,
	Result<AuthorDetails>
>;

export class GetAuthorByUserName
	implements UseCase<GetAuthorByUserNameDTO, Promise<Response>>
{
	private authorRepo: IAuthorRepo;

	constructor(authorRepo: IAuthorRepo) {
		this.authorRepo = authorRepo;
	}

	public async execute(request: GetAuthorByUserNameDTO): Promise<Response> {
		let authorDetails: AuthorDetails;
		const { userName } = request;

		try {
			try {
				authorDetails = await this.authorRepo.getAuthorDetailsByUserName(
					userName
				);
			} catch (err) {
				return left(
					new GetAuthorByUserNameErrors.AuthorNotFoundError(userName)
				);
			}

			return right(Result.ok<AuthorDetails>(authorDetails));
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
