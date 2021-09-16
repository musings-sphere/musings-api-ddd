import { WatchedList } from "../../../shared/domain";
import { ArticleVote } from "./articleVote";

export class ArticleVotes extends WatchedList<ArticleVote> {
	private constructor(initialVotes: ArticleVote[]) {
		super(initialVotes);
	}

	public compareItems(a: ArticleVote, b: ArticleVote): boolean {
		return a.equals(b);
	}

	public static create(initialVotes?: ArticleVote[]): ArticleVotes {
		return new ArticleVotes(initialVotes ? initialVotes : []);
	}
}
