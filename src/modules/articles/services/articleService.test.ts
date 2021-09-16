import { UniqueEntityID } from "../../../shared/domain";
import { Author, AuthorId } from "../../author/domain";
import { Comment, CommentText, CommentVote } from "../../comments/domain";
import { UserId, UserName } from "../../users/domain";
import { Article, ArticleSlug, ArticleText, ArticleTitle } from "../domain";
import { ArticleService } from "./articleService";

let comment: Comment;
let article: Article;
let articleService: ArticleService;
let articleTitle: ArticleTitle;

let authorIdOne: AuthorId = AuthorId.create(
	new UniqueEntityID("blahblah")
).getValue();

let authorOne: Author = Author.create(
	{
		userName: UserName.create({ userName: "blahblah" }).getValue(),
		userId: UserId.create(new UniqueEntityID("blahblah")).getValue(),
	},
	authorIdOne.id
).getValue();

let authorIdTwo: AuthorId = AuthorId.create(
	new UniqueEntityID("blahblah1")
).getValue();

// @ts-expect-error
let authorTwo: Author = Author.create(
	{
		userName: UserName.create({ userName: "blahblah1" }).getValue(),
		userId: UserId.create(new UniqueEntityID("billybob")).getValue(),
	},
	authorIdTwo.id
).getValue();

let authorOneCommentVotes: CommentVote[];
// @ts-expect-error
let authorTwoCommentVotes: CommentVote[];

beforeEach(() => {
	comment = null;
	article = null;
	articleService = new ArticleService();
	authorOneCommentVotes = [];
	authorTwoCommentVotes = [];
});

test("Comments: Given one member, a downvote to a post without any votes should add one downvote", () => {
	articleTitle = ArticleTitle.create({
		value: "Cool first article!",
	}).getValue();

	article = Article.create({
		title: articleTitle,
		authorId: authorIdOne,
		text: ArticleText.create({
			value: "Wow, this is a sick post!",
		}).getValue(),
		slug: ArticleSlug.create(articleTitle).getValue(),
	}).getValue();

	comment = Comment.create(
		{
			text: CommentText.create({ value: "yeah" }).getValue(),
			authorId: authorIdOne,
			articleId: article.articleId,
		},
		new UniqueEntityID("")
	).getValue();

	// Add comment to post
	article.addComment(comment);

	articleService.downVoteComment(
		article,
		authorOne,
		comment,
		authorOneCommentVotes
	);

	expect(comment.getVotes().getItems().length).toEqual(1);
	expect(comment.getVotes().getItems()[0].isDownVote()).toEqual(true);
	expect(comment.getVotes().getNewItems().length).toEqual(1);
	expect(comment.getVotes().getRemovedItems().length).toEqual(0);
});

// test("Comments: Given one member, several downvotes to an already downvoted post should do nothing.", () => {
// 	articleTitle = PostTitle.create({ value: "Cool first post!" }).getValue();
//
// 	article = Post.create({
// 		title: articleTitle,
// 		memberId: authorIdOne,
// 		type: "text",
// 		text: PostText.create({ value: "Wow, this is a sick post!" }).getValue(),
// 		slug: PostSlug.create(articleTitle).getValue(),
// 	}).getValue();
//
// 	comment = Comment.create(
// 		{
// 			text: CommentText.create({ value: "yeah" }).getValue(),
// 			memberId: authorIdOne,
// 			postId: article.postId,
// 		},
// 		new UniqueEntityID("")
// 	).getValue();
//
// 	// Add comment to post
// 	article.addComment(comment);
//
// 	articleService.downVoteComment(article, authorOne, comment, authorOneCommentVotes);
//
// 	// After it's saved to a repo, we'd return the list again
// 	authorOneCommentVotes = comment
// 		.getVotes()
// 		.getItems()
// 		.filter((v) => v.memberId.equals(authorOne));
// 	expect(authorOneCommentVotes.length).toEqual(1);
//
// 	articleService.downVoteComment(article, authorOne, comment, authorOneCommentVotes);
// 	articleService.downVoteComment(article, authorOne, comment, authorOneCommentVotes);
//
// 	expect(authorOneCommentVotes.length).toEqual(1);
//
// 	expect(comment.getVotes().getItems().length).toEqual(1);
// 	expect(comment.getVotes().getItems()[0].isDownvote()).toEqual(true);
// 	expect(comment.getVotes().getNewItems().length).toEqual(1);
// 	expect(comment.getVotes().getRemovedItems().length).toEqual(0);
// });
//
// test("Comments: Given one member, a downvote to a comment it already upvoted should merely remove the upvote and create no additional downvote", () => {
// 	articleTitle = PostTitle.create({ value: "Cool first post!" }).getValue();
//
// 	article = Post.create({
// 		title: articleTitle,
// 		memberId: authorIdOne,
// 		type: "text",
// 		text: PostText.create({ value: "Wow, this is a sick post!" }).getValue(),
// 		slug: PostSlug.create(articleTitle).getValue(),
// 	}).getValue();
//
// 	comment = Comment.create(
// 		{
// 			text: CommentText.create({ value: "yeah" }).getValue(),
// 			memberId: authorIdOne,
// 			postId: article.postId,
// 		},
// 		new UniqueEntityID("")
// 	).getValue();
//
// 	// Add comment to post
// 	article.addComment(comment);
//
// 	// Create existing upvotes
// 	authorOneCommentVotes = [
// 		CommentVote.createUpvote(authorIdOne, comment.commentId).getValue(),
// 	];
// 	articleService.downVoteComment(article, authorOne, comment, authorOneCommentVotes);
//
// 	expect(comment.getVotes().getRemovedItems().length).toEqual(1);
//
// 	// we don't do two operations, so we should ONLY merely remove the upvote.
// 	expect(comment.getVotes().getNewItems().length).toEqual(0);
// });
