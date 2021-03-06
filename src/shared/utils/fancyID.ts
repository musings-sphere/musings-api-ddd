export interface FancyID {
	generate(): string;
	timestamp(uid: string, asDate?: boolean): number | Date;
}

/**
 *
 * Generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide.
 * 3. They sort *lexicographically* (timestamp converted to chars which will sort)
 * 4. They're monotonically increasing. This is done by storing previous random bits
 *    increasing them only by one.
 */

// ASCII ordered base64 web safe chars.
const ASCII_CHARS =
	"-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";

export const fancyID: FancyID = {
	/**
	 * Generate
	 * Generates uid push identifier.
	 */
	generate: (() => {
		// Timestamp of last push, used to prevent local
		// collisions if you push twice in one ms.
		let lastPushTime = 0;
		// We generate 72-bits of randomness which get
		// turned into 12 characters and appended to the
		// timestamp to prevent collisions with other clients.
		// We store the last characters we generated because
		// in the event of a collision, we'll use those same
		// characters except "incremented" by one.
		const lastRandChars = [];
		return function () {
			let now = new Date().getTime();
			const duplicateTime = now === lastPushTime;
			lastPushTime = now;

			const timeStampChars: string[] = new Array(8);
			let i: number;
			for (i = 7; i >= 0; i--) {
				timeStampChars[i] = ASCII_CHARS.charAt(now % 64);

				// NOTE: Can't use << here because javascript
				// will convert to int and lose the upper bits.
				now = Math.floor(now / 64);
			}

			if (now !== 0)
				throw new Error("We should have converted the entire timestamp.");
			let id = timeStampChars.join("");
			if (!duplicateTime) {
				for (i = 0; i < 12; i++) {
					lastRandChars[i] = Math.floor(Math.random() * 64);
				}
			}
			// If the timestamp hasn't changed since
			// last push, use the same random number,
			// except incremented by 1.
			else {
				for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
					lastRandChars[i] = 0;
				}
				lastRandChars[i]++;
			}
			for (i = 0; i < 12; i++) {
				id += ASCII_CHARS.charAt(lastRandChars[i]);
			}

			if (id.length !== 20) throw new Error("Length should be 20.");
			return id;
		};
	})(),

	/**
	 * Timestamp
	 * Gets timestamp from provided uid.
	 */
	timestamp: (function () {
		return function (id: string, asDate?: boolean): number | Date {
			let time = 0;
			const data = id.substr(0, 8);
			for (let i = 0; i < 8; i++) {
				time = time * 64 + ASCII_CHARS.indexOf(data[i]);
			}
			if (asDate) return new Date(time);
			return time;
		};
	})(),
};
