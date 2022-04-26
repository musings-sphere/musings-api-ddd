import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { Article, Author } from "./index";

interface ArticleVoteAttributes extends Timestamp {
	id: string;
	ArticleId: string;
	AuthorId: string;
	type: string;
}

export interface ArticleVoteInput
	extends Optional<ArticleVoteAttributes, "id"> {}

export interface ArticleVoteOutput extends Required<ArticleVoteAttributes> {}

class ArticleVote
	extends Model<ArticleVoteAttributes, ArticleVoteInput>
	implements ArticleVoteAttributes
{
	public id!: string;
	public ArticleId!: string;
	public AuthorId!: string;
	public type!: string;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

ArticleVote.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		ArticleId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "Article",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		AuthorId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "Author",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		type: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
	},
	{
		sequelize,
		paranoid: true,
	}
);

// ArticleVote.belongsTo(Author, {
// 	foreignKey: {
// 		defaultValue: "id",
// 		allowNull: false,
// 	},
// 	targetKey: "AuthorId",
// 	as: "Author",
// });

// ArticleVote.belongsTo(Article, {
// 	foreignKey: {
// 		defaultValue: "id",
// 	},
// 	as: "Article",
// });

export default ArticleVote;
