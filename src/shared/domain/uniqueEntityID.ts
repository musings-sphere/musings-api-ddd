import { v4 as uuidv4 } from "uuid";
import { TextUtils } from "../utils/textUtils";
import { Identifier } from "./identifier";

export class UniqueEntityID extends Identifier<string | number> {
	public constructor(id?: string | number) {
		super(id ? id : uuidv4());
	}

	public isValidId(): boolean {
		return TextUtils.isValidUuid(this.toString());
	}
}
