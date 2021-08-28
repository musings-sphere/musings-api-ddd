import axios from "axios";
import queryString from "querystring";

export type HttpConfig = {
	data: Record<string, unknown> | string;
	url: string;
	headers?: Record<string, unknown>;
	params?: Record<string, unknown>;
};

export class HttpClientHelper {
	public static async post(
		config: HttpConfig,
		isQueryString = false
	): Promise<unknown> {
		let data;
		if (isQueryString) {
			data = config.data as Record<string, unknown>;
			data = queryString.stringify(data);
		} else {
			data = config.data as string;
		}

		config.data = data;

		return axios({ ...config, method: "post" });
	}
}
