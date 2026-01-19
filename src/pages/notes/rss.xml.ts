import { loadRenderers } from "astro:container";
import { getCollection, render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import rss, { type RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { transform, walk } from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";
import { siteConfig } from "@/site.config";

let containerPromise: Promise<AstroContainer> | undefined;

function normalizeSiteUrl(site: URL | string | undefined): URL {
	if (site instanceof URL) return site;
	if (typeof site === "string" && site.length > 0) return new URL(site);
	if (typeof import.meta.env.SITE === "string" && import.meta.env.SITE.length > 0) {
		return new URL(import.meta.env.SITE);
	}
	throw new Error(
		"RSS endpoint requires `site` to be configured in astro.config (or `import.meta.env.SITE` to be set).",
	);
}

function absolutizeUrl(value: string, site: URL): string {
	const trimmed = value.trim();
	if (
		trimmed === "" ||
		trimmed.startsWith("#") ||
		trimmed.startsWith("mailto:") ||
		trimmed.startsWith("tel:") ||
		trimmed.startsWith("data:")
	) {
		return value;
	}
	try {
		return new URL(trimmed, site).toString();
	} catch {
		return value;
	}
}

function absolutizeSrcset(value: string, site: URL): string {
	return value
		.split(",")
		.map((candidate) => {
			const trimmed = candidate.trim();
			if (trimmed === "") return candidate;
			const [urlPart, ...rest] = trimmed.split(/\s+/);
			const absoluteUrl = absolutizeUrl(urlPart ?? "", site);
			return [absoluteUrl, ...rest].filter(Boolean).join(" ");
		})
		.join(", ");
}

async function getContainer(): Promise<AstroContainer> {
	if (!containerPromise) {
		containerPromise = (async () => {
			const renderers = await loadRenderers([getMDXRenderer()]);
			return AstroContainer.create({ renderers });
		})();
	}
	return containerPromise;
}

export const GET: APIRoute = async (context) => {
	const siteUrl = normalizeSiteUrl(context.site);
	const container = await getContainer();
	const notes = (await getCollection("note")).sort(
		(a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
	);

	const feedItems: RSSFeedItem[] = [];

	for (const note of notes) {
		const { Content } = await render(note);
		const rawContent = await container.renderToString(Content);

		const content = await transform(rawContent.replace(/^<!doctype html>\s*/i, ""), [
			async (root) => {
				await walk(root, (node: unknown) => {
					if (!node || typeof node !== "object") return;
					if (!("attributes" in node)) return;
					const rawAttrs = (node as { attributes?: unknown }).attributes;
					if (!rawAttrs || typeof rawAttrs !== "object") return;
					const attrs = rawAttrs as Record<string, unknown>;

					const href = attrs.href;
					if (typeof href === "string") {
						attrs.href = absolutizeUrl(href, siteUrl);
					}
					const src = attrs.src;
					if (typeof src === "string") {
						attrs.src = absolutizeUrl(src, siteUrl);
					}
					const poster = attrs.poster;
					if (typeof poster === "string") {
						attrs.poster = absolutizeUrl(poster, siteUrl);
					}
					const srcset = attrs.srcset;
					if (typeof srcset === "string") {
						attrs.srcset = absolutizeSrcset(srcset, siteUrl);
					}
				});
				return root;
			},
			sanitize({ dropElements: ["script", "style", "iframe", "object", "embed"] }),
		]);

		feedItems.push({
			title: note.data.title,
			link: `/notes/${note.id}/`,
			pubDate: note.data.publishDate,
			description: note.data.description,
			content,
		});
	}

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: siteUrl,
		items: feedItems,
		stylesheet: "/rss/styles.xsl",
	});
};
