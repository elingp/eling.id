import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const titleSchema = z.string().max(60);

const baseSchema = z.object({
	title: titleSchema,
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
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => {
					const date = new Date(val);
					// Transform date string without time (e.g., "30 Mar 2022") as UTC midnight.
					if (typeof val === "string" && !val.includes("T") && !val.includes("t")) {
						const utcDate = new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`);
						return utcDate;
					}
					return date;
				}),
			updatedDate: z
				.string()
				.optional()
				.transform((str) => {
					if (!str) return undefined;
					const date = new Date(str);
					// Transform date string without time (e.g., "30 Mar 2022") as UTC midnight.
					if (!str.includes("T") && !str.includes("t")) {
						const utcDate = new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`);
						return utcDate;
					}
					return date;
				}),
			autoUpdateDate: z.boolean().default(false),
			pinned: z.boolean().default(false),
		}),
});

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => {
				const date = new Date(val);
				// Transform date string without time (e.g., "30 Mar 2022") as UTC midnight.
				if (typeof val === "string" && !val.includes("T") && !val.includes("t")) {
					const utcDate = new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`);
					return utcDate;
				}
				return date;
			}),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => {
				if (!str) return undefined;
				const date = new Date(str);
				// Transform date string without time (e.g., "30 Mar 2022") as UTC midnight.
				if (!str.includes("T") && !str.includes("t")) {
					const utcDate = new Date(`${date.toISOString().split("T")[0]}T00:00:00Z`);
					return utcDate;
				}
				return date;
			}),
		autoUpdateDate: z.boolean().default(false),
	}),
});

const tag = defineCollection({
	loader: glob({ base: "./src/content/tag", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: titleSchema.optional(),
		description: z.string().optional(),
	}),
});

export const collections = { post, note, tag };
