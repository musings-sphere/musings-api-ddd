import { Source } from "./source";
import {
	AuditableData,
	AuditableEntity, Guard, Result,
	UniqueEntityID,
} from "../../shared/domain";
import { Hasher } from "../../shared/domain/hasher";

export type PostProps = {
	author: string;
	id: UniqueEntityID;
	text: string;
	source: Source | undefined;
	auditableData?: AuditableData;
};

const VALID_LENGTH_AUTHOR = 3;

export class Post extends AuditableEntity {
	private author: string;
	private readonly id: UniqueEntityID;
	private text: string;
	private readonly source: Source | undefined;
	private deletedText = ".xX This post has been deleted Xx.";
	private published = true;
	private hash: string | undefined;

	public constructor(props: PostProps) {
		super(
			props.auditableData ? props.auditableData : { createdBy: props.author }
		);
		this.author = props.author;
		this.id = props.id;
		this.text = props.text;
		this.source = props.source;
	}

	public static create(props: PostProps): Result<Post> {
		const nullOrUndefinedGuard = Guard.againstNullOrUndefinedBulk([
			{ argumentName: "author", argument: props.author },
			{ argumentName: "id", argument: props.id },
			{ argumentName: "text", argument: props.text },
			{ argumentName: "source", argument: props.source },
		]);

		if (!nullOrUndefinedGuard.succeeded) {
			return Result.fail(nullOrUndefinedGuard.message);
		} else {
			if (props.author.length < VALID_LENGTH_AUTHOR) {
				return Result.fail(
					"Post author's name must be longer that 2 characters."
				);
			}
			if (!props.id.isValidId()) {
				return Result.fail("Post must have a valid id.");
			}
		}

		const post = new Post(props);
		post.buildHash();

		return Result.ok<Post>(post);
	}

	public get getAuthor(): string {
		return this.author;
	}

	public get getId(): UniqueEntityID {
		return this.id;
	}

	public get getText(): string {
		return this.text;
	}

	public set setText(newText: string) {
		this.text = newText;
	}

	public get getSource(): Source {
		return <Source>this.source;
	}

	public get getIsDeleted(): boolean {
		return this.deletedText === this.text;
	}

	public get getIsPublished(): boolean {
		return this.published;
	}

	public get getHash(): string {
		return <string>this.hash;
	}

	public publish(): void {
		this.published = true;
	}

	public unPublish(): void {
		this.published = false;
	}

	public markDeleted(): void {
		this.text = this.deletedText;
		this.setLastModifiedAt = new Date();
		this.author = "Deleted";
	}

	public buildHash(): void {
		this.hash = Hasher.createMd5(this.text + this.published + this.author);
	}
}
