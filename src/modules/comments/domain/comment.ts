import { Guard, Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";
import { ArticleId } from "../../articles/domain";
import { AuthorId } from "../../author/domain";
import { CommentId } from "./commentId";
import { CommentText } from "./commentText";
import { CommentVote } from "./commentVote";
import { CommentVotes } from "./commentVotes";

export interface CommentProps {
	authorId: AuthorId;
	text: CommentText;
	articleId: ArticleId;
	votes?: CommentVotes;
	parentCommentId?: CommentId;
	points?: number;
}

export class Comment extends Entity<CommentProps> {
	get commentId(): CommentId {
		return CommentId.create(this._id).getValue();
	}

	get articleId(): ArticleId {
		return this.props.articleId;
	}

	get parentCommentId(): CommentId {
		return this.props.parentCommentId;
	}

	get authorId(): AuthorId {
		return this.props.articleId;
	}

	get text(): CommentText {
		return this.props.text;
	}

	get points(): number {
		let initialValue = this.props.points;
		return initialValue + this.computeVotePoints();
	}

	private computeVotePoints(): number {
		let tally = 0;

		for (let vote of this.props.votes.getNewItems()) {
			if (vote.isUpVote()) {
				tally++;
			}

			if (vote.isDownVote()) {
				tally--;
			}
		}

		for (let vote of this.props.votes.getRemovedItems()) {
			if (vote.isUpVote()) {
				tally--;
			}

			if (vote.isDownVote()) {
				tally++;
			}
		}

		return tally;
	}

	public removeVote(vote: CommentVote): Result<void> {
		this.props.votes.remove(vote);
		return Result.ok<void>();
	}

	public addVote(vote: CommentVote): Result<void> {
		this.props.votes.add(vote);
		return Result.ok<void>();
	}

	public getVotes(): CommentVotes {
		return this.props.votes;
	}

	public updateScore(
		totalNumUpVotes: number,
		totalNumDownVotes: number
	): void {
		this.props.points = totalNumUpVotes - totalNumDownVotes;
	}

	private constructor(props: CommentProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(
		props: CommentProps,
		id?: UniqueEntityID
	): Result<Comment> {
		const nullGuard = Guard.againstNullOrUndefinedBulk([
			{ argument: props.authorId, argumentName: "authorId" },
			{ argument: props.text, argumentName: "text" },
			{ argument: props.articleId, argumentName: "articleId" },
		]);

		if (!nullGuard.succeeded) {
			return Result.fail<Comment>(nullGuard.message);
		} else {
			const isNewComment = !!id === false;

			const defaultCommentProps: CommentProps = {
				...props,
				points: !!props.points ? props.points : 0,
				votes: props.votes ? props.votes : CommentVotes.create([]),
			};

			const comment = new Comment(defaultCommentProps, id);

			if (isNewComment) {
				comment.addVote(
					CommentVote.createUpVote(
						props.authorId,
						comment.commentId
					).getValue()
				);
			}

			return Result.ok<Comment>(comment);
		}
	}
}
