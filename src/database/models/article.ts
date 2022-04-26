import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { ArticleVote, Author } from "./index";

interface ArticleAttributes extends Timestamp {
	id: string;
	AuthorId: string;
	slug: string;
	title: string;
	description: string;
	body: string;
	// category: string[];
	// tagList: string[];
	// authorId: string;
}

export interface ArticleInput
	extends Optional<ArticleAttributes, "id" | "slug"> {}

export interface ArticleOutput extends Required<ArticleAttributes> {}

class Article
	extends Model<ArticleAttributes, ArticleInput>
	implements ArticleAttributes
{
	public id!: string;
	public AuthorId!: string;
	public slug!: string;
	public title!: string;
	public description!: string;
	public body!: string;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

Article.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		AuthorId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		slug: {
			type: DataTypes.STRING(300),
			allowNull: false,
			unique: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		body: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		sequelize: sequelize as Sequelize,
		modelName: "Article",
		tableName: "Article",
		timestamps: true,
		paranoid: true,
	}
);

// Article.belongsTo(Author, {
// 	foreignKey: "id",
// 	targetKey: "id",
// });

// Article.hasMany(ArticleVote, {
// 	sourceKey: "id",
// 	foreignKey: "ArticleId",
// });

export default Article;
