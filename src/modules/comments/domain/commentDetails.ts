import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";
import { ArticleSlug, ArticleTitle } from "../../articles/domain";
import { AuthorDetails } from "../../author/domain";
import { CommentId } from "./commentId";
import { CommentText } from "./commentText";

interface CommentDetailsProps {
	commentId: CommentId;
	text: CommentText;
	author: AuthorDetails;
	createdAt: Date | string;
	articleSlug: ArticleSlug;
	articleTitle: ArticleTitle;
	parentCommentId?: CommentId;
	points: number;
	wasUpVotedByMe: boolean;
	wasDownVotedByMe: boolean;
}

export class CommentDetails extends ValueObject<CommentDetailsProps> {
	private constructor(props: CommentDetailsProps) {
		super(props);
	}

	get commentId(): CommentId {
		return this.props.commentId;
	}

	get text(): CommentText {
		return this.props.text;
	}

	get author(): AuthorDetails {
		return this.props.author;
	}

	get createdAt(): Date | string {
		return this.props.createdAt;
	}

	get articleSlug(): ArticleSlug {
		return this.props.articleSlug;
	}

	get articleTitle(): ArticleTitle {
		return this.props.articleTitle;
	}

	get parentCommentId(): CommentId {
		return this.props.parentCommentId;
	}

	get points(): number {
		return this.props.points;
	}

	get wasUpVotedByMe(): boolean {
		return this.props.wasUpVotedByMe;
	}

	get wasDownVotedByMe(): boolean {
		return this.props.wasDownVotedByMe;
	}

	public static create(props: CommentDetailsProps): Result<CommentDetails> {
		const nullGuard = Guard.againstNullOrUndefinedBulk([
			{ argument: props.commentId, argumentName: "commentId" },
			{ argument: props.text, argumentName: "text" },
			{ argument: props.author, argumentName: "author" },
			{ argument: props.createdAt, argumentName: "createdAt" },
			{ argument: props.articleSlug, argumentName: "postSlug" },
			{ argument: props.articleTitle, argumentName: "postTitle" },
			{ argument: props.points, argumentName: "points" },
		]);

		if (!nullGuard.succeeded) {
			return Result.fail<CommentDetails>(nullGuard.message);
		}

		return Result.ok<CommentDetails>(
			new CommentDetails({
				...props,
				wasUpVotedByMe: props.wasUpVotedByMe ? props.wasUpVotedByMe : false,
				wasDownVotedByMe: props.wasDownVotedByMe
					? props.wasDownVotedByMe
					: false,
			})
		);
	}
}
