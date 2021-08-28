import { Result } from "../../shared/domain";

export type AddPostResponseDTO = Result<AddPostDTO> | Result<void>;
export type AddPostDTO = {
	id: string;
	author: string;
	text: string;
	createdAt: Date;
	postId?: string;
	published: boolean;
	hash: string;
	lastModifiedAt: Date;
};
