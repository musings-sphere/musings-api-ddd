import { WatchedList } from "../../../shared/domain";
import { CommentVote } from "./commentVote";

export class CommentVotes extends WatchedList<CommentVote> {
	private constructor(initialVotes: CommentVote[]) {
		super(initialVotes);
	}

	public compareItems(a: CommentVote, b: CommentVote): boolean {
		return a.equals(b);
	}

	public static create(initialVotes?: CommentVote[]): CommentVotes {
		return new CommentVotes(initialVotes ? initialVotes : []);
	}
}
