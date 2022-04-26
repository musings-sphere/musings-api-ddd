import { Association, DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { Article, User } from "./index";

interface AuthorAttributes extends Timestamp {
	id: string;
	UserId: string;
	reputation: number;
}

export interface AuthorInput extends Optional<AuthorAttributes, "id"> {}

export interface AuthorOutput extends Required<AuthorAttributes> {}

class Author extends Model<AuthorAttributes> implements AuthorAttributes {
	public id!: string;
	public UserId!: string;
	public reputation!: number;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;

	public static associations: {
		articles: Association<Author, Article>;
	};
}

Author.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		UserId: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: "User",
				key: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		},
		reputation: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	},
	{
		sequelize: sequelize as Sequelize,
		modelName: "Author",
		tableName: "Author",
		timestamps: true,
		paranoid: true,
	}
);

// Author.belongsTo(User, {
// 	foreignKey: "authorId",
// 	targetKey: "id",
// });

Author.hasMany(Article, {
	sourceKey: "id",
	foreignKey: "AuthorId",
	// as: "Articles",
});

export default Author;
