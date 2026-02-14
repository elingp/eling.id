# Tweet Vendor Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the vendored Tweet component with react-tweet semantics (data + markup), keep Astro-first rendering, add/keep OGP card support, and remove AI slop while staying easy to maintain.

**Architecture:** Server-only Astro components. Centralize data normalization in `src/components/tweet/api.ts`; keep UI components small; extract shared primitives (`TweetLink`, `HighlightedLabel`, `QuotedTweetHeader/Body`, `TweetInfoCreatedAt`). CSS lives in `src/styles/blocks/tweet.css` with section dividers only.

**Tech Stack:** Astro 5, TypeScript, CSS, pnpm scripts (`pnpm run check`, `pnpm run fix`).

---

### Task 1: Normalize API and types (react-tweet parity)

**Files:**

- Modify: `src/components/tweet/api.ts`

**Step 1: Update Tweet user types to include highlighted labels**

```ts
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

export interface TweetUser {
	// ...
	highlighted_label?: UserHighlightedLabel;
}
```

**Step 2: Add fetchTweet + adjust getTweet semantics**

```ts
export async function fetchTweet(
	idOrUrl: string,
	fetchOptions?: RequestInit,
): Promise<{ data?: Tweet; tombstone?: true; notFound?: true }> {
	const id = extractTweetId(idOrUrl);

	if (id.length > 40 || !TWEET_ID.test(id)) {
		throw new Error(`Invalid tweet id: ${id}`);
	}

	const url = new URL(`${SYNDICATION_URL}/tweet-result`);
	// existing params + token logic...

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

	if (notFound) {
		console.error(
			`The tweet ${extractTweetId(idOrUrl)} does not exist or has been deleted by the account owner. Update your code to remove this tweet when possible.`,
		);
	} else if (tombstone) {
		console.error(
			`The tweet ${extractTweetId(idOrUrl)} has been made private by the account owner. Update your code to remove this tweet when possible.`,
		);
	}

	return data;
}
```

**Step 3: Replace Record casts with a small helper**

```ts
const getErrorMessage = (data: unknown, status: number, url: string) => {
	if (typeof data === "object" && data && "error" in data) {
		const error = (data as { error?: unknown }).error;
		if (typeof error === "string") return error;
	}
	return `Failed to fetch tweet at "${url}" with "${status}".`;
};
```

**Step 4: Add section divider comments in `api.ts`**

Use minimal ASCII headers only (no extra inline comments). Example:

```ts
// Types
// Fetching
// URL helpers
// Formatting
// Entities
// Enrichment
// Cards
```

**Step 5: Verification**

- Run: `pnpm run check`
- If it fails: `pnpm run fix` then `pnpm run check`

---

### Task 2: Add shared UI primitives

**Files:**

- Create: `src/components/tweet/TweetLink.astro`
- Create: `src/components/tweet/HighlightedLabel.astro`
- Create: `src/components/tweet/QuotedTweetHeader.astro`
- Create: `src/components/tweet/QuotedTweetBody.astro`
- Create: `src/components/tweet/TweetInfoCreatedAt.astro`

**Step 1: TweetLink**

```astro
---
interface Props {
	href: string;
}
const { href } = Astro.props;
---

<a href={href} class="tweet-link" target="_blank" rel="noopener noreferrer nofollow">
	<slot />
</a>
```

**Step 2: HighlightedLabel**

```astro
---
import type { TweetUser } from "./api.ts";

interface Props {
	user: TweetUser;
	className?: string;
}

const { user, className } = Astro.props;
const label = user.highlighted_label;
const url = label?.badge?.url;
const alt = label?.description ?? "Verified label";
---

{
	url ? (
		<span class:list={["tweet-highlighted-label", className]}>
			<img src={url} alt={alt} loading="lazy" decoding="async" />
		</span>
	) : null
}
```

**Step 3: QuotedTweetHeader**

