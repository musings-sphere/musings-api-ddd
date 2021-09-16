import { AuthorId } from "../../../author/domain";
import {
	CommentDetails,
	Comment,
	CommentId,
	CommentVotes,
} from "../../domain";
import { CommentDetailsMap, CommentMap } from "../../mappers";
import { ICommentRepo } from "../commentRepo";
import { ICommentVotesRepo } from "../commentVotesRepo";

export class SequelizeCommentRepo implements ICommentRepo {
	private readonly models: any;
	private commentVotesRepo: ICommentVotesRepo;

	constructor(models: any, commentVotesRepo: ICommentVotesRepo) {
		this.models = models;
		this.commentVotesRepo = commentVotesRepo;
	}

	private static createBaseQuery(): any {
		return {
			where: {},
		};
	}

	private createBaseDetailsQuery(): any {
		const models = this.models;
		return {
			where: {},
			include: [
				{ model: models.Article, as: "Article", where: {} },
				{
					model: models.Author,
					as: "Author",
					include: [{ model: models.BaseUser, as: "BaseUser" }],
				},
			],
			limit: 15,
			offset: 0,
		};
	}

	async exists(commentId: string): Promise<boolean> {
		const CommentModel = this.models.Comment;
		const detailsQuery = SequelizeCommentRepo.createBaseQuery();
		detailsQuery.where["comment_id"] = commentId;
		const comment = await CommentModel.findOne(detailsQuery);
		return !!comment === true;
	}

	async getCommentDetailsByArticleSlug(
		slug: string,
		authorId?: AuthorId,
		// @ts-expect-error
		offset?: number
	): Promise<CommentDetails[]> {
		const CommentModel = this.models.Comment;
		const detailsQuery = this.createBaseDetailsQuery();
		detailsQuery.include[0].where["slug"] = slug;

		if (!!authorId === true) {
			detailsQuery.include.push({
				model: this.models.CommentVote,
				as: "CommentVotes",
				where: { author_id: authorId.id.toString() },
				required: false,
			});
		}

		const comments = await CommentModel.findAll(detailsQuery);
		return comments.map((c) => CommentDetailsMap.toDomain(c));
	}

	async getCommentByCommentId(commentId: string): Promise<Comment> {
		const CommentModel = this.models.Comment;
		const detailsQuery = SequelizeCommentRepo.createBaseQuery();
		detailsQuery.where["comment_id"] = commentId;
		const comment = await CommentModel.findOne(detailsQuery);
		const found = !!comment === true;
		if (!found) throw new Error("Comment not found");
		return CommentMap.toDomain(comment);
	}

	async getCommentDetailsByCommentId(
		commentId: string,
		authorId?: AuthorId
	): Promise<CommentDetails> {
		const CommentModel = this.models.Comment;
		const detailsQuery = this.createBaseDetailsQuery();
		detailsQuery.where["comment_id"] = commentId;

		if (!!authorId === true) {
			detailsQuery.include.push({
				model: this.models.CommentVote,
				as: "CommentVotes",
				where: { author_id: authorId.id.toString() },
				required: false,
			});
		}

		const comment = await CommentModel.findOne(detailsQuery);
		const found = !!comment === true;
		if (!found) throw new Error("Comment not found");
		return CommentDetailsMap.toDomain(comment);
	}

	async deleteComment(commentId: CommentId): Promise<void> {
		const CommentModel = this.models.Comment;
		return CommentModel.destroy({
			where: { comment_id: commentId.id.toString() },
		});
	}

	private saveCommentVotes(commentVotes: CommentVotes) {
		return this.commentVotesRepo.saveBulk(commentVotes);
	}

	async save(comment: Comment): Promise<void> {
		const CommentModel = this.models.Comment;
		const exists = await this.exists(comment.commentId.id.toString());
		const rawSequelizeComment = CommentMap.toPersistence(comment);

		if (!exists) {
			try {
				await CommentModel.create(rawSequelizeComment);
				await this.saveCommentVotes(comment.getVotes());
			} catch (err) {
				throw new Error(err.toString());
			}
		} else {
			await this.saveCommentVotes(comment.getVotes());

			const sequelizeCommentInstance = await CommentModel.findOne({
				where: { comment_id: comment.commentId.id.toString() },
			});
			await sequelizeCommentInstance.update(rawSequelizeComment);
		}
	}

	async saveBulk(comments: Comment[]): Promise<void> {
		for (let comment of comments) {
			await this.save(comment);
		}
	}
}
