import { Guard, Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";
import { VoteType } from "../../articles/domain/vote";
import { AuthorId } from "../../author/domain";
import { CommentId } from "./commentId";

interface CommentVoteProps {
	commentId: CommentId;
	authorId: AuthorId;
	type: VoteType;
}

export class CommentVote extends Entity<CommentVoteProps> {
	private constructor(props: CommentVoteProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	get commentId(): CommentId {
		return this.props.commentId;
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
		props: CommentVoteProps,
		id?: UniqueEntityID
	): Result<CommentVote> {
		const guardResult = Guard.againstNullOrUndefinedBulk([
			{ argument: props.authorId, argumentName: "authorId" },
			{ argument: props.commentId, argumentName: "commentId" },
			{ argument: props.type, argumentName: "type" },
		]);

		if (!guardResult.succeeded) {
			return Result.fail<CommentVote>(guardResult.message);
		} else {
			return Result.ok<CommentVote>(new CommentVote(props, id));
		}
	}

	public static createUpVote(
		authorId: AuthorId,
		commentId: CommentId
	): Result<CommentVote> {
		const memberGuard = Guard.againstNullOrUndefined(authorId, "authorId");
		const postGuard = Guard.againstNullOrUndefined(commentId, "commentId");

		if (!memberGuard.succeeded) {
			return Result.fail<CommentVote>(memberGuard.message);
		}

		if (!postGuard.succeeded) {
			return Result.fail<CommentVote>(postGuard.message);
		}

		return Result.ok<CommentVote>(
			new CommentVote({
				authorId,
				commentId,
				type: "UPVOTE",
			})
		);
	}

	public static createDownvote(
		authorId: AuthorId,
		commentId: CommentId
	): Result<CommentVote> {
		const authorGuard = Guard.againstNullOrUndefined(authorId, "memberId");
		const articleGuard = Guard.againstNullOrUndefined(commentId, "commentId");

		if (!authorGuard.succeeded) {
			return Result.fail<CommentVote>(authorGuard.message);
		}

		if (!articleGuard.succeeded) {
			return Result.fail<CommentVote>(articleGuard.message);
		}

		return Result.ok<CommentVote>(
			new CommentVote({
				authorId,
				commentId,
				type: "DOWNVOTE",
			})
		);
	}
}
