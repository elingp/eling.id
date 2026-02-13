// Types and utilities vendored from astro-tweet / react-tweet (syndication API).
// No external dependencies.

// ── Entity types ──────────────────────────────────────────────────────────────

export type Indices = [number, number];

export interface HashtagEntity {
	indices: Indices;
	text: string;
}

export interface UserMentionEntity {
	id_str: string;
	indices: Indices;
	name: string;
	screen_name: string;
}

export interface MediaEntity {
	display_url: string;
	expanded_url: string;
	indices: Indices;
	url: string;
}

export interface UrlEntity {
	display_url: string;
	expanded_url: string;
	indices: Indices;
	url: string;
}

export interface SymbolEntity {
	indices: Indices;
	text: string;
}

export interface TweetEntities {
	hashtags: HashtagEntity[];
	urls: UrlEntity[];
	user_mentions: UserMentionEntity[];
	symbols: SymbolEntity[];
	media?: MediaEntity[];
}

// ── Media types ───────────────────────────────────────────────────────────────

export type RGB = { red: number; green: number; blue: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Size = { h: number; w: number; resize: string };

export interface VideoInfo {
	aspect_ratio: [number, number];
	variants: {
		bitrate?: number;
		content_type: "video/mp4" | "application/x-mpegURL";
		url: string;
	}[];
}

interface MediaBase {
	display_url: string;
	expanded_url: string;
	ext_media_availability: { status: string };
	ext_media_color: { palette: { percentage: number; rgb: RGB }[] };
	indices: Indices;
	media_url_https: string;
	original_info: { height: number; width: number; focus_rects: Rect[] };
	sizes: { large: Size; medium: Size; small: Size; thumb: Size };
	url: string;
	ext_alt_text?: string;
}

export interface MediaPhoto extends MediaBase {
	type: "photo";
}
export interface MediaAnimatedGif extends MediaBase {
	type: "animated_gif";
	video_info: VideoInfo;
}
export interface MediaVideo extends MediaBase {
	type: "video";
	video_info: VideoInfo;
}
export type MediaDetails = MediaPhoto | MediaAnimatedGif | MediaVideo;

// ── User types ────────────────────────────────────────────────────────────────

export interface TweetUser {
	id_str: string;
	name: string;
	profile_image_url_https: string;
	profile_image_shape: "Circle" | "Square" | "Hexagon";
	screen_name: string;
	verified: boolean;
	verified_type?: "Business" | "Government";
	is_blue_verified: boolean;
}

// ── Photo / Video top-level ───────────────────────────────────────────────────

export interface TweetPhoto {
	backgroundColor: RGB;
	cropCandidates: Rect[];
	expandedUrl: string;
	url: string;
	width: number;
	height: number;
}

export interface TweetVideo {
	aspectRatio: [number, number];
	contentType: string;
	durationMs: number;
	mediaAvailability: { status: string };
	poster: string;
	variants: { type: string; src: string }[];
	videoId: { type: string; id: string };
	viewCount: number;
}

// ── Edit control ──────────────────────────────────────────────────────────────

export interface TweetEditControl {
	edit_tweet_ids: string[];
	editable_until_msecs: string;
	is_edit_eligible: boolean;
	edits_remaining: string;
}

// ── Card types (URL preview cards) ────────────────────────────────────────────

export interface CardImageValue {
	height: number;
	width: number;
	url: string;
}

export interface CardBindingValue {
	string_value?: string;
	image_value?: CardImageValue;
	type: string;
	scribe_key?: string;
}

export interface TweetCard {
	card_platform?: {
		platform: {
			audience: { name: string };
			device: { name: string; version: string };
		};
	};
	name: string;
	url: string;
	binding_values: Record<string, CardBindingValue | undefined>;
}

// ── Tweet types ───────────────────────────────────────────────────────────────

export interface TweetBase {
	lang: string;
	created_at: string;
	display_text_range: Indices;
	entities: TweetEntities;
	id_str: string;
	text: string;
	user: TweetUser;
	edit_control: TweetEditControl;
	isEdited: boolean;
	isStaleEdit: boolean;
}

export interface Tweet extends TweetBase {
	__typename: "Tweet";
	favorite_count: number;
	mediaDetails?: MediaDetails[];
	photos?: TweetPhoto[];
	video?: TweetVideo;
	conversation_count: number;
	quoted_tweet?: QuotedTweet;
	in_reply_to_screen_name?: string;
	in_reply_to_status_id_str?: string;
	in_reply_to_user_id_str?: string;
	parent?: TweetParent;
	possibly_sensitive?: boolean;
	card?: TweetCard;
}

export interface TweetParent extends TweetBase {
	reply_count: number;
	retweet_count: number;
	favorite_count: number;
}

export interface QuotedTweet extends TweetBase {
	reply_count: number;
	retweet_count: number;
	favorite_count: number;
	mediaDetails?: MediaDetails[];
	self_thread: { id_str: string };
}

// ── Data fetching ─────────────────────────────────────────────────────────────

const SYNDICATION_URL = "https://cdn.syndication.twimg.com";
const TWEET_ID = /^[0-9]+$/;

function getToken(id: string): string {
	return ((Number(id) / 1e15) * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, "");
}

/**
 * Extract a numeric tweet ID from a URL or bare ID string.
 */
export function extractTweetId(input: string): string {
	const trimmed = input.trim();
	if (TWEET_ID.test(trimmed)) return trimmed;
	// Handle URLs like https://x.com/user/status/123456 or https://twitter.com/user/status/123456
	const match = trimmed.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
	if (match?.[1]) return match[1];
	throw new Error(`Cannot extract tweet ID from: ${input}`);
}

export class TwitterApiError extends Error {
	status: number;
	data: unknown;
	constructor({ message, status, data }: { message: string; status: number; data: unknown }) {
		super(message);
		this.name = "TwitterApiError";
		this.status = status;
		this.data = data;
	}
}

/**
 * Fetch a tweet from Twitter's syndication API. Runs at build time.
 * Returns undefined for deleted/not-found tweets (does not throw).
 */
export async function getTweet(
	idOrUrl: string,
	fetchOptions?: RequestInit,
): Promise<Tweet | undefined> {
	const id = extractTweetId(idOrUrl);

	if (id.length > 40 || !TWEET_ID.test(id)) {
		throw new Error(`Invalid tweet id: ${id}`);
	}

	const url = new URL(`${SYNDICATION_URL}/tweet-result`);
	url.searchParams.set("id", id);
	url.searchParams.set("lang", "en");
	url.searchParams.set(
		"features",
		[
			"tfw_timeline_list:",
			"tfw_follower_count_sunset:true",
			"tfw_tweet_edit_backend:on",
			"tfw_refsrc_session:on",
			"tfw_fosnr_soft_interventions_enabled:on",
			"tfw_show_birdwatch_pivots_enabled:on",
			"tfw_show_business_verified_badge:on",
			"tfw_duplicate_scribes_to_settings:on",
			"tfw_use_profile_image_shape_enabled:on",
			"tfw_show_blue_verified_badge:on",
			"tfw_legacy_timeline_sunset:true",
			"tfw_show_gov_verified_badge:on",
			"tfw_show_business_affiliate_badge:on",
			"tfw_tweet_edit_frontend:on",
		].join(";"),
	);
	url.searchParams.set("token", getToken(id));

	const res = await fetch(url.toString(), fetchOptions);
	const isJson = res.headers.get("content-type")?.includes("application/json");
	const data = isJson ? await res.json() : undefined;

	if (res.ok) {
		if (data?.__typename === "TweetTombstone") {
			console.error(`Tweet ${id} is unavailable (tombstone). It may have been made private.`);
			return undefined;
		}
		if (data && Object.keys(data as object).length === 0) {
			console.error(`Tweet ${id} returned empty data — it may have been deleted.`);
			return undefined;
		}
		return data as Tweet;
	}
	if (res.status === 404) {
		console.error(`Tweet ${id} not found (404).`);
		return undefined;
	}

	throw new TwitterApiError({
		message:
			typeof (data as Record<string, unknown>)?.error === "string"
				? String((data as Record<string, unknown>).error)
				: `Failed to fetch tweet ${id} (status ${res.status}).`,
		status: res.status,
		data,
	});
}

// ── Enrichment utilities ──────────────────────────────────────────────────────

const getTweetUrl = (tweet: TweetBase) =>
	`https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

const getUserUrl = (usernameOrTweet: string | TweetBase) =>
	`https://x.com/${
		typeof usernameOrTweet === "string" ? usernameOrTweet : usernameOrTweet.user.screen_name
	}`;

const getLikeUrl = (tweet: TweetBase) => `https://x.com/intent/like?tweet_id=${tweet.id_str}`;

