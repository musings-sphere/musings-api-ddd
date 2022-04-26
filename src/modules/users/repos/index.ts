import { User } from "../../../database/models";
import { SequelizeUserRepo } from "./implementations/sequelizeUserRepo";

const userRepo = new SequelizeUserRepo(User);

export { userRepo };
