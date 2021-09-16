import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelizeConnection from "../config";

// import { Article, Author, CommentVote } from "./index";

interface CommentAttributes extends Timestamp {
	id: string;
	authorId: string;
	articleId: string;
	parentCommentId: string;
	text: string;
	points: number;
}

export interface CommentInput extends Optional<CommentAttributes, "id"> {}

export interface ArticleOutput extends Required<CommentAttributes> {}

class Comment
	extends Model<CommentAttributes, CommentInput>
	implements CommentAttributes
{
	public id!: string;
	public authorId!: string;
	public articleId!: string;
	public parentCommentId!: string;
	public text!: string;
	public points!: number;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

Comment.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		authorId: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		articleId: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		parentCommentId: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		points: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: true,
	}
);

// Comment.belongsTo(Author, {
//   foreignKey: "id",
//   targetKey: "authorId",
//   as: "Author"
// })
//
// Comment.belongsTo(Article, {
//   foreignKey: "id",
//   targetKey: "articleId",
//   as: "Article"
// })
//
// Comment.hasMany(CommentVote, {
//   foreignKey: "id",
//   as: "CommentVotes"
// })

export default Comment;
