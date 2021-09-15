import {
	Changes,
	IWithChanges,
	Result,
	right,
	UseCase,
} from "../../../../shared/core";
import { IArticleRepo } from "../../repos/articleRepo";
import { EditArticleDTO } from "./editArticleDTO";
import { EditArticleResponse } from "./editArticleResponse";

export class EditArticle
	implements
		UseCase<EditArticleDTO, Promise<EditArticleResponse>>,
		IWithChanges
{
	// @ts-expect-error
	private articleRepo: IArticleRepo;
	public changes: Changes<any>;

	constructor(articleRepo: IArticleRepo) {
		this.articleRepo = articleRepo;
		this.changes = new Changes();
	}

	// @ts-expect-error
	public async execute(request: EditArticleDTO): Promise<EditArticleResponse> {
		return right(Result.ok<void>());
	}
}
