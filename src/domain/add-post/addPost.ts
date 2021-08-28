import {
	Guard,
	InappropriateStrategy,
	Result,
	SpamStrategy,
	UniqueEntityID,
	UseCase,
} from "../../shared/domain";
import { UnexpectedError } from "../../shared/domain/unexpectedError";
import { Post, PostProps, Source } from "../entities";
import { HandleModeration } from "../handle-moderation";
import { AddPostRepository } from "./addPostRepository";
import { AddPostRequestDTO } from "./addPostRequestDTO";
import { AddPostDTO, AddPostResponseDTO } from "./addPostResponseDTO";

export class AddPost
	implements UseCase<AddPostRequestDTO, AddPostResponseDTO>
{
	private addPostRepository: AddPostRepository;
	private readonly inappropriateStrategy: InappropriateStrategy;
	private readonly spamStrategy: SpamStrategy;
	private post: Post;

	public constructor(
		addPostRepository: AddPostRepository,
		inappropriateStrategy: InappropriateStrategy,
		spamStrategy: SpamStrategy
	) {
		this.addPostRepository = addPostRepository;
		this.inappropriateStrategy = inappropriateStrategy;
		this.spamStrategy = spamStrategy;
	}

	public async execute(
		request: AddPostRequestDTO
	): Promise<AddPostResponseDTO> {
		const entitiesErrors = this.getEntitiesErrors(request);
		const guardErrors = Guard.againstNullOrUndefined(
			entitiesErrors,
			"entitiesErrors"
		);
		if (guardErrors.succeeded) {
			return entitiesErrors as Result<void>;
		}

		try {
			const existPost = await this.addPostRepository.findByHash(
				this.post.getHash
			);
			const guardExistPost = Guard.againstNullOrUndefined(
				existPost,
				"existPost"
			);
			if (guardExistPost.succeeded) {
				return Result.ok<AddPostDTO>(existPost as AddPostDTO);
			}

			const handleModeration = new HandleModeration(
				this.inappropriateStrategy,
				this.spamStrategy
			);
			if (await handleModeration.isQuestionable(this.post)) {
				this.post.unPublish();
			} else {
				this.post.publish();
			}

			await this.addPostRepository.save(this.post);

			return Result.ok<AddPostDTO>(this.buildPostDTO());
		} catch (e) {
			console.error(e);

			return new UnexpectedError();
		}
	}

	private buildPostDTO(): AddPostDTO {
		return {
			id: this.post.getId.toString(),
			author: this.post.getAuthor,
			text: this.post.getText,
			createdAt: this.post.getCreatedAt,
			lastModifiedAt: this.post.getLastModifiedAt,
			published: this.post.getIsPublished,
			hash: this.post.getHash,
		};
	}

	private getEntitiesErrors(request: AddPostRequestDTO): Result<void> | null {
		const sourceOrError = Source.create(
			request.ip,
			request.browser as string,
			request.referer as string
		);
		if (!sourceOrError.isSuccess) {
			return Result.fail(sourceOrError.error);
		}

		const postProps: PostProps = {
			id: new UniqueEntityID(),
			author: request.author,
			text: request.text,
			source: sourceOrError.getValue,
		};

		const postOrError = Post.create(postProps);
		if (!postOrError.isSuccess) {
			return Result.fail(postOrError.error);
		}

		this.post = postOrError.getValue;

		return null;
	}
}
