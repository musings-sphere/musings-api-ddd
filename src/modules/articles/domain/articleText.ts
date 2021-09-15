import { Guard, Result } from "../../../shared/core";
import { ValueObject } from "../../../shared/domain";

interface ArticleTextProps {
	value: string;
}

export class ArticleText extends ValueObject<ArticleTextProps> {
	public static minLength: number = 2;
	public static maxLength: number = 100_000;

	get value(): string {
		return this.props.value;
	}

	private constructor(props: ArticleTextProps) {
		super(props);
	}

	public static create(props: ArticleTextProps): Result<ArticleText> {
		const nullGuardResult = Guard.againstNullOrUndefined(
			props.value,
			"postText"
		);

		if (!nullGuardResult.succeeded) {
			return Result.fail<ArticleText>(nullGuardResult.message);
		}

		const minGuardResult = Guard.againstAtLeast(this.minLength, props.value);
		const maxGuardResult = Guard.againstAtMost(this.maxLength, props.value);

		if (!minGuardResult.succeeded) {
			return Result.fail<ArticleText>(minGuardResult.message);
		}

		if (!maxGuardResult.succeeded) {
			return Result.fail<ArticleText>(maxGuardResult.message);
		}

		return Result.ok<ArticleText>(new ArticleText(props));
	}
}