const getReplyUrl = (tweet: TweetBase) => `https://x.com/intent/tweet?in_reply_to=${tweet.id_str}`;

const getFollowUrl = (tweet: TweetBase) =>
	`https://x.com/intent/follow?screen_name=${tweet.user.screen_name}`;

const getHashtagUrl = (hashtag: HashtagEntity) => `https://x.com/hashtag/${hashtag.text}`;

const getSymbolUrl = (symbol: SymbolEntity) => `https://x.com/search?q=%24${symbol.text}`;

const getInReplyToUrl = (tweet: Tweet) =>
	`https://x.com/${tweet.in_reply_to_screen_name}/status/${tweet.in_reply_to_status_id_str}`;

// ── Media helpers ─────────────────────────────────────────────────────────────

export const getMediaUrl = (media: MediaDetails, size: "small" | "medium" | "large"): string => {
	const url = new URL(media.media_url_https);
	const extension = url.pathname.split(".").pop();
	if (!extension) return media.media_url_https;
	url.pathname = url.pathname.replace(`.${extension}`, "");
	url.searchParams.set("format", extension);
	url.searchParams.set("name", size);
	return url.toString();
};

export const getMp4Video = (media: MediaAnimatedGif | MediaVideo) => {
	const sorted = media.video_info.variants
		.filter((v) => v.content_type === "video/mp4")
		.sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
	// Use second-highest quality to save bandwidth
	return sorted.length > 1 ? sorted[1] : sorted[0];
};