```astro
---
import type { EnrichedQuotedTweet } from "./api.ts";
import HighlightedLabel from "./HighlightedLabel.astro";
import VerifiedBadge from "./VerifiedBadge.astro";

interface Props {
	tweet: EnrichedQuotedTweet;
}

const { tweet } = Astro.props;
const { user } = tweet;
---

<div class="tweet-quoted-header">
	<div class:list={["tweet-quoted-avatar", { square: user.profile_image_shape === "Square" }]}>
		<img src={user.profile_image_url_https} alt={user.name} width="20" height="20" loading="lazy" />
	</div>
	<span class="tweet-quoted-name">{user.name}</span>
	<VerifiedBadge {user} />
	<HighlightedLabel user={user} />
	<span class="tweet-quoted-username">@{user.screen_name}</span>
</div>
```

**Step 4: QuotedTweetBody**

```astro
---
import type { EnrichedQuotedTweet } from "./api.ts";

interface Props {
	tweet: EnrichedQuotedTweet;
}

const { tweet } = Astro.props;
---

<p class="tweet-quoted-body" lang={tweet.lang} dir="auto">
	{tweet.entities.map((item) => <span set:html={item.text} />)}
</p>
```

**Step 5: TweetInfoCreatedAt**

```astro
---
import type { EnrichedTweet } from "./api.ts";
import { formatDate } from "./api.ts";

interface Props {
	tweet: EnrichedTweet;
}

const { tweet } = Astro.props;
const createdAt = new Date(tweet.created_at);
const formatted = formatDate(createdAt);
---

<a
	href={tweet.url}
	class="tweet-info-link"
	target="_blank"
	rel="noopener noreferrer"
	aria-label={formatted}
>
	<time datetime={createdAt.toISOString()}>{formatted}</time>
</a>
```

**Step 6: Verification**

- Run: `pnpm run check`

---

### Task 3: Update main components to use primitives + remove slop

**Files:**

- Modify: `src/components/tweet/TweetHeader.astro`
- Modify: `src/components/tweet/TweetBody.astro`
- Modify: `src/components/tweet/QuotedTweet.astro`
- Modify: `src/components/tweet/TweetInfo.astro`
- Modify: `src/components/tweet/TweetReplies.astro`

**Step 1: TweetHeader updates**

- Import and render `HighlightedLabel`
- Inline the square check in `class:list` (remove `isSquare`)

```astro
import HighlightedLabel from "./HighlightedLabel.astro"; ...
<div class:list={["tweet-avatar-img", { square: user.profile_image_shape === "Square" }]}>
	<VerifiedBadge {user} />
	<HighlightedLabel user={user} />
</div>
```

**Step 2: TweetBody updates**

- Use `TweetLink` for hashtag/mention/url/symbol
- Keep `set:html` for text

```astro
import TweetLink from "./TweetLink.astro"; ... case "hashtag": case "mention": case "url": case
"symbol": return <TweetLink href={item.href}>{item.text}</TweetLink>; ...
{
	tweet.note_tweet ? (
		<TweetLink href={tweet.url}>
			<span>&nbsp;</span>
			Show more
		</TweetLink>
	) : null
}
```

**Step 3: QuotedTweet refactor**

- Replace inline header/body with `QuotedTweetHeader` + `QuotedTweetBody`

```astro
import QuotedTweetHeader from "./QuotedTweetHeader.astro"; import QuotedTweetBody from
"./QuotedTweetBody.astro"; ...
<QuotedTweetHeader {tweet} />
<QuotedTweetBody {tweet} />
```

**Step 4: TweetInfo**

- Use `TweetInfoCreatedAt` and remove local date formatting

```astro
import TweetInfoCreatedAt from "./TweetInfoCreatedAt.astro"; ...
<TweetInfoCreatedAt {tweet} />
```

**Step 5: TweetReplies**

- Inline conversation count to remove `repliesText` variable (match upstream)

