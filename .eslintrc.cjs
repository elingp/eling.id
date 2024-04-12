/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:astro/recommended",
		"plugin:astro/jsx-a11y-recommended",
		"plugin:regexp/recommended",
		"plugin:deprecation/recommended",
	],
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				extraFileExtensions: [".astro"],
				parser: "@typescript-eslint/parser",
			},
		},
		{
			extends: ["plugin:markdown/recommended-legacy"],
			files: ["**/*.md"],
			processor: "markdown/markdown",
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		project: true,
		sourceType: "module",
		tsconfigRootDir: __dirname,
	},
	root: true,
};
