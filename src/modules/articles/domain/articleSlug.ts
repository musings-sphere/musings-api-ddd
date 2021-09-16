import { Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";
import { TextUtils } from "../../../shared/utils";
import slugify from "../../../shared/utils/slugify";
import { ArticleTitle } from "./articleTitle";

export interface ArticleSlugProps {
	value: string;
}

export class ArticleSlug extends ValueObject<ArticleSlugProps> {
	get value(): string {
		return this.props.value;
	}

	private constructor(props: ArticleSlugProps) {
		super(props);
	}

	public static createFromExisting(slugName: string) {
		if (!!slugName === true) {
			return Result.ok<ArticleSlug>(new ArticleSlug({ value: slugName }));
		} else {
			return Result.fail<ArticleSlug>("No slug passed in");
		}
	}

	public static create(articleTitle: ArticleTitle): Result<ArticleSlug> {
		let returnSlug = "";

		// Run the slug algorithm here to create a slug
		// Strip all non alphabetic characters such as . / ; ,
		returnSlug = articleTitle.value.replace(/[\W_]+/g, " ");
		returnSlug =
			TextUtils.createRandomNumericString(7) +
			"-" +
			slugify(articleTitle.value);

		return Result.ok<ArticleSlug>(new ArticleSlug({ value: returnSlug }));
	}
}
