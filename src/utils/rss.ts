import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { transform, walk } from "ultrahtml";
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
	const rawContent = await container.renderToString(Content);

	return transform(rawContent.replace(/^<!doctype html>\s*/i, ""), [
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
}
