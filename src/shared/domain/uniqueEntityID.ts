import { fancyID } from "../utils/fancyID";
import { TextUtils } from "../utils/textUtils";
import { Identifier } from "./identifier";

export class UniqueEntityID extends Identifier<string> {
	public constructor(id?: string) {
		super(id ? id : (fancyID.generate() as unknown as string));
	}

	public isValidId(): boolean {
		return TextUtils.isValidUuid(this.toString());
	}
}
