import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getAllPosts } from "@/data/post";
import { siteConfig } from "@/site.config";
import { normalizeSiteUrl, renderRssContent } from "@/utils/rss";

export const GET: APIRoute = async (context) => {
	const siteUrl = normalizeSiteUrl(context.site);
	const posts = (await getAllPosts()).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);

	const items: RSSFeedItem[] = await Promise.all(
		posts.map(async (post) => ({
			title: post.data.title,
			link: `/posts/${post.id}/`,
			pubDate: post.data.publishDate,
			description: post.data.description,
			content: await renderRssContent(post, siteUrl),
		})),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items,
		stylesheet: "/rss/styles.xsl",
	});
};
