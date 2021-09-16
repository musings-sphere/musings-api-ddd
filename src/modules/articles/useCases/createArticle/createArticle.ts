import {
	AppError,
	Either,
	left,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { Author } from "../../../author/domain";
import { IAuthorRepo } from "../../../author/repo/authorRepo";
import {
	Article,
	ArticleProps,
	ArticleSlug,
	ArticleText,
	ArticleTitle,
} from "../../domain";
import { IArticleRepo } from "../../repos/articleRepo";
import { CreateArticleDTO } from "./createArticleDTO";
import { CreateArticleErrors } from "./createArticleErrors";

type Response = Either<
	| CreateArticleErrors.AuthorDoesntExistError
	| AppError.UnexpectedError
	| Result<any>,
	Result<void>
>;

export class CreateArticle
	implements UseCase<CreateArticleDTO, Promise<Response>>
{
	private articleRepo: IArticleRepo;
	private authorRepo: IAuthorRepo;

	constructor(articleRepo: IArticleRepo, authorRepo: IAuthorRepo) {
		this.articleRepo = articleRepo;
		this.authorRepo = authorRepo;
	}

	public async execute(request: CreateArticleDTO): Promise<Response> {
		let author: Author;
		let title: ArticleTitle;
		let text: ArticleText;
		let slug: ArticleSlug;
		let article: Article;

		const { userId } = request;

		try {
			try {
				author = await this.authorRepo.getAuthorByUserId(userId);
			} catch (err) {
				return left(new CreateArticleErrors.AuthorDoesntExistError());
			}

			const titleOrError = ArticleTitle.create({ value: request.title });
			if (titleOrError.isFailure) {
				return left(titleOrError);
			}
			title = titleOrError.getValue();

			const slugOrError = ArticleSlug.create(title);
			if (slugOrError.isFailure) {
				return left(slugOrError);
			}
			slug = slugOrError.getValue();

			const textOrError = ArticleText.create({ value: request.text });
			if (textOrError.isFailure) {
				return left(textOrError);
			}
			text = textOrError.getValue();

			const articleProps: ArticleProps = {
				title,
				slug,
				authorId: author.authorId,
				text,
			};

			const postOrError = Article.create(articleProps);

			if (postOrError.isFailure) {
				return left(postOrError);
			}

			article = postOrError.getValue();

			await this.articleRepo.save(article);

			return right(Result.ok<void>());
		} catch (err) {
			return left(new AppError.UnexpectedError(err as Error));
		}
	}
}
