import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";

interface UserNameProps {
	userName: string;
}

export class UserName extends ValueObject<UserNameProps> {
	public static maxLength: number = 15;
	public static minLength: number = 2;

	get value(): string {
		return this.props.userName;
	}

	private constructor(props: UserNameProps) {
		super(props);
	}

	public static create(props: UserNameProps): Result<UserName> {
		const usernameResult = Guard.againstNullOrUndefined(
			props.userName,
			"userName"
		);
		if (!usernameResult.succeeded) {
			return Result.fail<UserName>(usernameResult.message);
		}

		const minLengthResult = Guard.againstAtLeast(
			this.minLength,
			props.userName
		);
		if (!minLengthResult.succeeded) {
			return Result.fail<UserName>(minLengthResult.message);
		}

		const maxLengthResult = Guard.againstAtMost(
			this.maxLength,
			props.userName
		);
		if (!maxLengthResult.succeeded) {
			return Result.fail<UserName>(minLengthResult.message);
		}

		return Result.ok<UserName>(new UserName(props));
	}
}
