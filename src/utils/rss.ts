import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import {
	type ElementNode,
	type Node,
	parse,
	TEXT_NODE,
	transform,
	walk,
	walkSync,
} from "ultrahtml";
import sanitize from "ultrahtml/transformers/sanitize";

let containerPromise: Promise<AstroContainer> | undefined;

type RenderableEntry = Parameters<typeof render>[0];

export function normalizeSiteUrl(site: URL | string | undefined): URL {
	if (site instanceof URL) return site;
	if (typeof site === "string" && site.length > 0) return new URL(site);
	if (typeof import.meta.env.SITE === "string" && import.meta.env.SITE.length > 0) {
		return new URL(import.meta.env.SITE);
	}
	throw new Error(
		"RSS endpoint requires `site` to be configured in astro.config (or `import.meta.env.SITE` to be set).",
	);
}

export function absolutizeUrl(value: string, site: URL): string {
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

export function absolutizeSrcset(value: string, site: URL): string {
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

const RSS_ATTRIBUTE_DENYLIST = new Set(["loading", "decoding", "fetchpriority"]);
const DEFAULT_RSS_EXCERPT_LENGTH = 200;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type RssRemarkFrontmatter = Record<string, unknown>;

function isElementNode(node: Node): node is ElementNode {
	return node.type === 1;
}

function hasClass(attrs: Record<string, string>, className: string): boolean {
	const classAttr = attrs.class;
	if (!classAttr) return false;
	return classAttr.split(/\s+/).includes(className);
}

function isFragmentLink(href: string | undefined): boolean {
	return typeof href === "string" && href.trim().startsWith("#");
}

function isHeadingAutolink(attrs: Record<string, string>): boolean {
	return (
		hasClass(attrs, "anchor-link") &&
		attrs["aria-label"] === "Link to this section" &&
		isFragmentLink(attrs.href)
	);
}

function isFootnoteBackref(attrs: Record<string, string>): boolean {
	return hasClass(attrs, "footnote-backref");
}

function isFootnoteRef(attrs: Record<string, string>): boolean {
	return "data-footnote-ref" in attrs && isFragmentLink(attrs.href);
}

function removeAttributesForRss(attrs: Record<string, string>): void {
	for (const key of Object.keys(attrs)) {
		if (RSS_ATTRIBUTE_DENYLIST.has(key) || key.startsWith("aria-") || key.startsWith("data-")) {
			delete attrs[key];
		}
	}
}

function unwrapNode(parent: Node | undefined, index: number | undefined, node: ElementNode): void {
	if (
		!parent ||
		typeof index !== "number" ||
		!Array.isArray((parent as { children?: Node[] }).children)
	) {
		return;
	}
	const children = (parent as { children: Node[] }).children;
	const replacement = node.children ?? [];
	for (const child of replacement) {
		if (child && typeof child === "object") child.parent = parent;
	}
	children.splice(index, 1, ...replacement);
}

function removeNode(parent: Node | undefined, index: number | undefined): void {
	if (
		!parent ||
		typeof index !== "number" ||
		!Array.isArray((parent as { children?: Node[] }).children)
	) {
		return;
	}
	(parent as { children: Node[] }).children.splice(index, 1);
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

function getGitLastModifiedDate(remarkPluginFrontmatter?: RssRemarkFrontmatter): Date | null {
	const lastModified = remarkPluginFrontmatter?.lastModified;
	if (typeof lastModified !== "string") return null;
	const date = new Date(lastModified);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function getEffectiveUpdatedDate(
	data: {
		publishDate: Date;
		updatedDate?: Date | undefined;
		autoUpdateDate?: boolean | undefined;
	},
	remarkPluginFrontmatter?: RssRemarkFrontmatter,
): Date | null {
	if (data.updatedDate) return data.updatedDate;
	if (!data.autoUpdateDate) return null;
	const gitLastModified = getGitLastModifiedDate(remarkPluginFrontmatter);
	if (!gitLastModified) return null;
	if (gitLastModified.getTime() - data.publishDate.getTime() <= ONE_DAY_MS) return null;
	return gitLastModified;
}

export async function renderRssEntry(
	entry: RenderableEntry,
	siteUrl: URL,
): Promise<{ content: string; remarkPluginFrontmatter: RssRemarkFrontmatter }> {
	const { Content, remarkPluginFrontmatter } = await render(entry);
	const content = await transform(
		(await (await getContainer()).renderToString(Content)).replace(/^<!doctype html>\s*/i, ""),
		[
			async (root) => {
				await walk(root, (node, parent, index) => {
					if (!isElementNode(node)) return;
					const attrs = node.attributes;

					if (node.name === "a") {
						if (isHeadingAutolink(attrs) || isFootnoteBackref(attrs)) {
							removeNode(parent, index);
							return;
						}

						if (isFootnoteRef(attrs) || isFragmentLink(attrs.href)) {
							unwrapNode(parent, index, node);
							return;
						}
					}

					if (attrs.href) attrs.href = absolutizeUrl(attrs.href, siteUrl);
					if (attrs.src) attrs.src = absolutizeUrl(attrs.src, siteUrl);
					if (attrs.poster) attrs.poster = absolutizeUrl(attrs.poster, siteUrl);
					if (attrs.srcset) attrs.srcset = absolutizeSrcset(attrs.srcset, siteUrl);
					removeAttributesForRss(attrs);
				});
				return root;
			},
			sanitize({ dropElements: ["script", "style", "iframe", "object", "embed"] }),
		],
	);

	return {
		content,
		remarkPluginFrontmatter,
	};
}

export async function renderRssContent(entry: RenderableEntry, siteUrl: URL): Promise<string> {
	return (await renderRssEntry(entry, siteUrl)).content;
}

export function getRssExcerptFromHtml(
	html: string,
	maxLength = DEFAULT_RSS_EXCERPT_LENGTH,
): string {
	const root = parse(html);
	const parts: string[] = [];

	walkSync(root, (node) => {
		if (node.type !== TEXT_NODE) return;
		if (node.value) parts.push(node.value);
	});

	const text = parts.join(" ").replace(/\s+/g, " ").trim();
	if (text.length <= maxLength) return text;

	const truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");
	const safeCut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
	return `${safeCut}…`;
}
