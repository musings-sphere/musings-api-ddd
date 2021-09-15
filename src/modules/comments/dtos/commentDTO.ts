import { AuthorDTO } from "../../author/dtos";

export class CommentDTO {
	postSlug: string;
	articleTitle: string;
	commentId: string;
	parentCommentId?: string;
	text: string;
	author: AuthorDTO;
	createdAt: string | Date;
	childComments: CommentDTO[];
	points: number;
	wasUpVotedByMe: boolean;
	wasDownVotedByMe: boolean;
}
