import { Result } from "../../../shared/core";
import { Entity, UniqueEntityID } from "../../../shared/domain";

export class ArticleId extends Entity<any> {
	get id(): UniqueEntityID {
		return this._id;
	}

	private constructor(id?: UniqueEntityID) {
		super(null, id);
	}

	public static create(id?: UniqueEntityID): Result<ArticleId> {
		return Result.ok<ArticleId>(new ArticleId(id));
	}
}
