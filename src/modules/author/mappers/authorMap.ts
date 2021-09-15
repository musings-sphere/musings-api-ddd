import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { UserId, UserName } from "../../users/domain";
import { Author } from "../domain";

export class AuthorMap implements Mapper<Author> {
	public static toDomain(raw: any): Author {
		const userNameOrError = UserName.create({
			userName: raw.BaseUser.userName,
		});
		const userIdOrError = UserId.create(
			new UniqueEntityID(raw.BaseUser.base_user_id)
		);

		const memberOrError = Author.create(
			{
				userName: userNameOrError.getValue(),
				reputation: raw.reputation,
				userId: userIdOrError.getValue(),
			},
			new UniqueEntityID(raw.authorId)
		);

		memberOrError.isFailure ? console.log(memberOrError.error) : "";

		return memberOrError.isSuccess ? memberOrError.getValue() : null;
	}

	public static toPersistence(author: Author): any {
		return {
			authorId: author.authorId.id.toString(),
			userId: author.userId.id.toString(),
			reputation: author.reputation,
		};
	}
}
