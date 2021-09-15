import { Op } from "sequelize";
import { Author, AuthorDetails, AuthorId } from "../../domain";
import { AuthorDetailsMap, AuthorIdMap, AuthorMap } from "../../mappers";
import { IAuthorRepo } from "../authorRepo";

export class SequelizeAuthorRepo implements IAuthorRepo {
	private readonly models: any;

	constructor(models: any) {
		this.models = models;
	}

	private createBaseQuery(): any {
		const models = this.models;
		return {
			where: {},
			include: [{ model: models.BaseUser, as: "BaseUser" }],
		};
	}

	public async exists(userId: string): Promise<boolean> {
		const MemberModel = this.models.Member;
		const baseQuery = this.createBaseQuery();
		baseQuery.where["userId"] = userId;
		const author = await MemberModel.findOne(baseQuery);
		return !!author === true;
	}

	public async getAuthorDetailsByArticleLinkOrSlug(
		linkOrSlug: string
	): Promise<AuthorDetails> {
		const AuthorModel = this.models.Author;
		const baseQuery = this.createBaseQuery();
		baseQuery.include.push({
			model: this.models.Article,
			as: "Article",
			required: true,
			where: {
				[Op.or]: {
					slug: { [Op.eq]: linkOrSlug },
					link: { [Op.eq]: linkOrSlug },
				},
			},
		});
		const author = await AuthorModel.findOne(baseQuery);
		const found = !!author === true;
		if (!found) throw new Error("Author not found");

		return AuthorDetailsMap.toDomain(author);
	}

	public async getAuthorIdByUserId(userId: string): Promise<AuthorId> {
		const AuthorModel = this.models.Author;
		const baseQuery = this.createBaseQuery();
		baseQuery.where["authorId"] = userId;
		const author = await AuthorModel.findOne(baseQuery);
		const found = !!author === true;
		if (!found) throw new Error("Author id not found");

		return AuthorIdMap.toDomain(author);
	}

	public async getAuthorByUserId(userId: string): Promise<Author> {
		const AuthorModel = this.models.Author;
		const baseQuery = this.createBaseQuery();
		baseQuery.where["authorId"] = userId;
		const author = await AuthorModel.findOne(baseQuery);
		const found = !!author === true;
		if (!found) throw new Error("Author not found");

		return AuthorMap.toDomain(author);
	}

	public async getAuthorByUserName(userName: string): Promise<Author> {
		const AuthorModel = this.models.Author;
		const baseQuery = this.createBaseQuery();
		baseQuery.include[0].where = {
			userName: userName,
		};
		const author = await AuthorModel.findOne(baseQuery);
		const found = !!author === true;
		if (!found) throw new Error("Author not found");

		return AuthorMap.toDomain(author);
	}

	public async getAuthorDetailsByUserName(
		userName: string
	): Promise<AuthorDetails> {
		const AuthorModel = this.models.Author;
		const baseQuery = this.createBaseQuery();
		baseQuery.include[0].where = {
			userName: userName,
		};
		const author = await AuthorModel.findOne(baseQuery);
		const found = !!author === true;
		if (!found) throw new Error("Author not found");

		return AuthorDetailsMap.toDomain(author);
	}

	public async save(author: Author): Promise<void> {
		const AuthorModel = this.models.Author;
		const exists = await this.exists(author.userId.id.toString());

		if (!exists) {
			const rawSequelizeAuthor = await AuthorMap.toPersistence(author);
			await AuthorModel.create(rawSequelizeAuthor);
		}

		return;
	}
}
