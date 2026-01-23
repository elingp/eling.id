import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/site.config";
import {
	getEffectiveUpdatedDate,
	getRssExcerptFromHtml,
	normalizeSiteUrl,
	renderRssEntry,
} from "@/utils/rss";

export const GET: APIRoute = async (context) => {
	const siteUrl = normalizeSiteUrl(context.site);
	const notes = (await getCollection("note")).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);
	const channelPubDate = notes[0]?.data.publishDate;

	const itemsWithDates: Array<{ item: RSSFeedItem; updatedDate: Date }> = await Promise.all(
		notes.map(async (note) => {
			const { content, remarkPluginFrontmatter } = await renderRssEntry(note, siteUrl);
			return {
				item: {
					title: note.data.title,
					link: `/notes/${note.id}/`,
					pubDate: note.data.publishDate,
					description: note.data.description?.trim() || getRssExcerptFromHtml(content),
					content,
				},
				updatedDate:
					getEffectiveUpdatedDate(note.data, remarkPluginFrontmatter.lastModified) ??
					note.data.publishDate,
			};
		}),
	);

	const channelLastBuildDate = itemsWithDates.reduce(
		(latest, { updatedDate }) => (updatedDate.getTime() > latest.getTime() ? updatedDate : latest),
		channelPubDate ?? new Date(0),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items: itemsWithDates.map(({ item }) => item),
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `
			<language>${siteConfig.lang}</language>
			<copyright>© 2018–${new Date().getFullYear()} ${siteConfig.author}.</copyright>
			<managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
			<webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
			${channelPubDate ? `<pubDate>${channelPubDate.toUTCString()}</pubDate>` : ""}
			${channelPubDate ? `<lastBuildDate>${channelLastBuildDate.toUTCString()}</lastBuildDate>` : ""}
			<category>Weblog</category>
			<generator>Astro RSS</generator>
			<docs>https://www.rssboard.org/rss-specification</docs>
			<image>
				<url>${new URL("/rss-image.png", siteUrl)}</url>
				<title>${siteConfig.title}</title>
				<link>${siteUrl}</link>
				<width>144</width>
				<height>76</height>
				<description>${siteConfig.description}</description>
			</image>
			<atom:link href="${siteUrl}notes/rss.xml" rel="self" type="application/rss+xml" />
		`,
	});
};
