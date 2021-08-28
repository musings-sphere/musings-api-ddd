import { Post } from "../../domain";
import { AddPostDTO, AddPostRepository } from "../../domain";
import { mongoHelper } from "../../shared/db";

const collectionName = "posts";

export class AddPostRepositoryImpl implements AddPostRepository {
	public async findByHash(hash: string): Promise<AddPostDTO | null> {
		let postFound;
		const postCollection = await mongoHelper.getCollection(collectionName);
		console.log(
			"Class: AddPostRepositoryImpl, Function: findByHash, Line 11 postCollection():",
			postCollection
		);
		const post = postCollection.find({ hash: hash });
		postFound = await post.toArray();
		if (postFound.length === 0) {
			return null;
		}

		postFound = mongoHelper.map(postFound[0]) as AddPostDTO;

		return postFound;
	}

	public async save(post: Post): Promise<void> {
		console.log(
			"Class: AddPostRepositoryImpl, Function: findByHash, Line 11 postCollection():",
			post
		);
		const postCollection = await mongoHelper.getCollection(collectionName);
		await postCollection.insertOne(this.toPersistence(post));
	}

	public toPersistence(post: Post): Record<string, unknown> {
		return {
			_id: post.getId.toString(),
			author: post.getAuthor,
			text: post.getText,
			hash: post.getHash,
			published: post.getIsPublished,
			createdAt: post.getCreatedAt,
			lastModifiedAt: post.getLastModifiedAt,
			source: {
				ip: post.getSource.getIp,
				browser: post.getSource.getBrowser,
				referrer: post.getSource.getReferrer,
			},
		};
	}
}
