export class QueryBuilder {
	private readonly query = [];

	public match(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$match", data);
	}

	public group(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$group", data);
	}

	public sort(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$sort", data);
	}

	public unwind(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$unwind", data);
	}

	public lookup(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$lookup", data);
	}

	public project(data: Record<string, unknown>): QueryBuilder {
		return this.addStep("$project", data);
	}

	public build(): Record<string, unknown>[] {
		return this.query;
	}

	private addStep(step: string, data: Record<string, unknown>): QueryBuilder {
		this.query.push({
			[step]: data,
		});

		return this;
	}
}
