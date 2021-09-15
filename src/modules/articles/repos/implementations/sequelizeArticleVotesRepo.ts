import { IArticleVotesRepo } from "../articleVotesRepo";
import { VoteType } from "../../domain/vote";
import { ArticleId, ArticleVote, ArticleVotes } from "../../domain";
import { AuthorId } from "../../../author/domain";
import { ArticleVoteMap } from "../../mappers";

export class SequelizeArticleVotesRepo implements IArticleVotesRepo {
  private models: any;

  constructor (models: any) {
    this.models = models;
  }

  private static createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists (articleId: ArticleId, authorId: AuthorId, voteType: VoteType): Promise<boolean> {
    const ArticleVote = this.models.ArticleVote;
    const baseQuery = SequelizeArticleVotesRepo.createBaseQuery();
    baseQuery.where['authorId'] = authorId.id.toString();
    baseQuery.where['articleId'] = articleId.id.toString();
    baseQuery.where['type'] = voteType;
    const vote = await ArticleVote.findOne(baseQuery);

    return !!vote === true;
  }

  async getVotesForArticleByAuthorId (articleId: ArticleId, authorId: AuthorId): Promise<ArticleVote[]> {
    const ArticleVote = this.models.ArticleVote;
    const baseQuery = SequelizeArticleVotesRepo.createBaseQuery();
    baseQuery.where['authorId'] = authorId.id.toString();
    baseQuery.where['articleId'] = articleId.id.toString();
    const votes = await ArticleVote.findAll(baseQuery);

    return votes.map((v) => ArticleVoteMap.toDomain(v));
  }

  async save (vote: ArticleVote): Promise<any> {
    const PostVoteModel = this.models.PostVote;
    const exists = await this.exists(vote.articleId, vote.authorId, vote.type);
    const rawSequelizePostVote = ArticleVoteMap.toPersistence(vote);

    if (!exists) {
      try {
        await PostVoteModel.create(rawSequelizePostVote);
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      throw new Error('Invalid state. Votes arent updated.')
    }
  }

  public async delete (vote: ArticleVote): Promise<any> {
    const PostVoteModel = this.models.PostVote;
    return PostVoteModel.destroy({
      where: {
        article_id: vote.articleId.id.toString(),
        author_id: vote.authorId.id.toString()
      }
    })
  }

  async saveBulk (votes: ArticleVotes): Promise<any> {
    for (let vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (let vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  async countArticleUpVotesByArticleId (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `select COUNT(*)
        from ArticleVote
        where articleId = "${articleId}"
        and type = "UPVOTE"`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countArticleDownVotesByArticleId (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `select COUNT(*)
        from post_vote
        where post_id = "${articleId}"
        and type = "DOWNVOTE"`
    );

    return result[0][0]['COUNT(*)'];
  }
}
