import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Remark plugin to extract git metadata for markdown files.
 *
 * Adds to frontmatter:
 * - lastModified: ISO 8601 timestamp of last git commit
 * - filePath: Relative path from git root (for GitHub source links)
 */
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
