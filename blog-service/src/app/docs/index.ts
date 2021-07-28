import { config } from "../../../config";

const {
	api: { prefix },
} = config;

export default {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Blog API",
		description:
			"A minimal and easy to follow example of what you need to create a CRUD style API in NodeJs using TypeScript",
	},
	servers: [
		{
			url: `https:${prefix}`,
			description: "Https protocol",
		},
		{
			url: `https:${prefix}`,
			description: "Http protocol",
		},
	],
	tags: [
		{
			name: "Comments",
			description: "API for comments in blog or wiki system",
		},
	],
};
