import type { Image, Root } from "mdast";
import type { ContainerDirective } from "mdast-util-directive";
import { visit } from "unist-util-visit";
import { h } from "../utils/remark";

/**
 * Remark plugin to transform :::figure directives into HTML figure elements
 *
 * Syntax:
 * :::figure
 * ![Alt text](image.jpg "Hover caption text")
 *
 * Caption with [links](url) and **formatting**
 * :::
 *
 * Transforms to:
 * <figure>
 *   <img src="image.jpg" alt="Alt text" title="Hover caption text" />
 *   <figcaption><p>Caption with <a href="url">links</a> and <strong>formatting</strong></p></figcaption>
 * </figure>
 */
export function remarkFigureCaption() {
	return (tree: Root) => {
		visit(tree, "containerDirective", (node: ContainerDirective, index, parent) => {
			if (node.name !== "figure" || !parent || index === undefined) {
				return;
			}

			// The first child should be a paragraph containing an image
			const firstChild = node.children[0];
			if (!firstChild || firstChild.type !== "paragraph") {
				return;
			}

			const imageNode = firstChild.children[0] as Image;
			if (!imageNode || imageNode.type !== "image") {
				return;
			}

			// Everything after the first paragraph is the caption content
			const captionContent = node.children.slice(1);

			const figure = h("figure", {}, [
				imageNode, // Keep the image node so Astro can optimize it
				h("figcaption", { class: "md-figcaption" }, captionContent),
			]);

			parent.children[index] = figure;
		});
	};
}
