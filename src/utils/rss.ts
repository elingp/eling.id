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

	return transform((await container.renderToString(Content)).replace(/^<!doctype html>\s*/i, ""), [
		async (root) => {
			await walk(root, (node) => {
				if (!node || typeof node !== "object" || !("attributes" in node)) return;
				const attrs = (node as { attributes?: Record<string, string> }).attributes;
				if (!attrs) return;

				if (attrs.href) attrs.href = absolutizeUrl(attrs.href, siteUrl);
				if (attrs.src) attrs.src = absolutizeUrl(attrs.src, siteUrl);
				if (attrs.poster) attrs.poster = absolutizeUrl(attrs.poster, siteUrl);
				if (attrs.srcset) attrs.srcset = absolutizeSrcset(attrs.srcset, siteUrl);
			});
			return root;
		},
		sanitize({ dropElements: ["script", "style", "iframe", "object", "embed"] }),
	]);
}
