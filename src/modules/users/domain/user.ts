import { Guard, Result } from "../../../shared/core";
import { AggregateRoot, UniqueEntityID } from "../../../shared/domain";
import { UserCreated, UserDeleted, UserLoggedIn } from "./events";
import { JWTToken, RefreshToken } from "./jwt";
import { UserEmail } from "./userEmail";
import { UserId } from "./userId";
import { UserName } from "./userName";
import { UserPassword } from "./userPassword";

interface UserProps {
	email: UserEmail;
	userName: UserName;
	password: UserPassword;
	isEmailVerified?: boolean;
	isAdmin?: boolean;
	accessToken?: JWTToken;
	refreshToken?: RefreshToken;
	isDeleted?: boolean;
	lastLogin?: Date;
}

export class User extends AggregateRoot<UserProps> {
	private constructor(props: UserProps, id?: UniqueEntityID) {
		super(props, id);
	}

	get userId(): UserId {
		return UserId.create(this._id).getValue();
	}

	get email(): UserEmail {
		return this.props.email;
	}

	get userName(): UserName {
		return this.props.userName;
	}

	get password(): UserPassword {
		return this.props.password;
	}

	get accessToken(): string {
		return this.props.accessToken;
	}

	get isDeleted(): boolean {
		return this.props.isDeleted;
	}

	get isEmailVerified(): boolean {
		return this.props.isEmailVerified;
	}

	get isAdmin(): boolean {
		return this.props.isAdmin;
	}

	get lastLogin(): Date {
		return this.props.lastLogin;
	}

	get refreshToken(): RefreshToken {
		return this.props.refreshToken;
	}

	public isLoggedIn(): boolean {
		return !!this.props.accessToken && !!this.props.refreshToken;
	}

	public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
		this.addDomainEvent(new UserLoggedIn(this));
		this.props.accessToken = token;
		this.props.refreshToken = refreshToken;
		this.props.lastLogin = new Date();
	}

	public delete(): void {
		if (!this.props.isDeleted) {
			this.addDomainEvent(new UserDeleted(this));
			this.props.isDeleted = true;
		}
	}

	public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
		const guardResult = Guard.againstNullOrUndefinedBulk([
			{ argument: props.userName, argumentName: "userName" },
			{ argument: props.email, argumentName: "email" },
		]);

		if (!guardResult.succeeded) {
			return Result.fail<User>(guardResult.message);
		}

		const isNewUser = !!id === false;
		const user = new User(
			{
				...props,
				isDeleted: props.isDeleted ? props.isDeleted : false,
				isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
				isAdmin: props.isAdmin ? props.isAdmin : false,
			},
			id
		);

		if (isNewUser) {
			user.addDomainEvent(new UserCreated(user));
		}

		return Result.ok<User>(user);
	}
}
