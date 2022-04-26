import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { Article, Author } from "./index";

interface CommentAttributes extends Timestamp {
	id: string;
	CommentId: string;
	AuthorId: string;
	type: string;
}

export interface CommentInput extends Optional<CommentAttributes, "id"> {}

export interface ArticleOutput extends Required<CommentAttributes> {}

class CommentVote
	extends Model<CommentAttributes, CommentInput>
	implements CommentAttributes
{
	public id!: string;
	public CommentId!: string;
	public AuthorId!: string;
	public type!: string;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

CommentVote.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		CommentId: {
			type: DataTypes.STRING,
			allowNull: false,
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		AuthorId: {
			type: DataTypes.STRING,
			allowNull: false,
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

// CommentVote.belongsTo(Author, {
// 	foreignKey: {
// 		allowNull: false,
// 	},
// 	targetKey: "AuthorId",
// 	as: "Author",
// });
//
// CommentVote.belongsTo(Article, {
// 	foreignKey: {
// 		allowNull: false,
// 	},
// 	targetKey: "ArticleId",
// 	as: "Article",
// });

export default CommentVote;
