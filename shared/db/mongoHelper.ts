import { Collection, MongoClient, ObjectId } from "mongodb";
import { config } from "../config";

type MongoObjectId = { _id: ObjectId };

export const mongoHelper = {
	client: null as MongoClient,
	url: config.mongodb.url,
	dbName: config.mongodb.name,

	async connect(url: string, dbName?: string): Promise<void> {
		this.url = url;
		this.client = await MongoClient.connect(url);
		if (dbName) {
			this.dbName = dbName;
			this.client.db(dbName);
		}
	},

	async disconnect(): Promise<void> {
		await this.client.close();
		this.client = null;
		this.dbName = null;
	},

	async getCollection(name: string): Promise<Collection> {
		return this.client.db(this.dbName).collection(name);
	},

	map: (data: Partial<MongoObjectId>): Record<string, unknown> => {
		const { _id, ...rest } = data;

		return Object.assign({}, rest, { id: _id });
	},

	mapCollection: (collection: unknown[]): unknown[] => {
		return collection.map((c) => mongoHelper.map(c));
	},
};
