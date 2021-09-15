import { Author, AuthorDetails, AuthorId } from "../domain";

export interface IAuthorRepo {
	exists(userId: string): Promise<boolean>;
	getAuthorByUserId(userId: string): Promise<Author>;
	getAuthorIdByUserId(userId: string): Promise<AuthorId>;
	getAuthorByUserName(userName: string): Promise<Author>;
	getAuthorDetailsByUserName(username: string): Promise<AuthorDetails>;
	getAuthorDetailsByArticleLinkOrSlug(slug: string): Promise<AuthorDetails>;
	save(member: Author): Promise<void>;
}
