import { UniqueEntityID } from "../../../../shared/domain";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { Author } from "../author";

export class AuthorCreated implements IDomainEvent {
	public dateTimeOccurred: Date;
	public author: Author;

	constructor(author: Author) {
		this.dateTimeOccurred = new Date();
		this.author = author;
	}

	getAggregateId(): UniqueEntityID {
		return this.author.id;
	}
}
