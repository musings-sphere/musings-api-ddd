import { ICommentVotesRepo } from "../commentVotesRepo";
import { CommentId, CommentVote, CommentVotes } from "../../domain";
import { AuthorId } from "../../../author/domain";
import { VoteType } from "../../../articles/domain/vote";
import { CommentVoteMap } from "../../mappers";
import { ArticleId } from "../../../articles/domain";

export class SequelizeCommentVotesRepo implements ICommentVotesRepo {
  private models: any;

  constructor (models: any) {
    this.models = models;
  }

  private static createBaseQuery (): any {
    return {
      where: {},
    }
  }

  async exists (commentId: CommentId, authorId: AuthorId, voteType: VoteType): Promise<boolean> {
    const CommentVote = this.models.CommentVote;
    const baseQuery = SequelizeCommentVotesRepo.createBaseQuery();
    baseQuery.where['author_id'] = authorId.id.toString();
    baseQuery.where['comment_id'] = commentId.id.toString();
    baseQuery.where['type'] = voteType;
    const vote = await CommentVote.findOne(baseQuery);
    return !!vote === true;
  }

  async saveBulk (votes: CommentVotes): Promise<any> {
    for (let vote of votes.getRemovedItems()) {
      await this.delete(vote);
    }

    for (let vote of votes.getNewItems()) {
      await this.save(vote);
    }
  }

  async save (vote: CommentVote): Promise<any> {
    const CommentVoteModel = this.models.CommentVote;
    const exists = await this.exists(vote.commentId, vote.authorId, vote.type);
    const isNew = !exists
    const rawSequelizeCommentVote = CommentVoteMap.toPersistence(vote);

    if (isNew) {
      try {
        await CommentVoteModel.create(rawSequelizeCommentVote);
      } catch (err) {
        throw new Error(err.toString());
      }
    } else {
      throw new Error("Shouldn't be re-saving a vote. Only deleting and saving.");
    }
  }

  async delete (vote: CommentVote): Promise<any> {
    const CommentVoteModel = this.models.CommentVote;
    return CommentVoteModel.destroy({
      where: {
        comment_id: vote.commentId.id.toString(),
        author_id: vote.authorId.id.toString()
      }
    })
  }

  async getVotesForCommentByMemberId (commentId: CommentId, authorId: AuthorId): Promise<CommentVote[]> {
    const CommentVote = this.models.CommentVote;
    const baseQuery = SequelizeCommentVotesRepo.createBaseQuery();
    baseQuery.where['member_id'] = authorId.id.toString();
    baseQuery.where['comment_id'] = commentId.id.toString();
    const votes = await CommentVote.findAll(baseQuery);
    return votes.map((v) => CommentVoteMap.toDomain(v));
  }

  async countUpVotesForCommentByCommentId (commentId: CommentId | string): Promise<number> {
    commentId  = commentId instanceof CommentId
    ? (<CommentId>commentId).id.toString()
    : commentId;

    const result = await this.models.sequelize.query(
      `select COUNT(*)
        from comment_vote
        where comment_id = "${commentId}"
        and type = "UPVOTE"`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countDownVotesForCommentByCommentId (commentId: CommentId | string): Promise<number> {
    commentId  = commentId instanceof CommentId
    ? (<CommentId>commentId).id.toString()
    : commentId;

    const result = await this.models.sequelize.query(
      `select COUNT(*)
        from comment_vote
        where comment_id = "${commentId}"
        and type = "DOWNVOTE"`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countAllArticleCommentUpVotesExcludingOP (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `SELECT COUNT(*) FROM (
        SELECT COUNT(*) as upVotes
        from article A
        join comment CM on CM.article_id = A.article_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where A.article_id = "${articleId}"
        and CV.type = "UPVOTE"
        and CV.author_id != CM.author_id
        group by CV.comment_id
      ) as upVotes_total;`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countAllArticleCommentDownVotesExcludingOP (articleId: ArticleId | String): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `SELECT COUNT(*) FROM (
        SELECT COUNT(*) as upVotes
        from article A
        join comment CM on CM.article_id = A.article_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where A.article_id = "${articleId}"
        and CV.type = "DOWNVOTE"
        and CV.author_id != CM.author_id
        group by CV.comment_id
      ) as upVotes_total;`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countAllArticleCommentUpVotes (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `SELECT COUNT(*) FROM (
        SELECT COUNT(*) as upVotes
        from article A
        join comment CM on CM.article_id = A.article_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where A.article_id = "${articleId}"
        and CV.type = "UPVOTE"
        group by CV.comment_id
      ) as upVotes_total;`
    );

    return result[0][0]['COUNT(*)'];
  }

  async countAllArticleCommentDownVotes (articleId: ArticleId | string): Promise<number> {
    articleId  = articleId instanceof ArticleId
    ? (<ArticleId>articleId).id.toString()
    : articleId;

    const result = await this.models.sequelize.query(
      `SELECT COUNT(*) FROM (
        SELECT COUNT(*) as downVotes
        from article A
        join comment CM on CM.article_id = A.article_id
        join comment_vote CV on CV.comment_id = CM.comment_id
        where P.post_id = "${articleId}"
        and CV.type = "DOWNVOTE"
        group by CV.comment_id
      ) as downVotes_total;`
    );

    return result[0][0]['COUNT(*)'];
  }
}
