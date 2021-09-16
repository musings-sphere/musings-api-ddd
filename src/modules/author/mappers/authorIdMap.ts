import { UniqueEntityID } from "../../../shared/domain";
import { Mapper } from "../../../shared/types/mapper";
import { AuthorId } from "../domain";

export class AuthorIdMap implements Mapper<AuthorId> {
	public static toDomain(rawMember: any): AuthorId {
		const memberIdOrError = AuthorId.create(
			new UniqueEntityID(rawMember.authorId)
		);
		return memberIdOrError.isSuccess ? memberIdOrError.getValue() : null;
	}
}
