"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
const getDirs = (p) =>
	fs_1
		.readdirSync(p)
		.filter((f) => fs_1.statSync(path_1.join(p, f)).isDirectory());
// Get a list of all non-build directories in the root folder
const rootDirs = getDirs(path_1.join(__dirname, "..")).filter(
	(dir) => dir.indexOf("build") === -1,
);
// Filter them by directories that have package.json
const workerDirs = rootDirs.filter((dir) => {
	let result = false;
	fs_1.readdirSync(dir).forEach((file) => {
		if (file === "package.json") {
			result = true;
		}
	});
	return result;
});
const installDeps = (dir, callback) => {
	const stream = child_process_1.spawn(
		process.platform === "win32" ? "yarn.cmd" : "yarn",
		["install", "--no-progress", "--non-interactive"],
		{ cwd: path_1.join(__dirname, "..", dir), stdio: "inherit" },
	);
	stream.on("close", (code) => callback());
};
const installWorkerDeps = (index) => {
	const dir = workerDirs[index];
	if (!dir) {
		return process.exit(0);
	}
	installDeps(dir, () => installWorkerDeps(index + 1));
};
// Install the dependencies in the root folder first
// then recursively install them for all the workers
installDeps("/", () => installWorkerDeps(0));
//# sourceMappingURL=installDepenencies.js.map
