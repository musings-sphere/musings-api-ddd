export type AddPostRequestDTO = {
	author: string;
	text: string;
	ip: string;
	browser?: string;
	referer?: string;
};
