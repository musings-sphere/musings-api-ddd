import { Association, DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelizeConnection from "../config";
import { Article, BaseUser } from "./index";

interface AuthorAttributes extends Timestamp {
	id: string;
	userId: string;
	reputation: number;
}

export interface AuthorInput extends Optional<AuthorAttributes, any> {}

export interface AuthorOutput extends Required<AuthorAttributes> {}

class Author
	extends Model<AuthorAttributes, AuthorInput>
	implements AuthorAttributes
{
	public id!: string;
	public userId!: string;
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
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			references: {
				model: "BaseUser",
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
		sequelize: sequelizeConnection,
		timestamps: true,
		paranoid: true,
	}
);

Author.belongsTo(BaseUser, {
	foreignKey: "authorId",
	targetKey: "id",
});

Author.hasMany(Article, {
	sourceKey: "id",
	foreignKey: "authorId",
	// as: "Articles",
});

export default Author;
