const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type EffectiveUpdatedDateInput = {
	publishDate: Date;
	updatedDate?: Date | undefined;
	autoUpdateDate?: boolean | undefined;
};

function parseDateLike(value: unknown): Date | null {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}
	if (typeof value === "string") {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	}
	return null;
}

// Determine the actual updated date to show:
// 1. If updatedDate is manually set in frontmatter, use that (takes priority)
// 2. Otherwise, use git lastModified only when autoUpdateDate is enabled and:
//    a) It's significantly different from publishDate (more than 1 day)
export function getEffectiveUpdatedDate(
	data: EffectiveUpdatedDateInput,
	lastModified?: unknown,
	thresholdMs = ONE_DAY_MS,
): Date | null {
	if (data.updatedDate) return data.updatedDate;
	if (!data.autoUpdateDate) return null;
	const gitLastModified = parseDateLike(lastModified);
	if (!gitLastModified) return null;
	if (gitLastModified.getTime() - data.publishDate.getTime() <= thresholdMs) return null;
	return gitLastModified;
}
