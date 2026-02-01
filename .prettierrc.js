/** @type {import("@types/prettier").Options} */
export default {
	printWidth: 100,
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: true,
	plugins: [
		// Tailwind plugin must come last for proper sorting in CSS files
		"prettier-plugin-tailwindcss",
	],
	overrides: [
		{
			files: ["*.mdx", "*.md"],
			options: {
				printWidth: 80,
			},
		},
	],
};
