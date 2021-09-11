import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { User, UserEmail, UserName, UserPassword } from "../domain";
import { UserDTO } from "../dtos";

export class UserMap implements Mapper<User> {
	public static toDTO(user: User): UserDTO {
		return {
			userName: user.userName.value,
			isEmailVerified: user.isEmailVerified,
			isAdmin: user.isAdmin,
			isDeleted: user.isDeleted,
		};
	}

	public static toDomain(raw: any): User {
		const userNameOrError = UserName.create({ userName: raw.userName });
		const userPasswordOrError = UserPassword.create({
			value: raw.password,
			hashed: true,
		});
		const userEmailOrError = UserEmail.create(raw.email);

		const userName = userNameOrError.getValue();

		const userOrError = User.create(
			{
				userName,
				password: userPasswordOrError.getValue(),
				email: userEmailOrError.getValue(),
				isAdmin: raw.isAdmin,
				isDeleted: raw.isDeleted,
				isEmailVerified: raw.isEmailVerified,
			},
			new UniqueEntityID(raw.id)
		);

		userOrError.isFailure ? console.error(userOrError.error) : "";

		return userOrError.isSuccess ? userOrError.getValue() : null;
	}

	public static async toPersistence(user: User): Promise<any> {
		let password: string = null;
		if (!!user.password === true) {
			if (user.password.isAlreadyHashed()) {
				password = user.password.value;
			} else {
				password = await user.password.getHashedValue();
			}
		}

		return {
			id: user.userId.id.toString(),
			email: user.email.value,
			isEmailVerified: user.isEmailVerified,
			userName: user.userName.value,
			password: password,
			isAdmin: user.isAdmin,
			isDeleted: user.isDeleted,
		};
	}
}
