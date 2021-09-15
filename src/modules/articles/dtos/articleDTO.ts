import { AuthorDTO } from "../../author/dtos";

export class ArticleDTO {
	slug: string;
	title: string;
	createdAt: string | Date;
	authorPostedBy: AuthorDTO;
	numComments: number;
	points: number;
	text: string;
	link: string;
	wasUpVotedByMe: boolean;
	wasDownVotedByMe: boolean;
}
