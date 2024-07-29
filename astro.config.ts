import { defineConfig } from "astro/config";
import fs from "fs";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeExternalLinks from "rehype-external-links";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";

import { expressiveCodeOptions } from "./src/site.config";
import { remarkReadingTime } from "./src/utils/remark-reading-time";

// https://astro.build/config
export default defineConfig({
	// ! Please remember to replace the following site property with your own domain
	site: "https://eling.id/",
	markdown: {
		remarkPlugins: [remarkUnwrapImages, remarkReadingTime],
		rehypePlugins: [
			[
				rehypeExternalLinks,
				{
					rel: ["nofollow, noopener, noreferrer"],
					target: "_blank",
				},
			],
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
		},
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		mdx(),
	],
	image: {
		domains: ["webmention.io"],
	},
	// https://docs.astro.build/en/guides/prefetch/
	prefetch: true,
	vite: {
		plugins: [rawFonts([".ttf", ".woff"])],
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},
});

function rawFonts(ext: string[]) {
	return {
		name: "vite-plugin-raw-fonts",
		// @ts-expect-error:next-line
		transform(_, id) {
			// eslint-disable-next-line
			if (ext.some((e) => id.endsWith(e))) {
				// eslint-disable-next-line
				const buffer = fs.readFileSync(id);
				return {
					code: `export default ${JSON.stringify(buffer)}`,
					map: null,
				};
			}
		},
	};
}
