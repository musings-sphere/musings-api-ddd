import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Timestamp } from "../../shared/types/timestamp";
import { fancyID } from "../../shared/utils";
import sequelize from "../config";
import { Author } from "./index";

interface UserAttributes extends Timestamp {
	id: string;
	userName: string;
	email: string;
	password: string;
	isVerified: boolean;
	isAdmin: boolean;
	isDeleted: boolean;
}

export interface UserInput extends Optional<UserAttributes, "id"> {}

export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
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

User.init(
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
		sequelize: sequelize as Sequelize,
		modelName: "User",
		tableName: "User",
		paranoid: true,
		indexes: [{ unique: true, fields: ["email"] }],
	}
);

User.hasOne(Author, {
	sourceKey: "id",
	foreignKey: "UserId",
});

export default User;
