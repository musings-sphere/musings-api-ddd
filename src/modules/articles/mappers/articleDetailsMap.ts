import { Mapper } from "../../../shared/types/mapper";
import { AuthorDetailsMap } from "../../author/mappers";
import {
	ArticleDetails,
	ArticleSlug,
	ArticleText,
	ArticleTitle,
	ArticleVote,
} from "../domain";
import { ArticleDTO } from "../dtos";
import { ArticleVoteMap } from "./articleVoteMap";

export class ArticleDetailsMap implements Mapper<ArticleDetails> {
	public static toDomain(raw: any): ArticleDetails {
		const slug = ArticleSlug.createFromExisting(raw.slug).getValue();
		const title = ArticleTitle.create({ value: raw.title }).getValue();

		const authorDetails = AuthorDetailsMap.toDomain(raw.Author);

		const votes: ArticleVote[] = raw.Votes
			? raw.Votes.map((v) => ArticleVoteMap.toDomain(v))
			: [];

		const articleDetailsOrError = ArticleDetails.create({
			slug,
			title,
			points: raw.points,
			numComments: raw.total_num_comments,
			dateTimePosted: raw.createdAt,
			author: authorDetails,
			text: ArticleText.create({ value: raw.text }).getValue(),
			wasUpVotedByMe: !!votes.find((v) => v.isUpVote()),
			wasDownVotedByMe: !!votes.find((v) => v.isDownVote()),
		});

		articleDetailsOrError.isFailure
			? console.log(articleDetailsOrError.error)
			: "";

		return articleDetailsOrError.isSuccess
			? articleDetailsOrError.getValue()
			: null;
	}

	public static toDTO(articleDetails: ArticleDetails): ArticleDTO {
		return {
			slug: articleDetails.slug.value,
			title: articleDetails.title.value,
			createdAt: articleDetails.dateTimePosted,
			authorPostedBy: AuthorDetailsMap.toDTO(articleDetails.author),
			numComments: articleDetails.numComments,
			points: articleDetails.points,
			text: articleDetails.text ? articleDetails.text.value : "",
			link: articleDetails.link ? articleDetails.link.url : "",
			wasUpVotedByMe: articleDetails.wasUpVotedByMe,
			wasDownVotedByMe: articleDetails.wasDownVotedByMe,
		};
	}
}
