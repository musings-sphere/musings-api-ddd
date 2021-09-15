import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelizeConnection from "../config";
import { Article, Author } from "./index";

interface ArticleVoteAttributes extends Timestamp {
	id: string;
	articleId: string;
	authorId: string;
	type: string;
}

export interface ArticleVoteInput
	extends Optional<ArticleVoteAttributes, "id"> {}

export interface ArticleOutput extends Required<ArticleVoteAttributes> {}

class ArticleVote
	extends Model<ArticleVoteAttributes, ArticleVoteInput>
	implements ArticleVoteAttributes
{
	public id!: string;
	public articleId!: string;
	public authorId!: string;
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
		articleId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "Article",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		authorId: {
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
		sequelize: sequelizeConnection,
		paranoid: true,
	}
);

ArticleVote.belongsTo(Author, {
	foreignKey: {
		defaultValue: "id",
		allowNull: false,
	},
	targetKey: "authorId",
	as: "Author",
});

ArticleVote.belongsTo(Article, {
	foreignKey: {
		defaultValue: "id",
	},
	as: "Article",
});

export default ArticleVote;