```astro
<span class="tweet-replies-text">
	{
		tweet.conversation_count === 0
			? "Read more on X"
			: tweet.conversation_count === 1
				? `Read ${formatNumber(tweet.conversation_count)} reply`
				: `Read ${formatNumber(tweet.conversation_count)} replies`
	}
</span>
```

**Step 6: Verification**

- Run: `pnpm run check`

---

### Task 4: Media parity + slop cleanup

**Files:**

- Modify: `src/components/tweet/TweetMedia.astro`
- Modify: `src/components/tweet/TweetMediaVideo.astro`

**Step 1: Align grid logic + skeleton style (inline class logic)**

```astro
<div
	class:list={[
		"tweet-media-grid",
		{ "cols-2": length > 1, "grid-3": length === 3, "grid-4": length > 4 },
	]}
>
</div>
```

```ts
const getSkeletonPadding = (m: MediaDetails, count: number): string => {
	let padding = 56.25;
	if (count === 1) padding = (100 / m.original_info.width) * m.original_info.height;
	if (count === 2) padding *= 2;
	return `${padding}%`;
};
```

**Step 2: Add `playsinline` and `preload="none"`**

- Consider muting only animated_gif:

```astro
<video
	class="tweet-media-video"
	poster={getMediaUrl(media, "small")}
	controls
	playsinline
	preload="none"
	muted={media.type === "animated_gif"}
	loop={media.type === "animated_gif"}></video>
```

**Step 3: Verification**

- Run: `pnpm run check`

---

### Task 5: OGP card parsing improvements

**Files:**

- Modify: `src/components/tweet/api.ts`
- Modify: `src/components/tweet/TweetCard.astro`

**Step 1: Harden `parseCard`**

- Add helper to read string/image values safely
- Derive domain from URL when missing
- Prefer large thumbnail for `summary_large_image`

```ts
const getString = (value?: CardBindingValue) =>
	typeof value?.string_value === "string" ? value.string_value : undefined;

const getImage = (value?: CardBindingValue) => value?.image_value;

const getDomain = (url: string, fallback?: string) => {
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
```

**Step 2: Add `nofollow` to card link**

```astro
<a
	href={card.url}
	class:list={["tweet-card", card.type]}
	target="_blank"
	rel="noopener noreferrer nofollow"></a>
```

**Step 3: Verification**

- Run: `pnpm run check`

---

### Task 6: CSS cleanup + section dividers

**Files:**

- Modify: `src/styles/blocks/tweet.css`

**Step 1: Add section comments (minimal only)**
Example headers:

```
/* Base */
...
/* Not Found */
/* Header */
/* Body */
/* Media */
/* Card */
/* Quoted */
/* Info */
/* Actions */
/* Replies */
```

**Step 2: Add styles for new primitives**

- `.tweet-link` matching existing link styles
- `.tweet-highlighted-label` (size + alignment)
- If needed, add `.tweet-quoted-avatar.square`

```css
.tweet-link {
	color: var(--tweet-blue-secondary);
	text-decoration: none;
}

.tweet-link:hover {
	text-decoration: underline;
}

.tweet-highlighted-label img {
	height: 1em;
	vertical-align: text-bottom;
}
```

**Step 3: Remove any unused selectors or redundant rules created by refactors**

**Step 4: Verification**

- Run: `pnpm run check`

---

### Task 7: Manual QA (required)

**Step 1: Visual checks**

- Run: `pnpm run dev`
- Open `posts/astro-embed` and verify:
  - Link card renders when no media
  - Image grid (1/2/3/4+) looks correct
  - Video still loads and plays
  - Highlighted label appears when present
  - Quoted tweets show header/body and media

**Step 2: Final validation**

- Run: `pnpm run check`
- If formatting fails: `pnpm run fix` then `pnpm run check`

---

### Handoff (no commits)

Per repo instructions, do not commit. Provide a handoff summary:

- Files changed
- Commands run
- Suggested Conventional Commit message
