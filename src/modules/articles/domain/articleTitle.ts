import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";

interface PostTitleProps {
	value: string;
}

export class ArticleTitle extends ValueObject<PostTitleProps> {
	public static minLength: number = 2;
	public static maxLength: number = 85;

	get value(): string {
		return this.props.value;
	}

	private constructor(props: PostTitleProps) {
		super(props);
	}

	public static create(props: PostTitleProps): Result<ArticleTitle> {
		const nullGuardResult = Guard.againstNullOrUndefined(
			props.value,
			"postTitle"
		);

		if (!nullGuardResult.succeeded) {
			return Result.fail<ArticleTitle>(nullGuardResult.message);
		}

		const minGuardResult = Guard.againstAtLeast(this.minLength, props.value);
		const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

		if (!minGuardResult.succeeded) {
			return Result.fail<ArticleTitle>(minGuardResult.message);
		}

		if (!maxGuardResult.succeeded) {
			return Result.fail<ArticleTitle>(maxGuardResult.message);
		}

		return Result.ok<ArticleTitle>(new ArticleTitle(props));
	}
}
