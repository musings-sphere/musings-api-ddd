import { IArticleRepo } from "../articleRepo";
import { ICommentRepo } from "../../../comments/repo/commentRepo";
import { IArticleVotesRepo } from "../articleVotesRepo";
import {
  Article,
  ArticleDetails,
  ArticleId,
  ArticleVotes,
} from "../../domain";
import { ArticleDetailsMap, ArticleMap } from "../../mappers";
import { Comments } from "../../../comments/domain";

export class SequelizeArticlesRepo implements IArticleRepo {
  private readonly models: any;
  private commentRepo: ICommentRepo;
  private articleVotesRepo: IArticleVotesRepo;

  constructor (models: any, commentRepo: ICommentRepo, articleVotesRepo: IArticleVotesRepo) {
    this.models = models;
    this.commentRepo = commentRepo;
    this.articleVotesRepo = articleVotesRepo;
  }

  private static createBaseQuery (): any {
    return {
      where: {},
      include: []
    }
  }

  private createBaseDetailsQuery (): any {
    const models = this.models;
    return {
      where: {},
      include: [
        {
          model: models.Author,
          as: 'Author',
          include: [
            { model: models.BaseUser, as: 'BaseUser' }
          ]
        }
      ],
      limit: 15,
      offset: 0
    }
  }

  public async getArticleByArticleId (articleId: ArticleId | string): Promise<Article> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;
    const ArticleModel = this.models.Article;
    const detailsQuery = SequelizeArticlesRepo.createBaseQuery();
    detailsQuery.where['articleId'] = articleId;
    const article = await ArticleModel.findOne(detailsQuery);
    const found = !!article === true;
    if (!found) throw new Error("Article not found");

    return ArticleMap.toDomain(article);
  }

  public async getNumberOfCommentsByArticleId (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `SELECT COUNT(*) FROM comment WHERE post_id = "${articleId}";`
    );

    return result[0][0]['COUNT(*)'];
  }

  // @ts-expect-error
  public async getArticleDetailsBySlug (slug: string, offset?: number): Promise<ArticleDetails> {
    const ArticleModel = this.models.Article;
    const detailsQuery = this.createBaseDetailsQuery();
    detailsQuery.where['slug'] = slug;
    const article = await ArticleModel.findOne(detailsQuery);
    const found = !!article === true;
    if (!found) throw new Error("Article not found");

    return ArticleDetailsMap.toDomain(article)
  }

  public async getRecentArticles (offset?: number): Promise<ArticleDetails[]> {
    const ArticleModel = this.models.Article;
    const detailsQuery = this.createBaseDetailsQuery();
    detailsQuery.offset = offset ? offset : detailsQuery.offset;

    const article = await ArticleModel.findAll(detailsQuery);
    return article.map((p) => ArticleDetailsMap.toDomain(p))
  }

  public async getPopularArticles (offset?: number): Promise<ArticleDetails[]> {
    const PostModel = this.models.Post;
    const detailsQuery = this.createBaseDetailsQuery();
    detailsQuery.offset = offset ? offset : detailsQuery.offset;
    detailsQuery['order'] = [
      ['points', 'DESC'],
    ];

    const posts = await PostModel.findAll(detailsQuery);
    return posts.map((p) => ArticleDetailsMap.toDomain(p))
  }

  public async getArticleBySlug (slug: string): Promise<Article> {
    const ArticleModel = this.models.Post;
    const detailsQuery = SequelizeArticlesRepo.createBaseQuery();
    detailsQuery.where['slug'] = slug;
    const article = await ArticleModel.findOne(detailsQuery);
    const found = !!article === true;
    if (!found) throw new Error("Article not found");

    return ArticleMap.toDomain(article);
  }

  public async exists (articleId: ArticleId): Promise<boolean> {
    const ArticleModel = this.models.Post;
    const baseQuery = SequelizeArticlesRepo.createBaseQuery();
    baseQuery.where['postId'] = articleId.id.toString();
    const article = await ArticleModel.findOne(baseQuery);

    return !!article === true;
  }

  public delete (articleId: ArticleId): Promise<void> {
    const ArticleModel = this.models.Article;
    return ArticleModel.destroy({ where: { articleId: articleId.id.toString() }});
  }

  private saveComments (comments: Comments) {
    return this.commentRepo.saveBulk(comments.getItems());
  }

  private saveArticleVotes (articleVotes: ArticleVotes) {
    return this.articleVotesRepo.saveBulk(articleVotes);
  }

  public async save (article: Article): Promise<void> {
    const ArticleModel = this.models.Article;
    const exists = await this.exists(article.articleId);
    const isNewArticle = !exists;
    const rawSequelizeArticle = await ArticleMap.toPersistence(article);

    if (isNewArticle) {
      try {
        await ArticleModel.create(rawSequelizeArticle);
        await this.saveComments(article.comments);
        await this.saveArticleVotes(article.getVotes());

      } catch (err) {
        await this.delete(article.articleId);
        throw new Error(err.toString())
      }
    } else {
      // Save non-aggregate tables before saving the aggregate
      // so that any domain events on the aggregate get dispatched
      await this.saveComments(article.comments);
      await this.saveArticleVotes(article.getVotes());

      await ArticleModel.update(rawSequelizeArticle, {
        // To make sure your hooks always run, make sure to include this in
        // the query
        individualHooks: true,
        hooks: true,
        where: { article_id: article.articleId.id.toString() }
      });
    }
  }
}