export const formatNumber = (n: number): string => {
	if (n > 999_999) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n > 999) return `${(n / 1_000).toFixed(1)}K`;
	return n.toString();
};

// ── Date formatting ───────────────────────────────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "2-digit",
	hour12: true,
	weekday: "short",
	month: "short",
	day: "numeric",
	year: "numeric",
});

type PartsObject = Record<keyof Intl.DateTimeFormatPartTypesRegistry, string>;

const partsToObject = (parts: ReturnType<typeof dateFormatter.formatToParts>): PartsObject => {
	const result = {} as PartsObject;
	for (const part of parts) {
		result[part.type] = part.value;
	}
	return result;
};

export const formatDate = (date: Date): string => {
	const p = partsToObject(dateFormatter.formatToParts(date));
	return `${p.hour}:${p.minute} ${p.dayPeriod} \u00B7 ${p.month} ${p.day}, ${p.year}`;
};

// ── Entity parsing ────────────────────────────────────────────────────────────

type TextEntity = { indices: Indices; type: "text" };

type TweetEntity = HashtagEntity | UserMentionEntity | UrlEntity | MediaEntity | SymbolEntity;

type EntityWithType =
	| TextEntity
	| (HashtagEntity & { type: "hashtag" })
	| (UserMentionEntity & { type: "mention" })
	| (UrlEntity & { type: "url" })
	| (MediaEntity & { type: "media" })
	| (SymbolEntity & { type: "symbol" });

export type Entity = { text: string } & (
	| TextEntity
	| (HashtagEntity & { type: "hashtag"; href: string })
	| (UserMentionEntity & { type: "mention"; href: string })
	| (UrlEntity & { type: "url"; href: string })
	| (MediaEntity & { type: "media"; href: string })
	| (SymbolEntity & { type: "symbol"; href: string })
);

function addEntities(
	result: EntityWithType[],
	type: EntityWithType["type"],
	entities: TweetEntity[],
): void {
	for (const entity of entities) {
		for (const [i, item] of result.entries()) {
			if (item.indices[0] > entity.indices[0] || item.indices[1] < entity.indices[1]) {
				continue;
			}
			const items = [{ ...entity, type }] as EntityWithType[];
			if (item.indices[0] < entity.indices[0]) {
				items.unshift({ indices: [item.indices[0], entity.indices[0]], type: "text" });
			}
			if (item.indices[1] > entity.indices[1]) {
				items.push({ indices: [entity.indices[1], item.indices[1]], type: "text" });
			}
			result.splice(i, 1, ...items);
			break;
		}
	}
}

