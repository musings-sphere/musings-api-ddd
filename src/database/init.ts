import { config } from "../config";
import {
	Article,
	Author,
	User,
	Comment,
	CommentVote,
	ArticleVote,
} from "./models";

const { isDev } = config;

const dbInit = async (): Promise<void> => {
	await Article.sync({ alter: isDev });
	await User.sync({ alter: isDev });
	await Author.sync({ alter: isDev });
	await ArticleVote.sync({ alter: isDev });
	await Comment.sync({ alter: isDev });
	await CommentVote.sync({ alter: isDev });
};

export default dbInit;
