import { Response, Request } from "express";
import { BaseController } from "../../../../app/models";
import { JWTToken } from "../../domain/jwt";
import { LoginDTOResponse } from "../login/loginDTO";
import { RefreshAccessTokenDTO } from "./refreshAccessTokenDTO";
import { RefreshAccessTokenErrors } from "./refreshAccessTokenErrors";
import { RefreshAccessTokenUseCase } from "./refreshAccessTokenUseCase";

export class RefreshAccessTokenController extends BaseController {
	private useCase: RefreshAccessTokenUseCase;

	constructor(useCase: RefreshAccessTokenUseCase) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: Request, res: Response): Promise<any> {
		const dto: RefreshAccessTokenDTO = req.body as RefreshAccessTokenDTO;

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case RefreshAccessTokenErrors.RefreshTokenNotFound:
						return this.notFound(res, error.errorValue().message);
					case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
						return this.notFound(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				const accessToken: JWTToken = result.value.getValue() as JWTToken;
				return this.ok<LoginDTOResponse>(res, {
					refreshToken: dto.refreshToken,
					accessToken: accessToken,
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
