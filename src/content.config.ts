import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

function parseFrontmatterDate(value: string | Date, fieldName: string): Date {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`Invalid ${fieldName}: ${String(value)}`);
	}
	if (typeof value === "string" && !value.includes("T") && !value.includes("t")) {
		return new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`);
	}
	return date;
}

const titleSchema = z.string().max(60);

const publishDateSchema = z
	.string()
	.or(z.date())
	.transform((val) => parseFrontmatterDate(val, "publishDate"));

const updatedDateSchema = z
	.string()
	.optional()
	.transform((str) => {
		if (!str) return undefined;
		return parseFrontmatterDate(str, "updatedDate");
	});

const autoUpdateDateSchema = z.boolean().default(false);

const baseSchema = z.object({
	title: titleSchema,
	publishDate: publishDateSchema,
	updatedDate: updatedDateSchema,
	autoUpdateDate: autoUpdateDateSchema,
});

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		baseSchema.extend({
			description: z.string(),
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(),
			draft: z.boolean().default(false),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			pinned: z.boolean().default(false),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

export const collections = { note, post, tag };
