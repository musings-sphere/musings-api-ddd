import { readdirSync, statSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";

const getDirs = (p) =>
	readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

// Get a list of all non-build directories in the root folder
const rootDirs: string[] = getDirs(join(__dirname, "..")).filter(
	(dir) => dir.indexOf("build") === -1
);

// Filter them by directories that have package.json
const workerDirs: string[] = rootDirs.filter((dir) => {
	let result = false;
	readdirSync(dir).forEach((file) => {
		if (file === "package.json") {
			result = true;
		}
	});

	return result;
});

const installDeps = (dir, callback): void => {
	const stream = spawn(
		process.platform === "win32" ? "yarn.cmd" : "yarn",
		["install"],
		{ cwd: join(__dirname, "..", dir), stdio: "inherit" }
	);

	stream.on("close", (code) => callback());
};

const installWorkerDeps = (index: number): void => {
	const dir = workerDirs[index];
	if (!dir) {
		return process.exit(0);
	}
	installDeps(dir, () => installWorkerDeps(index + 1));
};

// Install the dependencies in the root folder first
// then recursively install them for all the workers
installDeps("/", () => installWorkerDeps(0));
