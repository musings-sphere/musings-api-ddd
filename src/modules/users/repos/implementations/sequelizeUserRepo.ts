import { IUserRepo } from "../userRepo";
import { User, UserEmail, UserName } from "../../domain";
import { UserMap } from "../../mappers/userMap";

export class SequelizeUserRepo implements IUserRepo {
  private readonly model: any;

  constructor (models: any) {
    this.model = models;
  }

  async exists (email: UserEmail): Promise<boolean> {
    const BaseUserModel = this.model;
    const baseUser = await BaseUserModel.findOne({
      where: {
        email: email.value
      }
    });
    return !!baseUser === true;
  }

  async getUserByUserName (userName: UserName | string): Promise<User> {
    const BaseUserModel = this.model;
    const baseUser = await BaseUserModel.findOne({
      where: {
        userName: userName instanceof UserName
          ? (<UserName>userName).value
          : userName
      }
    });
    if (!!baseUser === false) throw new Error("User not found.")
    return UserMap.toDomain(baseUser.dataValues);
  }

  async getUserByUserId (userId: string): Promise<User> {
    const BaseUserModel = this.model;
    const baseUser = await BaseUserModel.findOne({
      where: {
        id: userId
      }
    });
    if (!!baseUser === false) throw new Error("User not found.")
    return UserMap.toDomain(baseUser);
  }

  async save (user: User): Promise<void> {
    const UserModel = this.model;
    const exists = await this.exists(user.email);

    if (!exists) {
      const rawSequelizeUser = await UserMap.toPersistence(user);
      await UserModel.create(rawSequelizeUser);
    }

    return;
  }
}
