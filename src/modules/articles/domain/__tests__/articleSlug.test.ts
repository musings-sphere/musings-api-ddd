import { Result } from "../../../../shared/core";
import { ArticleSlug } from "../articleSlug";
import { ArticleTitle } from "../articleTitle";

let articleSlug: ArticleSlug;
let articleSlugOrError: Result<ArticleSlug>;
let articleTitle: ArticleTitle;
let articleTitleOrError: Result<ArticleTitle>;

describe("Article slug ", () => {
	it("should be able to create a article slug", () => {
		articleTitleOrError = ArticleTitle.create({
			value: "HTML Developers For Musings",
		});
		expect(articleTitleOrError.isSuccess).toBe(true);
		articleTitle = articleTitleOrError.getValue();
		articleSlugOrError = ArticleSlug.create(articleTitle);
		expect(articleSlugOrError.isSuccess).toBe(true);
		articleSlug = articleSlugOrError.getValue();
		expect(articleSlug.value).toContain("html-developers-for-musings");
	});

	it("should be able to parse out any bad characters not suitable for a slug", () => {
		articleTitleOrError = ArticleTitle.create({
			value: "Mu^si^n#g^^#'s Sphere",
		});
		expect(articleTitleOrError.isSuccess).toBe(true);
		articleTitle = articleTitleOrError.getValue();
		articleSlugOrError = ArticleSlug.create(articleTitle);
		expect(articleSlugOrError.isSuccess).toBe(true);
		articleSlug = articleSlugOrError.getValue();
		expect(articleSlug.value).toContain("musings-sphere");
	});
});
