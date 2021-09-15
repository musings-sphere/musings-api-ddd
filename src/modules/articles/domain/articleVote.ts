import { Guard, Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";
import { AuthorId } from "../../author/domain";
import { ArticleId } from "./articleId";
import { VoteType } from "./vote";

interface ArticleVoteProps {
	articleId: ArticleId;
	authorId: AuthorId;
	type: VoteType;
}

export class ArticleVote extends Entity<ArticleVoteProps> {
	private constructor(props: ArticleVoteProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	get articleId(): ArticleId {
		return this.props.articleId;
	}

	get authorId(): AuthorId {
		return this.props.authorId;
	}

	get type(): VoteType {
		return this.props.type;
	}

	public isUpVote(): boolean {
		return this.props.type === "UPVOTE";
	}

	public isDownVote(): boolean {
		return this.props.type === "DOWNVOTE";
	}

	public static create(
		props: ArticleVoteProps,
		id?: UniqueEntityID
	): Result<ArticleVote> {
		const guardResult = Guard.againstNullOrUndefinedBulk([
			{ argument: props.authorId, argumentName: "authorId" },
			{ argument: props.articleId, argumentName: "articleId" },
			{ argument: props.type, argumentName: "type" },
		]);

		if (!guardResult.succeeded) {
			return Result.fail<ArticleVote>(guardResult.message);
		} else {
			return Result.ok<ArticleVote>(new ArticleVote(props, id));
		}
	}

	public static createUpVote(
		authorId: AuthorId,
		articleId: ArticleId
	): Result<ArticleVote> {
		const authorGuard = Guard.againstNullOrUndefined(authorId, "authorId");
		const articleGuard = Guard.againstNullOrUndefined(articleId, "articleId");

		if (!authorGuard.succeeded) {
			return Result.fail<ArticleVote>(authorGuard.message);
		}

		if (!articleGuard.succeeded) {
			return Result.fail<ArticleVote>(articleGuard.message);
		}

		return Result.ok<ArticleVote>(
			new ArticleVote({
				authorId,
				articleId,
				type: "UPVOTE",
			})
		);
	}

	public static createDownVote(
		authorId: AuthorId,
		articleId: ArticleId
	): Result<ArticleVote> {
		const memberGuard = Guard.againstNullOrUndefined(authorId, "memberId");
		const postGuard = Guard.againstNullOrUndefined(articleId, "articleId");

		if (!memberGuard.succeeded) {
			return Result.fail<ArticleVote>(memberGuard.message);
		}

		if (!postGuard.succeeded) {
			return Result.fail<ArticleVote>(postGuard.message);
		}

		return Result.ok<ArticleVote>(
			new ArticleVote({
				authorId,
				articleId,
				type: "DOWNVOTE",
			})
		);
	}
}
