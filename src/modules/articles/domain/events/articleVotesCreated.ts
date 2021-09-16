import { UniqueEntityID } from "../../../../shared/domain";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { Article } from "../article";
import { ArticleVote } from "../articleVote";

export class ArticleVotesChanged implements IDomainEvent {
	public dateTimeOccurred: Date;
	public article: Article;
	public vote: ArticleVote;

	constructor(article: Article, vote: ArticleVote) {
		this.dateTimeOccurred = new Date();
		this.article = article;
		this.vote = vote;
	}

	getAggregateId(): UniqueEntityID {
		return this.article.id;
	}
}
