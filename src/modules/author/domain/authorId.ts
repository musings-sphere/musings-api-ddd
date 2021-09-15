import { Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";

export class AuthorId extends Entity<any> {
	private constructor(id?: UniqueEntityID) {
		super(null, id);
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	public static create(id?: UniqueEntityID): Result<AuthorId> {
		return Result.ok<AuthorId>(new AuthorId(id));
	}
}
