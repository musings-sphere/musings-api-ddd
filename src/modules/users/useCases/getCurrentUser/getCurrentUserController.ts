import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../http/models/decodedRequest";
import { UserMap } from "../../mappers/userMap";
import { GetUserByUserName } from "../getUserByUserName/getUserByUserName";

export class GetCurrentUserController extends BaseController {
	private useCase: GetUserByUserName;

	constructor(useCase: GetUserByUserName) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const { userName } = req.decoded;

		try {
			const result = await this.useCase.execute({ userName });

			if (result.isLeft()) {
				return this.fail(res, result.value.errorValue().message);
			} else {
				const user = result.value.getValue();
				return this.ok(res, {
					user: UserMap.toDTO(user),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
