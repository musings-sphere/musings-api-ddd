import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelizeConnection from "../config";
import { Author } from "./index";

interface BaseUserAttributes extends Timestamp {
	id: string;
	userName: string;
	email: string;
	password: string;
	isVerified: boolean;
	isAdmin: boolean;
	isDeleted: boolean;
}

export interface BaseUserInput extends Optional<BaseUserAttributes, any> {}

export interface BaseUserOutput extends Required<BaseUserAttributes> {}

class BaseUser
	extends Model<BaseUserAttributes, BaseUserInput>
	implements BaseUserAttributes
{
	public id!: string;
	public userName!: string;
	public email!: string;
	public password!: string;
	public isVerified!: boolean;
	public isAdmin!: boolean;
	public isDeleted!: boolean;

	// timestamps!
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
}

BaseUser.init(
	{
		id: {
			type: DataTypes.STRING,
			defaultValue: fancyID.generate(),
			allowNull: false,
			primaryKey: true,
		},
		userName: {
			type: DataTypes.STRING(250),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(250),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		isDeleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: true,
		indexes: [{ unique: true, fields: ["email"] }],
	}
);

BaseUser.hasOne(Author, {
	sourceKey: "id",
	foreignKey: "userId",
});

export default BaseUser;
