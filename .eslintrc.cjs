/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
	env: {
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:astro/recommended",
		"plugin:astro/jsx-a11y-recommended",
		"plugin:deprecation/recommended",
		"plugin:regexp/recommended",
		"plugin:typescript-sort-keys/recommended",
		"plugin:markdown/recommended-legacy",
	],
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				extraFileExtensions: [".astro"],
				parser: "@typescript-eslint/parser",
			},
			rules: {
				"astro/jsx-a11y/no-redundant-roles": [
					"error",
					{
						ol: ["list"],
						ul: ["list"],
					},
				],
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
		project: "./tsconfig.json",
	},
	root: true,
};
