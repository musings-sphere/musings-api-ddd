import { Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";

export class CommentId extends Entity<any> {
	private constructor(id?: UniqueEntityID) {
		super(null, id);
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	public static create(id?: UniqueEntityID): Result<CommentId> {
		return Result.ok<CommentId>(new CommentId(id));
	}
}
