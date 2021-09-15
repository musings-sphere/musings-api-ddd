import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";
import { TextUtils } from "../../../shared/utils";

interface ArticleLinkProps {
	url: string;
}

export class ArticleLink extends ValueObject<ArticleLinkProps> {
	get url(): string {
		return this.props.url;
	}

	private constructor(props: ArticleLinkProps) {
		super(props);
	}

	public static create(props: ArticleLinkProps): Result<ArticleLink> {
		const nullGuard = Guard.againstNullOrUndefined(props.url, "url");

		if (!nullGuard.succeeded) {
			return Result.fail<ArticleLink>(nullGuard.message);
		}

		if (!TextUtils.validateWebURL(props.url)) {
			return Result.fail<ArticleLink>(`Url {${props.url}} is not valid.`);
		}

		return Result.ok<ArticleLink>(new ArticleLink(props));
	}
}
