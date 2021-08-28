import { Guard, Result } from "../../shared/domain";
import { TextUtils } from "../../shared/textUtils";

export class Source {
	private readonly ip: string;
	private readonly browser: string;
	private readonly referer: string;

	private constructor(ip: string, browser: string, referrer: string) {
		this.ip = ip;
		this.browser = browser;
		this.referer = referrer;
	}

	public get getIp(): string {
		return this.ip;
	}

	public get getBrowser(): string {
		return this.browser;
	}

	public get getReferrer(): string {
		return this.referer;
	}

	public static create(
		ip: string,
		browser: string,
		referrer: string
	): Result<Source> {
		const ipGuardResult = Guard.againstNullOrUndefined(ip, "ip");
		if (!ipGuardResult.succeeded) {
			return Result.fail(ipGuardResult.message);
		}

		if (!TextUtils.isValidIp(ip)) {
			return Result.fail("Post source must contain a valid IP.");
		}

		const source = new Source(ip, browser, referrer);

		return Result.ok<Source>(source);
	}
}
