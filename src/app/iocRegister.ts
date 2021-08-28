import { InjectionMode, asClass, createContainer } from "awilix";
import { AddPostRepositoryImpl } from "../dataproviders/add-post";
import { AddPost, PostDomain } from "../domain";
import {
	InappropriateModerationImpl,
	SpamModerationImpl,
} from "../shared/dataproviders";

const iocRegister = createContainer({ injectionMode: InjectionMode.CLASSIC });
iocRegister.register({
	postDomain: asClass(PostDomain),

	addPost: asClass(AddPost),

	addPostRepository: asClass(AddPostRepositoryImpl),
	inappropriateStrategy: asClass(InappropriateModerationImpl),
	spamStrategy: asClass(SpamModerationImpl),
});

const postMain = iocRegister.resolve<PostDomain>("postDomain");

export const app = {
	postMain,
	container: iocRegister,
};
