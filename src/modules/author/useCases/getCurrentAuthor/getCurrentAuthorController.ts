import { Response } from "express";
import { BaseController } from "../../../../app/models";
import { DecodedExpressRequest } from "../../../users/http/models/decodedRequest";
import { AuthorDetailsMap } from "../../mappers";
import { GetAuthorByUserName } from "../getAuthorByUserName/getAuthorByUserName";
import { GetAuthorByUserNameResponseDTO } from "../getAuthorByUserName/getAuthorByUserNameResponseDTO";

export class GetCurrentAuthorController extends BaseController {
	private useCase: GetAuthorByUserName;

	constructor(useCase: GetAuthorByUserName) {
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
				const authorDetails = result.value.getValue();

				return this.ok<GetAuthorByUserNameResponseDTO>(res, {
					author: AuthorDetailsMap.toDTO(authorDetails),
				});
			}
		} catch (err) {
			return this.fail(res, err as Error);
		}
	}
}
