import { Post } from "../entities";
import { AddPostDTO } from "./addPostResponseDTO";

export interface AddPostRepository {
	findByHash(hash: string): Promise<AddPostDTO | null>;
	save(post: Post): Promise<void>;
}
