import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { type ElementNode, type Node, transform, walk } from "ultrahtml";
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

function isElementNode(node: Node): node is ElementNode {
	return node.type === 1;
}

function hasClass(attrs: Record<string, string>, className: string): boolean {
	const classAttr = attrs.class;
	if (!classAttr) return false;
	return classAttr.split(/\s+/).includes(className);
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

export async function renderRssContent(entry: RenderableEntry, siteUrl: URL): Promise<string> {
	const container = await getContainer();
	const { Content } = await render(entry);

	return transform((await container.renderToString(Content)).replace(/^<!doctype html>\s*/i, ""), [
		async (root) => {
			await walk(root, (node, parent, index) => {
				if (!isElementNode(node)) return;
				const attrs = node.attributes;
				if (!attrs) return;

				const href = attrs.href?.trim();
				if (node.name === "a") {
					const isHeadingAutolink =
						hasClass(attrs, "anchor-link") &&
						attrs["aria-label"] === "Link to this section" &&
						href?.startsWith("#");
					if (isHeadingAutolink) {
						removeNode(parent, index);
						return;
					}

					const isFootnoteBackref = hasClass(attrs, "footnote-backref");
					if (isFootnoteBackref) {
						removeNode(parent, index);
						return;
					}

					const isFootnoteRef =
						"data-footnote-ref" in attrs && typeof href === "string" && href.startsWith("#");
					if (isFootnoteRef) {
						unwrapNode(parent, index, node);
						return;
					}

					if (typeof href === "string" && href.startsWith("#")) {
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
	]);
}
