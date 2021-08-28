import { config } from "../../../config";
import { InappropriateStrategy } from "../../domain";
import { HttpClientHelper } from "../../httpClientHelper";

const { key, url } = config.moderator;

export type InappropriateApiResponse = {
	OriginalText: string;
	Classification?: {
		ReviewRecommended: boolean;
	};
};

export class InappropriateModerationImpl implements InappropriateStrategy {
	public async isInappropriate(text: string): Promise<boolean> {
		let response;
		const httpConfig = {
			url,
			data: text,
			params: { classify: "true" },
			headers: {
				"Content-Type": "text/html",
				"Ocp-Apim-Subscription-Key": key,
			},
		};

		response = await HttpClientHelper.post(httpConfig);
		response = response.data as InappropriateApiResponse;

		if (response.Classification) {
			return response.Classification.ReviewRecommended;
		}

		return false;
	}
}
