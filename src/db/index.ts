import dotenv from "dotenv";
import { config } from "../config";
import { mongoHelper } from "../shared/db";

dotenv.config();

// database collection will automatically be created if it does not exist
// indexes will only be added if they don't exist
mongoHelper
	.connect(config.mongodb.url)
	.then(async () => {
		console.log("Setting up database...");
		let result;
		result = await mongoHelper.getCollection("posts");
		result = await result.createIndexes([
			{ key: { hash: 1 }, name: "hash_idx" },
			{ key: { postId: -1 }, name: "postId_idx" },
		]);
		console.log(result);
		console.log("Database setup complete...");
		await mongoHelper.disconnect();
		process.exit();
	})
	.catch(console.error);
