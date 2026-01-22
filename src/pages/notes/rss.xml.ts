import { getCollection } from "astro:content";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/site.config";
import { getRssExcerptFromHtml, normalizeSiteUrl, renderRssContent } from "@/utils/rss";

export const GET: APIRoute = async (context) => {
	const siteUrl = normalizeSiteUrl(context.site);
	const notes = (await getCollection("note")).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);
	const lastBuildDate = new Date().toUTCString();
	const copyright = `© 2018–${new Date().getFullYear()} ${siteConfig.author}.`;

	const items: RSSFeedItem[] = await Promise.all(
		notes.map(async (note) => {
			const content = await renderRssContent(note, siteUrl);
			return {
				title: note.data.title,
				link: `/notes/${note.id}/`,
				pubDate: note.data.publishDate,
				description: note.data.description?.trim() || getRssExcerptFromHtml(content),
				content,
			};
		}),
	);

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items,
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		customData: `
			<language>${siteConfig.lang}</language>
			<copyright>${copyright}</copyright>
			<managingEditor>${siteConfig.email} (${siteConfig.author})</managingEditor>
			<webMaster>${siteConfig.email} (${siteConfig.author})</webMaster>
			<pubDate>${lastBuildDate}</pubDate>
			<lastBuildDate>${lastBuildDate}</lastBuildDate>
			<category>Weblog</category>
			<generator>Astro RSS</generator>
			<docs>https://www.rssboard.org/rss-specification</docs>
			<image>
				<url>${new URL("/rss-image.png", siteUrl)}</url>
				<title>${siteConfig.title}</title>
				<link>${siteUrl}</link>
				<width>144</width>
				<height>76</height>
			</image>
			<atom:link href="${siteUrl}rss.xml" rel="self" type="application/rss+xml" />
		`,
	});
};
