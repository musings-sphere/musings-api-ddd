import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../http/models/decodedRequest";
import { DeleteUserDTO } from "./deleteUserDTO";
import { DeleteUserErrors } from "./deleteUserErrors";
import { DeleteUserUseCase } from "./deleteUserUseCase";

export class DeleteUserController extends BaseController {
	private useCase: DeleteUserUseCase;

	constructor(useCase: DeleteUserUseCase) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: DeleteUserDTO = req.body as DeleteUserDTO;

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case DeleteUserErrors.UserNotFoundError:
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
