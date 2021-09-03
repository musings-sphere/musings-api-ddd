import { Result } from "./result";

export interface IWithChanges {
	changes: Changes<unknown>;
}

export class Changes<T> {
	private readonly changes: Result<unknown>[];

	constructor() {
		this.changes = [];
	}

	public addChange(result: Result<T>): void {
		this.changes.push(result);
	}

	public getChangeResult(): Result<unknown> {
		return Result.combine(this.changes);
	}
}
