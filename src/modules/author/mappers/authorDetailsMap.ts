import { Mapper } from "../../../shared/types/mapper";
import { UserName } from "../../users/domain";
import { AuthorDetails } from "../domain";
import { AuthorDTO } from "../dtos";

export class AuthorDetailsMap implements Mapper<AuthorDetails> {
	public static toDomain(raw: any): AuthorDetails {
		const userNameOrError = UserName.create({
			userName: raw.BaseUser.userName,
		});

		const memberDetailsOrError = AuthorDetails.create({
			reputation: raw.reputation,
			userName: userNameOrError.getValue(),
		});

		memberDetailsOrError.isFailure
			? console.error(memberDetailsOrError.error)
			: "";

		return memberDetailsOrError.isSuccess
			? memberDetailsOrError.getValue()
			: null;
	}

	public static toDTO(authorDetails: AuthorDetails): AuthorDTO {
		return {
			reputation: authorDetails.reputation,
			user: {
				userName: authorDetails.userName.value,
			},
		};
	}
}
