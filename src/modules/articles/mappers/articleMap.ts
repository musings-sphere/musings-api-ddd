import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { AuthorId } from "../../author/domain";
import { Article, ArticleSlug, ArticleText, ArticleTitle } from "../domain";

export class ArticleMap implements Mapper<Article> {
	public static toDomain(raw: any): Article {
		const articleOrError = Article.create(
			{
				authorId: AuthorId.create(
					new UniqueEntityID(raw.author_id)
				).getValue(),
				slug: ArticleSlug.createFromExisting(raw.slug).getValue(),
				title: ArticleTitle.create({ value: raw.title }).getValue(),
				text: ArticleText.create({ value: raw.text }).getValue(),
				points: raw.points,
				totalNumComments: raw.total_num_comments,
			},
			new UniqueEntityID(raw.post_id)
		);

		articleOrError.isFailure ? console.log(articleOrError.error) : "";

		return articleOrError.isSuccess ? articleOrError.getValue() : null;
	}

	public static toPersistence(article: Article): any {
		return {
			total_num_comments: article.totalNumComments,
			updatedAt: new Date().toString(),
			title: article.title.value,
			article_id: article.articleId.id.toString(),
			author_id: article.authorId.id.toString(),
			text: article.text.value,
			slug: article.slug.value,
			points: article.points,
		};
	}
}
