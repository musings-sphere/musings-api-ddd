import argon2 from "argon2";
import { randomBytes } from "crypto";
import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";

export interface IUserPasswordProps {
	value: string;
	hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
	private constructor(props: IUserPasswordProps) {
		super(props);
	}

	public static minLength: number = 6;

	get value(): string {
		return this.props.value;
	}

	private static isAppropriateLength(password: string): boolean {
		return password.length >= this.minLength;
	}

	/**
	 * @method comparePassword
	 * @desc Compares as plain-text and hashed password.
	 */
	public async comparePassword(plainTextPassword: string): Promise<boolean> {
		let hashed: string;
		if (this.isAlreadyHashed()) {
			hashed = this.props.value;
			return argon2.verify(hashed, plainTextPassword);
		} else {
			return this.props.value === plainTextPassword;
		}
	}

	public isAlreadyHashed(): boolean {
		return this.props.hashed;
	}

	private static hashPassword(password: string): Promise<string> {
		const salt = randomBytes(32);
		return argon2.hash(password, { salt });
	}

	public getHashedValue(): Promise<string> {
		return new Promise((resolve) => {
			if (this.isAlreadyHashed()) {
				return resolve(this.props.value);
			} else {
				return resolve(UserPassword.hashPassword(this.props.value));
			}
		});
	}

	public static create(props: IUserPasswordProps): Result<UserPassword> {
		const propsResult = Guard.againstNullOrUndefined(props.value, "password");

		if (!propsResult.succeeded) {
			return Result.fail<UserPassword>(propsResult.message);
		} else {
			if (!props.hashed) {
				if (!this.isAppropriateLength(props.value)) {
					return Result.fail<UserPassword>(
						"Password doesnt meet criteria [8 chars min]."
					);
				}
			}

			return Result.ok<UserPassword>(
				new UserPassword({
					value: props.value,
					hashed: !!props.hashed === true,
				})
			);
		}
	}
}
