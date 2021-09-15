import { Guard, IGuardArgument, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";
import { AuthorDetails } from "../../author/domain";
import { ArticleLink } from "./articleLink";
import { ArticleSlug } from "./articleSlug";
import { ArticleText } from "./articleText";
import { ArticleTitle } from "./articleTitle";

interface ArticleDetailsProps {
	author: AuthorDetails;
	slug: ArticleSlug;
	title: ArticleTitle;
	text: ArticleText;
	link?: ArticleLink;
	numComments: number;
	points: number;
	dateTimePosted: string | Date;
	wasUpVotedByMe: boolean;
	wasDownVotedByMe: boolean;
}

export class ArticleDetails extends ValueObject<ArticleDetailsProps> {
	private constructor(props: ArticleDetailsProps) {
		super(props);
	}

	get author(): AuthorDetails {
		return this.props.author;
	}

	get slug(): ArticleSlug {
		return this.props.slug;
	}

	get title(): ArticleTitle {
		return this.props.title;
	}

	get text(): ArticleText {
		return this.props.text;
	}

	get link(): ArticleLink {
		return this.props.link;
	}

	get numComments(): number {
		return this.props.numComments;
	}

	get points(): number {
		return this.props.points;
	}

	get dateTimePosted(): string | Date {
		return this.props.dateTimePosted;
	}

	get wasUpVotedByMe(): boolean {
		return this.props.wasUpVotedByMe;
	}

	get wasDownVotedByMe(): boolean {
		return this.props.wasDownVotedByMe;
	}

	public static create(props: ArticleDetailsProps): Result<ArticleDetails> {
		const guardArgs: IGuardArgument<any>[] = [
			{ argument: props.author, argumentName: "member" },
			{ argument: props.slug, argumentName: "slug" },
			{ argument: props.title, argumentName: "title" },
			{ argument: props.text, argumentName: "text" },
			{ argument: props.numComments, argumentName: "numComments" },
			{ argument: props.points, argumentName: "points" },
			{ argument: props.dateTimePosted, argumentName: "dateTimePosted" },
		];

		const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

		if (!guardResult.succeeded) {
			return Result.fail<ArticleDetails>(guardResult.message);
		}

		return Result.ok<ArticleDetails>(
			new ArticleDetails({
				...props,
				wasUpVotedByMe: props.wasUpVotedByMe ? props.wasUpVotedByMe : false,
				wasDownVotedByMe: props.wasDownVotedByMe
					? props.wasDownVotedByMe
					: false,
			})
		);
	}
}
