import { DataTypes, Model, Optional } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils/fancyID";
import sequelizeConnection from "../config";

interface BaseUserAttributes extends Timestamp {
	id: string;
	userName: string;
	email: string;
	password: string;
	isEmailVerified: boolean;
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
	public isEmailVerified!: boolean;
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
		isEmailVerified: {
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
	}
);

export default BaseUser;
