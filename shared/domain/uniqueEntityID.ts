import { Identifier } from "./identifier";
import { TextUtils } from "../textUtils";
import { v4 as uuidv4 } from "uuid";

export class UniqueEntityID extends Identifier<string | number> {
	public constructor(id?: string | number) {
		super(id ? id : uuidv4());
	}

	public isValidId(): boolean {
		return TextUtils.isValidUuid(this.toString());
	}
}
