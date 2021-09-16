import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { AuthorDetailsMap } from "../../mappers";
import { GetAuthorByUserName } from "./getAuthorByUserName";
import { GetAuthorByUserNameDTO } from "./getAuthorByUserNameDTO";
import { GetAuthorByUserNameErrors } from "./getAuthorByUserNameErrors";
import { GetAuthorByUserNameResponseDTO } from "./getAuthorByUserNameResponseDTO";

export class GetAuthorByUserNameController extends BaseController {
	private useCase: GetAuthorByUserName;

	constructor(useCase: GetAuthorByUserName) {
		super();
		this.useCase = useCase;
	}

	async executeImpl(req: DecodedExpressRequest, res: Response): Promise<any> {
		const dto: GetAuthorByUserNameDTO = {
			userName: req.params.userName,
		};

		try {
			const result = await this.useCase.execute(dto);

			if (result.isLeft()) {
				const error = result.value;

				switch (error.constructor) {
					case GetAuthorByUserNameErrors.AuthorNotFoundError:
						return this.notFound(res, error.errorValue().message);
					default:
						return this.fail(res, error.errorValue().message);
				}
			} else {
				const memberDetails = result.value.getValue();

				return this.ok<GetAuthorByUserNameResponseDTO>(res, {
					author: AuthorDetailsMap.toDTO(memberDetails),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
