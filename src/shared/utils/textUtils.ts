import { isIP } from "net";
import sanitizeHtml from "sanitize-html";
import validator from "validator";

export class TextUtils {
	public static isValidIp(ip: string): boolean {
		return isIP(ip) !== 0;
	}

	public static isValidUuid(id: string): boolean {
		return validator.isUUID(id);
	}

	public static isValidMd5(value: string): boolean {
		return validator.isMD5(value);
	}

	public static sanitize(text: string): string {
		return sanitizeHtml(text);
	}

	public static validateWebURL(url: string): boolean {
		return validator.isURL(url);
	}

	public static validateEmailAddress(email: string) {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	public static createRandomNumericString(numberDigits: number): string {
		const chars = "0123456789";
		let value = "";

		for (let i = numberDigits; i > 0; --i) {
			value += chars[Math.round(Math.random() * (chars.length - 1))];
		}

		return value;
	}

	public static validateSlug(slug: string): boolean {
		return validator.isSlug(slug);
	}
}
