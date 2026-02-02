import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import expressiveCode from "astro-expressive-code";
// @ts-expect-error
import { astroGrab } from "astro-grab"; // TODO: Remove ts-expect-error when astro-grab has types
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import og from "astro-og";
import robotsTxt from "astro-robots-txt";
import webmanifest from "astro-webmanifest";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkDirective from "remark-directive";
import Sonda from "sonda/astro";

import { rehypeExternalLinkIcon } from "./src/plugins/rehype-external-link-icon.ts";
import { remarkAdmonitions } from "./src/plugins/remark-admonitions.ts";
import { remarkFigureCaption } from "./src/plugins/remark-figure-caption.ts";
import { remarkGitMetadata } from "./src/plugins/remark-git-metadata.ts";
import { remarkGithubCard } from "./src/plugins/remark-github-card.ts";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.ts";
import { expressiveCodeOptions, siteConfig } from "./src/site.config.ts";

// https://astro.build/config
export default defineConfig({
	site: siteConfig.url,
	image: {
		domains: ["webmention.io"],
	},
	integrations: [
		expressiveCode(expressiveCodeOptions),
		icon(),
		sitemap(),
		mdx(),
		robotsTxt(),
		webmanifest({
			// See: https://github.com/alextim/astro-lib/blob/main/packages/astro-webmanifest/README.md
			name: siteConfig.title,
			short_name: "Eling_Pramuatmaja", // optional
			description: siteConfig.description,
			lang: siteConfig.lang,
			icon: "public/icon.svg", // the source for generating favicon & icons
			icons: [
				{
					src: "icons/apple-touch-icon.png", // used in src/components/BaseHead.astro L:26
					sizes: "180x180",
					type: "image/png",
				},
				{
					src: "icons/icon-192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "icons/icon-512.png",
					sizes: "512x512",
					type: "image/png",
				},
			],
			start_url: "/",
			background_color: "#100f0f",
			theme_color: "#da702c",
			display: "standalone",
			config: {
				insertFaviconLinks: false,
				insertThemeColorMeta: false,
				insertManifestLink: false,
			},
		}),
		Sonda({
			server: true,
		}),
		metaTags(),
		astroGrab(),
		og(),
	],
	markdown: {
		rehypePlugins: [
			rehypeHeadingIds,
			[
				rehypeAutolinkHeadings,
				{
					behavior: "append",
					properties: {
						className: ["anchor-link"],
						ariaLabel: "Link to this section",
					},
					content: {
						type: "element",
						tagName: "span",
						properties: {
							className: ["anchor-icon"],
						},
					},
				},
			],
			[
				rehypeExternalLinks,
				{
					rel: ["noopener", "noreferrer"],
					target: "_blank",
				},
			],
			[
				rehypeExternalLinkIcon,
				{
					siteUrl: siteConfig.url,
					className: "is-external",
				},
			],
			rehypeUnwrapImages,
		],
		remarkPlugins: [
			remarkReadingTime,
			remarkGitMetadata,
			remarkDirective,
			remarkFigureCaption, // Must be after remarkDirective
			remarkGithubCard,
			remarkAdmonitions,
		],
		remarkRehype: {
			footnoteLabelProperties: {
				className: [""],
			},
		},
	},
	vite: {
		build: {
			sourcemap: true,
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
		plugins: [tailwind()],
	},
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
			WEBMENTION_URL: envField.string({ context: "client", access: "public", optional: true }),
			WEBMENTION_PINGBACK: envField.string({ context: "client", access: "public", optional: true }),
		},
	},
});
