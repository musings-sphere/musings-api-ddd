import { Guard, Result } from "../../../shared/core";
import { AggregateRoot, UniqueEntityID } from "../../../shared/domain";
import { UserId, UserName } from "../../users/domain";
import { AuthorId } from "./authorId";
import { AuthorCreated } from "./events";

interface AuthorProps {
	userId: UserId;
	userName: UserName;
	reputation?: number;
}

export class Author extends AggregateRoot<AuthorProps> {
	private constructor(props: AuthorProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get authorId(): AuthorId {
		return AuthorId.create(this._id).getValue();
	}

	get userId(): UserId {
		return this.props.userId;
	}

	get username(): UserName {
		return this.props.userName;
	}

	get reputation(): number {
		return this.props.reputation;
	}

	public static create(
		props: AuthorProps,
		id?: UniqueEntityID
	): Result<Author> {
		const guardResult = Guard.againstNullOrUndefinedBulk([
			{ argument: props.userId, argumentName: "userId" },
			{ argument: props.userName, argumentName: "userName" },
		]);

		if (!guardResult.succeeded) {
			return Result.fail<Author>(guardResult.message);
		}

		const defaultValues: AuthorProps = {
			...props,
			reputation: props.reputation ? props.reputation : 0,
		};

		const author = new Author(defaultValues, id);
		const isNewAuthor = !!id === false;

		if (isNewAuthor) {
			author.addDomainEvent(new AuthorCreated(author));
		}

		return Result.ok<Author>(author);
	}
}
