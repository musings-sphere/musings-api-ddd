import { AppLogger } from "../logger";
import { Entity } from "./entity";
import { IDomainEvent } from "./events/IDomainEvent";
import { DomainEvents } from "./events/domainEvents";
import { UniqueEntityID } from "./uniqueEntityID";

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: IDomainEvent[] = [];
	public logger = new AppLogger(AggregateRoot.name);

	get id(): UniqueEntityID {
		return this._id;
	}

	get domainEvents(): IDomainEvent[] {
		return this._domainEvents;
	}

	protected addDomainEvent(domainEvent: IDomainEvent): void {
		// Add the domain event to this aggregate's list of domain events
		this._domainEvents.push(domainEvent);
		// Add this aggregate instance to the domain event's list of aggregates who's
		// events it eventually needs to dispatch.
		DomainEvents.markAggregateForDispatch(this);
		// Log the domain event
		this.logDomainEventAdded(domainEvent);
	}

	public clearEvents(): void {
		this._domainEvents.splice(0, this._domainEvents.length);
	}

	private logDomainEventAdded(domainEvent: IDomainEvent): void {
		const thisClass = Reflect.getPrototypeOf(this);
		const domainEventClass = Reflect.getPrototypeOf(domainEvent);
		this.logger.log(
			`[Domain Event Created]:, ${thisClass.constructor.name}, ==>, ${domainEventClass.constructor.name}`
		);
	}
}
