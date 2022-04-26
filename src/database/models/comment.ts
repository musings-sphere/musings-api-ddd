import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { Article, Author, CommentVote } from "./index";

interface CommentAttributes extends Timestamp {
	id: string;
	AuthorId: string;
	ArticleId: string;
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
	public AuthorId!: string;
	public ArticleId!: string;
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
		AuthorId: {
			type: DataTypes.STRING(250),
			allowNull: false,
			references: {
				model: "Author",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		ArticleId: {
			type: DataTypes.STRING(250),
			allowNull: false,
			references: {
				model: "Article",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
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
		sequelize,
		paranoid: true,
	}
);

Author.belongsToMany(Comment, {
	through: Comment,
});

Comment.belongsTo(Article, {
	foreignKey: "id",
	targetKey: "id",
	as: "Article",
});

// Comment.hasMany(CommentVote, {
//   foreignKey: "id",
//   as: "CommentVotes"
// })

export default Comment;
