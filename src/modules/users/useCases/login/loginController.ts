import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../http/models/decodedRequest";
import { LoginDTO, LoginDTOResponse } from "./loginDTO";
import { LoginUseCaseErrors } from "./loginErrors";
import { LoginUserUseCase } from "./loginUseCase";

export class LoginController extends BaseController {
	private useCase: LoginUserUseCase;

	constructor(useCase: LoginUserUseCase) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: LoginDTO = req.body as LoginDTO;

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case LoginUseCaseErrors.UserNameDoesntExistError:
						return this.notFound(res, error.errorValue().message);
					case LoginUseCaseErrors.UserIsNotVerified:
						return this.unauthorized(res, error.errorValue().message);
					case LoginUseCaseErrors.PasswordDoesntMatchError:
						return this.badRequest(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				const dto: LoginDTOResponse =
					result.value.getValue() as LoginDTOResponse;
				return this.ok<LoginDTOResponse>(res, dto, "Login successful");
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
