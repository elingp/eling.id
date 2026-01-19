import type { Element, Root } from "hast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type RehypeExternalLinkIconOptions = {
	siteUrl: string;
	className?: string;
};

export const rehypeExternalLinkIcon: Plugin<[RehypeExternalLinkIconOptions], Root> = (options) => {
	const className = options?.className ?? "is-external";
	const siteUrl = options?.siteUrl;
	if (!siteUrl) return (tree) => tree;

	const siteHost = new URL(siteUrl).host;

	return (tree) => {
		visit(tree, "element", (node: Element) => {
			if (node.tagName !== "a") return;

			const href = node.properties?.href;
			if (typeof href !== "string") return;
			if (href.startsWith("#")) return;

			let url: URL;
			try {
				url = new URL(href, siteUrl);
			} catch {
				return;
			}

			if (url.protocol !== "http:" && url.protocol !== "https:") return;
			if (url.hostname === siteHost) return;

			const currentClass = node.properties?.className;
			const classes = Array.isArray(currentClass)
				? [...currentClass]
				: typeof currentClass === "string"
					? currentClass.split(" ").filter(Boolean)
					: [];

			if (!classes.includes(className)) {
				classes.push(className);
			}

			node.properties = {
				...node.properties,
				className: classes,
			};
		});
	};
};
