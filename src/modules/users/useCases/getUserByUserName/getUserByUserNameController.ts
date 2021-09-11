import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../http/models/decodedRequest";
import { GetUserByUserName } from "./getUserByUserName";
import { GetUserByUserNameDTO } from "./getUserByUserNameDTO";
import { GetUserByUserNameErrors } from "./getUserByUserNameErrors";

export class GetUserByUserNameController extends BaseController {
	private useCase: GetUserByUserName;

	constructor(useCase: GetUserByUserName) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetUserByUserNameDTO = req.body as GetUserByUserNameDTO;

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case GetUserByUserNameErrors.UserNotFoundError:
						return this.notFound(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				return this.ok(res);
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
