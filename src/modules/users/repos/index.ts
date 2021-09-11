import { BaseUser } from "../../../database/models";
import { SequelizeUserRepo } from "./implementations/sequelizeUserRepo";

const userRepo = new SequelizeUserRepo(BaseUser);

export { userRepo };
