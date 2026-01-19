import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";

export const GET = async () => {
	let baseUrl = import.meta.env.SITE;
	if (baseUrl.endsWith("/")) {
		baseUrl = baseUrl.slice(0, -1);
	}

	const renderers = await loadRenderers([getMDXRenderer()]);
	const container = await AstroContainer.create({ renderers });
	const posts = (await getAllPosts()).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);

	const feedItems: RSSFeedItem[] = [];

	for (const post of posts) {
		// Get the `<Content/>` component for the current post.
		const { Content } = await render(post);
		// Use the Astro container to render the content to a string.
		const rawContent = await container.renderToString(Content);
		// Process and sanitize the raw content:
		// - Removes `<!DOCTYPE html>` preamble
		// - Makes link `href` and image `src` attributes absolute instead of relative
		// - Strips any `<script>` and `<style>` tags
		const content = await transform(rawContent.replace(/^<!DOCTYPE html>/, ""), [
			async (node) => {
				await walk(node, (node) => {
					if (node.name === "a" && node.attributes.href?.startsWith("/")) {
						node.attributes.href = baseUrl + node.attributes.href;
					}
					if (node.name === "img" && node.attributes.src?.startsWith("/")) {
						node.attributes.src = baseUrl + node.attributes.src;
					}
				});
				return node;
			},
			sanitize({ dropElements: ["script", "style"] }),
		]);
		feedItems.push({
			...post.data,
			title: post.data.title,
			link: `posts/${post.id}/`,
			pubDate: post.data.publishDate,
			description: post.data.description,
			content,
		});
	}

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: baseUrl,
		items: feedItems,
		stylesheet: "/rss/styles.xsl",
	});
};
