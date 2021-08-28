import {
	InappropriateStrategy,
	SpamStrategy,
	SpamStrategyDTO,
} from "../../shared/domain";
import { Post } from "../entities";

export class HandleModeration {
	private readonly inappropriateStrategy: InappropriateStrategy;
	private readonly spamStrategy: SpamStrategy;

	public constructor(
		inappropriateStrategy: InappropriateStrategy,
		spamStrategy: SpamStrategy
	) {
		this.inappropriateStrategy = inappropriateStrategy;
		this.spamStrategy = spamStrategy;
	}

	public async isQuestionable(post: Post): Promise<boolean> {
		const isInappropriate = await this.moderateInappropriate(post.getText);
		const isSpam = await this.moderateSpam(post);

		return isInappropriate || isSpam;
	}

	private async moderateInappropriate(text: string): Promise<boolean> {
		try {
			return await this.inappropriateStrategy.isInappropriate(text);
		} catch (e) {
			return false;
		}
	}

	private async moderateSpam(post: Post): Promise<boolean> {
		const postSpamDTO: SpamStrategyDTO = {
			text: post.getText,
			author: post.getAuthor,
			createdAt: post.getCreatedAt,
			lastModifiedAt: post.setLastModifiedAt,
			ip: post.getSource.getIp,
			browser: post.getSource.getBrowser,
			referrer: post.getSource.getReferrer,
		};
		try {
			return await this.spamStrategy.isSpam(postSpamDTO);
		} catch (e) {
			return false;
		}
	}
}
