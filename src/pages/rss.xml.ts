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
	const lastBuildDate = new Date().toUTCString();
	const copyright = `© 2018–${new Date().getFullYear()} ${siteConfig.author}.`;

	const items: RSSFeedItem[] = await Promise.all(
		posts.map(async (post) => ({
			title: post.data.title,
			link: `/posts/${post.id}/`,
			pubDate: post.data.publishDate,
			description: post.data.description,
			content: await renderRssContent(post, siteUrl),
			categories: post.data.tags.length ? post.data.tags : undefined,
		})),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `
			<atom:link href="${siteUrl}rss.xml" rel="self" type="application/rss+xml" />
			<copyright>${copyright}</copyright>
			<docs>https://www.rssboard.org/rss-specification</docs>
			<generator>Astro RSS</generator>
			<language>${siteConfig.lang}</language>
			<lastBuildDate>${lastBuildDate}</lastBuildDate>
			<managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
			<webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
		`,
	});
};
