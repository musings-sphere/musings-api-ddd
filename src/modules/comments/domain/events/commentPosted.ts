import { UniqueEntityID } from "../../../../shared/domain";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { Article } from "../../../articles/domain";
import { Comment } from "../comment";

export class CommentPosted implements IDomainEvent {
	public dateTimeOccurred: Date;
	public article: Article;
	public comment: Comment;

	constructor(article: Article, comment: Comment) {
		this.dateTimeOccurred = new Date();
		this.article = article;
		this.comment = comment;
	}

	getAggregateId(): UniqueEntityID {
		return this.article.id;
	}
}
