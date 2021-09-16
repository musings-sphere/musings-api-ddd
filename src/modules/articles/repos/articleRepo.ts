import { Article, ArticleDetails, ArticleId } from "../domain";

export interface IArticleRepo {
	getArticleDetailsBySlug(slug: string): Promise<ArticleDetails>;
	getArticleBySlug(slug: string): Promise<Article>;
	getRecentArticles(offset?: number): Promise<ArticleDetails[]>;
	getPopularArticles(offset?: number): Promise<ArticleDetails[]>;
	getNumberOfCommentsByArticleId(
		articleId: ArticleId | string
	): Promise<number>;
	getArticleByArticleId(articleId: ArticleId | string): Promise<Article>;
	exists(articleId: ArticleId): Promise<boolean>;
	save(article: Article): Promise<void>;
	delete(articleId: ArticleId): Promise<void>;
}
