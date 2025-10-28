import { execSync } from "node:child_process";
import path from "node:path";

export function remarkGitMetadata() {
	// @ts-expect-error:next-line
	return (_tree, { data, history }) => {
		const filepath = history[0];

		// Get last modified time from git
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
		data.astro.frontmatter.lastModified = result.toString();

		// Get relative file path for GitHub source links
		const gitRoot = execSync("git rev-parse --show-toplevel").toString().trim();
		const relativePath = path.relative(gitRoot, filepath);
		data.astro.frontmatter.gitSourcePath = relativePath;
	};
}
