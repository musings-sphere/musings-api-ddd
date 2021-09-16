import { userRepo } from "../../../users/repos";
import { authorRepo } from "../../repo";
import { CreateAuthor } from "./createAuthor";

const createMember = new CreateAuthor(userRepo, authorRepo);

export { createMember };
