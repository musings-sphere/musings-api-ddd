import { UniqueEntityID } from "../../../../shared/domain";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { Article } from "../article";

export class ArticleCreated implements IDomainEvent {
	public dateTimeOccurred: Date;
	public article: Article;

	constructor(article: Article) {
		this.dateTimeOccurred = new Date();
		this.article = article;
	}

	getAggregateId(): UniqueEntityID {
		return this.article.id;
	}
}
