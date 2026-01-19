import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/site.config";
import { normalizeSiteUrl, renderRssContent } from "@/utils/rss";

export const GET: APIRoute = async (context) => {
	const siteUrl = normalizeSiteUrl(context.site);
	const notes = (await getCollection("note")).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);

	const items: RSSFeedItem[] = await Promise.all(
		notes.map(async (note) => ({
			title: note.data.title,
			link: `/notes/${note.id}/`,
			pubDate: note.data.publishDate,
			description: note.data.description,
			content: await renderRssContent(note, siteUrl),
		})),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items,
	});
};
