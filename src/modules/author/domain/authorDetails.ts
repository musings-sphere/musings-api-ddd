import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";
import { UserName } from "../../users/domain";

interface AuthorDetailsProps {
	userName: UserName;
	reputation: number;
	isAdmin?: boolean;
	isDeleted?: boolean;
}

/**
 * @desc Read model for author
 */
export class AuthorDetails extends ValueObject<AuthorDetailsProps> {
	private constructor(props: AuthorDetailsProps) {
		super(props);
	}

	get userName(): UserName {
		return this.props.userName;
	}

	get reputation(): number {
		return this.props.reputation;
	}

	get isAdmin(): boolean {
		return this.props.isAdmin;
	}

	get isDeleted(): boolean {
		return this.props.isDeleted;
	}

	public static create(props: AuthorDetailsProps): Result<AuthorDetails> {
		const guardResult = Guard.againstNullOrUndefinedBulk([
			{ argument: props.userName, argumentName: "userName" },
			{ argument: props.reputation, argumentName: "reputation" },
		]);

		if (!guardResult.succeeded) {
			return Result.fail<AuthorDetails>(guardResult.message);
		}

		return Result.ok<AuthorDetails>(
			new AuthorDetails({
				...props,
				isAdmin: props.isAdmin ? props.isAdmin : false,
				isDeleted: props.isDeleted ? props.isDeleted : false,
			})
		);
	}
}
