import {
	Either,
	Guard,
	IGuardArgument,
	left,
	Result,
	right,
} from "../../../shared/core";
import { AggregateRoot, UniqueEntityID } from "../../../shared/domain";
import { AuthorId } from "../../author/domain";
import { Comment, Comments } from "../../comments/domain";
import { CommentPosted } from "../../comments/domain/events/commentPosted";
import { CommentVotesChanged } from "../../comments/domain/events/commentVotesChanged";
import { EditArticleErrors } from "../useCases/editPost/editArticleErrors";
import { ArticleId } from "./articleId";
import { ArticleLink } from "./articleLink";
import { ArticleSlug } from "./articleSlug";
import { ArticleText } from "./articleText";
import { ArticleTitle } from "./articleTitle";
import { ArticleVote } from "./articleVote";
import { ArticleVotes } from "./articleVotes";
import { ArticleCreated, ArticleVotesChanged } from "./events";

export type UpdateArticleOrLinkResult = Either<
	EditArticleErrors.ArticleSealedError | Result<any>,
	Result<void>
>;

export interface ArticleProps {
	authorId: AuthorId;
	slug: ArticleSlug;
	title: ArticleTitle;
	text?: ArticleText;
	link?: ArticleLink;
	comments?: Comments;
	votes?: ArticleVotes;
	totalNumComments?: number;
	points?: number; // articles can have negative or positive valued points
	dateTimePosted?: string | Date;
}

export class Article extends AggregateRoot<ArticleProps> {
	get articleId(): ArticleId {
		return ArticleId.create(this._id).getValue();
	}

	get authorId(): AuthorId {
		return this.props.authorId;
	}

	get title(): ArticleTitle {
		return this.props.title;
	}

	get slug(): ArticleSlug {
		return this.props.slug;
	}

	get dateTimePosted(): string | Date {
		return this.props.dateTimePosted;
	}

	get comments(): Comments {
		return this.props.comments;
	}

	get points(): number {
		return this.props.points;
	}

	get link(): ArticleLink {
		return this.props.link;
	}

	get text(): ArticleText {
		return this.props.text;
	}

	get totalNumComments(): number {
		return this.props.totalNumComments;
	}

	public updateTotalNumberComments(numComments: number): void {
		if (numComments >= 0) {
			this.props.totalNumComments = numComments;
		}
	}

	public hasComments(): boolean {
		return this.totalNumComments !== 0;
	}

	public updateText(articleText: ArticleText): UpdateArticleOrLinkResult {
		if (this.hasComments()) {
			return left(new EditArticleErrors.ArticleSealedError());
		}

		const guardResult = Guard.againstNullOrUndefined(
			articleText,
			"articleText"
		);

		if (!guardResult.succeeded) {
			return left(Result.fail<any>(guardResult.message));
		}

		this.props.text = articleText;
		return right(Result.ok<void>());
	}

	public updatePostScore(
		numPostUpVotes: number,
		numPostDownVotes: number,
		numPostCommentUpVotes: number,
		numPostCommentDownVotes: number
	) {
		this.props.points =
			numPostUpVotes -
			numPostDownVotes +
			(numPostCommentUpVotes - numPostCommentDownVotes);
	}

	public addVote(vote: ArticleVote): Result<void> {
		this.props.votes.add(vote);
		this.addDomainEvent(new ArticleVotesChanged(this, vote));
		return Result.ok<void>();
	}

	public removeVote(vote: ArticleVote): Result<void> {
		this.props.votes.remove(vote);
		this.addDomainEvent(new ArticleVotesChanged(this, vote));
		return Result.ok<void>();
	}

	private removeCommentIfExists(comment: Comment): void {
		if (this.props.comments.exists(comment)) {
			this.props.comments.remove(comment);
		}
	}

	public addComment(comment: Comment): Result<void> {
		this.removeCommentIfExists(comment);
		this.props.comments.add(comment);
		this.props.totalNumComments++;
		this.addDomainEvent(new CommentPosted(this, comment));
		return Result.ok<void>();
	}

	public updateComment(comment: Comment): Result<void> {
		this.removeCommentIfExists(comment);
		this.props.comments.add(comment);
		this.addDomainEvent(new CommentVotesChanged(this, comment));
		return Result.ok<void>();
	}

	public getVotes(): ArticleVotes {
		return this.props.votes;
	}

	private constructor(props: ArticleProps, id?: UniqueEntityID) {
		super(props, id);
	}

	public static create(
		props: ArticleProps,
		id?: UniqueEntityID
	): Result<Article> {
		const guardArgs: IGuardArgument<any>[] = [
			{ argument: props.authorId, argumentName: "memberId" },
			{ argument: props.slug, argumentName: "slug" },
			{ argument: props.title, argumentName: "title" },
			{ argument: props.text, argumentName: "text" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

		if (!guardResult.succeeded) {
			return Result.fail<Article>(guardResult.message);
		}

		const defaultValues: ArticleProps = {
			...props,
			comments: props.comments ? props.comments : Comments.create([]),
			points: !!props.points ? props.points : 0,
			dateTimePosted: props.dateTimePosted ? props.dateTimePosted : new Date(),
			totalNumComments: props.totalNumComments ? props.totalNumComments : 0,
			votes: props.votes ? props.votes : ArticleVotes.create([]),
		};

		const isNewPost = !!id === false;
		const article = new Article(defaultValues, id);

		if (isNewPost) {
			article.addDomainEvent(new ArticleCreated(article));

			// Create with initial upvote from whomever created the post
			article.addVote(
				ArticleVote.createUpVote(props.authorId, article.articleId).getValue()
			);
		}

		return Result.ok<Article>(article);
	}
}
