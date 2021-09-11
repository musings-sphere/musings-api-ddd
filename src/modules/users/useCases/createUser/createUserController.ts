import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { TextUtils } from "../../../../shared/utils/textUtils";
import { DecodedExpressRequest } from "../../http/models/decodedRequest";
import { CreateUserDTO } from "./createUserDTO";
import { CreateUserErrors } from "./createUserErrors";
import { CreateUserUseCase } from "./createUserUseCase";

export class CreateUserController extends BaseController {
	private useCase: CreateUserUseCase;

	constructor(useCase: CreateUserUseCase) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		let dto: CreateUserDTO = req.body as CreateUserDTO;

		dto = {
			userName: TextUtils.sanitize(dto.userName),
			email: TextUtils.sanitize(dto.email),
			password: dto.password,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case CreateUserErrors.UsernameTakenError:
						return this.conflict(res, error.errorValue().message);
					case CreateUserErrors.EmailAlreadyExistsError:
						return this.conflict(res, error.errorValue().message);
					case CreateUserErrors.InvalidEmailError:
						return this.badRequest(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				return this.created<CreateUserDTO>(
					res,
					dto,
					"User created successfully."
				);
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
