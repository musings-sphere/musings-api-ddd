import { User, UserEmail, UserName } from "../domain";

export interface IUserRepo {
	exists(userEmail: UserEmail): Promise<boolean>;
	getUserByUserId(userId: string): Promise<User>;
	getUserByUserName(userName: UserName | string): Promise<User>;
	save(user: User): Promise<void>;
}