function fixRange(tweet: TweetBase, entities: EntityWithType[]): void {
	const firstMedia = tweet.entities.media?.[0];
	if (firstMedia && firstMedia.indices[0] < tweet.display_text_range[1]) {
		tweet.display_text_range[1] = firstMedia.indices[0];
	}
	const last = entities.at(-1);
	if (last && last.indices[1] > tweet.display_text_range[1]) {
		last.indices[1] = tweet.display_text_range[1];
	}
}

function getEntities(tweet: TweetBase): Entity[] {
	const textMap = Array.from(tweet.text);
	const result: EntityWithType[] = [{ indices: tweet.display_text_range, type: "text" }];

	addEntities(result, "hashtag", tweet.entities.hashtags);
	addEntities(result, "mention", tweet.entities.user_mentions);
	addEntities(result, "url", tweet.entities.urls);
	addEntities(result, "symbol", tweet.entities.symbols);
	if (tweet.entities.media) {
		addEntities(result, "media", tweet.entities.media);
	}
	fixRange(tweet, result);

	return result.map((entity) => {
		const text = textMap.slice(entity.indices[0], entity.indices[1]).join("");
		switch (entity.type) {
			case "hashtag":
				return Object.assign(entity, { href: getHashtagUrl(entity), text });
			case "mention":
				return Object.assign(entity, { href: getUserUrl(entity.screen_name), text });
			case "url":
			case "media":
				return Object.assign(entity, { href: entity.expanded_url, text: entity.display_url });
			case "symbol":
				return Object.assign(entity, { href: getSymbolUrl(entity), text });
			default:
				return Object.assign(entity, { text });
		}
	});
}

// ── Enriched tweet types ──────────────────────────────────────────────────────

export type EnrichedTweet = Omit<Tweet, "entities" | "quoted_tweet"> & {
	url: string;
	user: TweetUser & { url: string; follow_url: string };
	like_url: string;
	reply_url: string;
	in_reply_to_url?: string | undefined;
	entities: Entity[];
	quoted_tweet?: EnrichedQuotedTweet | undefined;
};

export type EnrichedQuotedTweet = Omit<QuotedTweet, "entities"> & {
	url: string;
	entities: Entity[];
};

/**
 * Enrich a raw tweet with computed URLs and parsed entities for rendering.
 */
export const enrichTweet = (tweet: Tweet): EnrichedTweet => ({
	...tweet,
	url: getTweetUrl(tweet),
	user: {
		...tweet.user,
		url: getUserUrl(tweet),
		follow_url: getFollowUrl(tweet),
	},
	like_url: getLikeUrl(tweet),
	reply_url: getReplyUrl(tweet),
	in_reply_to_url: tweet.in_reply_to_screen_name ? getInReplyToUrl(tweet) : undefined,
	entities: getEntities(tweet),
	quoted_tweet: tweet.quoted_tweet
		? {
				...tweet.quoted_tweet,
				url: getTweetUrl(tweet.quoted_tweet),
				entities: getEntities(tweet.quoted_tweet),
			}
		: undefined,
});

// ── Card helpers ──────────────────────────────────────────────────────────────

export interface ParsedCard {
	type: "summary" | "summary_large_image";
	url: string;
	title: string;
	description?: string | undefined;
	domain: string;
	thumbnail?: { url: string; width: number; height: number } | undefined;
}

/**
 * Parse a raw TweetCard into a simplified structure for rendering.
 * Returns undefined if the card data is missing or unsupported.
 */
export function parseCard(card: TweetCard | undefined): ParsedCard | undefined {
	if (!card) return undefined;
	if (card.name !== "summary" && card.name !== "summary_large_image") return undefined;

	const bv = card.binding_values;
	const title = bv.title?.string_value;
	if (!title) return undefined;

	const domain = bv.vanity_url?.string_value ?? bv.domain?.string_value ?? "";
	const cardUrl = bv.card_url?.string_value ?? card.url;

	// Pick the best available thumbnail
	const thumbKey =
		card.name === "summary_large_image" ? "thumbnail_image_large" : "thumbnail_image";
	const thumb =
		bv[thumbKey]?.image_value ??
		bv.thumbnail_image_large?.image_value ??
		bv.thumbnail_image?.image_value;

	return {
		type: card.name,
		url: cardUrl,
		title,
		description: bv.description?.string_value,
		domain,
		thumbnail: thumb ? { url: thumb.url, width: thumb.width, height: thumb.height } : undefined,
	};
}
