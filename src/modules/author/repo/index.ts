import { Author } from "../../../database/models";
import { SequelizeAuthorRepo } from "./implementations/sequelizeAuthorRepo";

const authorRepo = new SequelizeAuthorRepo(Author);

export { authorRepo };
