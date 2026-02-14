// Types
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

export interface TweetUser {
	id_str: string;
	name: string;
	profile_image_url_https: string;
	profile_image_shape: "Circle" | "Square" | "Hexagon";
	screen_name: string;
	verified: boolean;
	verified_type?: "Business" | "Government";
	is_blue_verified: boolean;
	highlighted_label?: UserHighlightedLabel;
}

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

export interface HighlightedBadge {
	url: string;
}

export interface UserHighlightedLabel {
	description?: string;
	badge?: HighlightedBadge;
	url?: { url: string; url_type: "DeepLink" };
	user_label_type: "BusinessLabel";
	user_label_display_type: "Badge";
}

export interface TweetEditControl {
	edit_tweet_ids: string[];
	editable_until_msecs: string;
	is_edit_eligible: boolean;
	edits_remaining: string;
}

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

export interface BirdwatchTextEntity {
	fromIndex: number;
	toIndex: number;
	ref: {
		url?: {
			url: string;
			urlType: string;
		};
	};
}

export interface BirdwatchTextWithEntities {
	text: string;
	entities: BirdwatchTextEntity[];
}

export interface BirdwatchPivot {
	destinationUrl: string;
	title?: string;
	shorttitle?: string;
	visualStyle: string;
	subtitle?: BirdwatchTextWithEntities;
	iconType: string;
	footer?: BirdwatchTextWithEntities;
	noteId: string;
	footerIconType?: string;
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
	news_action_type: "conversation";
	quoted_tweet?: QuotedTweet;
	in_reply_to_screen_name?: string;
	in_reply_to_status_id_str?: string;
	in_reply_to_user_id_str?: string;
	parent?: TweetParent;
	possibly_sensitive?: boolean;
	note_tweet?: { id: string } | undefined;
	card?: TweetCard;
	birdwatch_pivot?: BirdwatchPivot;
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

// Fetching
const SYNDICATION_URL = "https://cdn.syndication.twimg.com";
const TWEET_ID = /^[0-9]+$/;

function getToken(id: string): string {
	return ((Number(id) / 1e15) * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, "");
}

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

const getErrorMessage = (data: unknown, status: number, url: string): string => {
	if (typeof data === "object" && data && "error" in data) {
		const error = (data as { error?: unknown }).error;
		if (typeof error === "string") return error;
	}
	return `Failed to fetch tweet at "${url}" with "${status}".`;
};

export async function fetchTweet(
	idOrUrl: string,
	fetchOptions?: RequestInit,
): Promise<{ data?: Tweet; tombstone?: true; notFound?: true }> {
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
		if (data?.__typename === "TweetTombstone") return { tombstone: true };
		if (data && Object.keys(data).length === 0) return { notFound: true };
		return { data: data as Tweet };
	}
	if (res.status === 404) return { notFound: true };

	throw new TwitterApiError({
		message: getErrorMessage(data, res.status, url.toString()),
		status: res.status,
		data,
	});
}

export async function getTweet(
	idOrUrl: string,
	fetchOptions?: RequestInit,
): Promise<Tweet | undefined> {
	const { data, tombstone, notFound } = await fetchTweet(idOrUrl, fetchOptions);
	const id = extractTweetId(idOrUrl);

	if (notFound) {
		console.error(
			`The tweet ${id} does not exist or has been deleted by the account owner. Update your code to remove this tweet when possible.`,
		);
	} else if (tombstone) {
		console.error(
			`The tweet ${id} has been made private by the account owner. Update your code to remove this tweet when possible.`,
		);
	}

	return data;
}

// URL helpers
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

export const getMediaUrl = (media: MediaDetails, size: "small" | "medium" | "large"): string => {
	const url = new URL(media.media_url_https);
	const extension = url.pathname.split(".").pop();
	if (!extension) return media.media_url_https;
	url.pathname = url.pathname.replace(`.${extension}`, "");
	url.searchParams.set("format", extension);
	url.searchParams.set("name", size);
	return url.toString();
};

// Formatting
const getMp4Videos = (media: MediaAnimatedGif | MediaVideo) => {
	const { variants } = media.video_info;
	return variants
		.filter((vid) => vid.content_type === "video/mp4")
		.sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));
};

export const getMp4Video = (media: MediaAnimatedGif | MediaVideo) => {
	const mp4Videos = getMp4Videos(media);
	return mp4Videos.length > 1 ? mp4Videos[1] : mp4Videos[0];
};

export const formatNumber = (n: number): string => {
	if (n > 999999) return `${(n / 1000000).toFixed(1)}M`;
	if (n > 999) return `${(n / 1000).toFixed(1)}K`;
	return n.toString();
};

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

// Entities
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

// Enrichment
export type EnrichedTweet = Omit<Tweet, "entities" | "quoted_tweet"> & {
	url: string;
	user: {
		url: string;
		follow_url: string;
	};
	like_url: string;
	reply_url: string;
	in_reply_to_url?: string | undefined;
	entities: Entity[];
	quoted_tweet?: EnrichedQuotedTweet | undefined;
	note_tweet?: { id: string } | undefined;
};

export type EnrichedQuotedTweet = Omit<QuotedTweet, "entities"> & {
	url: string;
	entities: Entity[];
};

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
	note_tweet: tweet.note_tweet,
});

// Cards
export interface ParsedCard {
	type: "summary" | "summary_large_image";
	url: string;
	title: string;
	description?: string | undefined;
	domain: string;
	thumbnail?: { url: string; width: number; height: number } | undefined;
}

const getString = (value?: CardBindingValue): string | undefined =>
	typeof value?.string_value === "string" ? value.string_value : undefined;

const getImage = (value?: CardBindingValue): CardImageValue | undefined => value?.image_value;

const getDomain = (url: string, fallback?: string): string => {
	try {
		const host = new URL(url).hostname.replace(/^www\./, "");
		return fallback?.trim() || host;
	} catch {
		return fallback?.trim() || "";
	}
};

export function parseCard(card: TweetCard | undefined): ParsedCard | undefined {
	if (!card) return undefined;
	if (card.name !== "summary" && card.name !== "summary_large_image") return undefined;

	const bv = card.binding_values;
	const title = getString(bv.title);
	if (!title) return undefined;

	const cardUrl = getString(bv.card_url) ?? card.url;
	const domain = getDomain(cardUrl, getString(bv.vanity_url) ?? getString(bv.domain));
	const thumbKey =
		card.name === "summary_large_image" ? "thumbnail_image_large" : "thumbnail_image";
	const thumb =
		getImage(bv[thumbKey]) ?? getImage(bv.thumbnail_image_large) ?? getImage(bv.thumbnail_image);

	return {
		type: card.name,
		url: cardUrl,
		title,
		description: getString(bv.description),
		domain,
		thumbnail: thumb ? { url: thumb.url, width: thumb.width, height: thumb.height } : undefined,
	};
}
