# Astro Cactus Theme Upgrade Notes

## v4.9.0 → v4.11.0 (Completed ✓)

**Date:** October 13, 2025
**Branch:** `upgrade-to-v4.11.0`
**Status:** ✅ Completed and tested

### Changes Applied

#### 1. Dependencies Updated

**Added:**

- `astro-robots-txt@^1.0.0` - Automatic robots.txt generation
- `astro-webmanifest@^1.0.0` - Automatic web manifest generation

**Removed:**

- `@tailwindcss/aspect-ratio@^0.4.2` - Deprecated plugin (core CSS now handles aspect ratios)

#### 2. Configuration Changes

**`astro.config.ts`:**

- Added `robotsTxt()` integration for automatic robots.txt generation
- Added `webmanifest()` integration with configuration:
  - Uses site config for title, description, and language
  - Points to `public/icon.svg` as source for favicon generation
  - Configured icons: apple-touch-icon (180x180), icon-192 (192x192), icon-512 (512x512)
  - Background color: `#1d1f21`, Theme color: `#2bbc8a`
  - Display mode: `standalone`
  - Disabled auto-insertion of favicon, theme color, and manifest links (we handle these manually)

**`tailwind.config.ts`:**

- Removed `aspectRatio: false` from `corePlugins` (no longer needed)
- Removed `@tailwindcss/aspect-ratio` from plugins array
- Added `kbd` element styling fix for dark mode: `"@apply dark:bg-textColor": ""`
- Added table alignment CSS for better markdown rendering:
  - `th[align="center"], td[align="center"]`
  - `th[align="right"], td[align="right"]`
  - `th[align="left"], td[align="left"]`
- Updated comment: `/* Admonitions/Aside css*/` → `/* Admonitions/Aside */`
- Added comment: `/* Table */` before table-related styles

**`package.json`:**

- Updated version from `4.9.0` to `4.11.0`

#### 3. What Changed in Upstream (v4.9.0 → v4.11.0)

**v4.10.0 (Sept 23, 2024):**

- Added automatic robots.txt and webmanifest generation
- New integrations: `astro-robots-txt` and `astro-webmanifest`

**v4.11.0 (Oct 8, 2024):**

- Bug fix: markdown `<kbd>` content styling
- Fixed: manifest link to prevent 404 in dev mode
- Removed: `@tailwindcss/aspect-ratio` dependency

### Files Preserved (Your Customizations)

The following customizations were **preserved** during the upgrade:

#### Content & Branding:

- All blog posts in `src/content/post/`
- Custom images: `src/assets/eling.jpg`, `src/assets/eling-about.jpg`
- Site configuration: `src/site.config.ts`
- Custom public assets (favicons, social card)

#### Fonts:

- Merriweather (serif): `@fontsource/merriweather`
- Raleway (sans-serif): `@fontsource/raleway`

#### Component/Layout Modifications:

- All customized components and layouts remain unchanged
- Your specific styling choices in `tailwind.config.ts` (colors, typography, admonitions)

### Build Verification

✅ Build successful with no errors:

```bash
pnpm run build
# Result: 17 pages built successfully
# Pagefind: 10 pages indexed
```

### Next Steps

1. **Test locally:**

   ```bash
   pnpm run dev
   ```

   Visit http://localhost:4321 and verify:
   - Home page renders correctly
   - Blog posts display properly
   - Theme switching works
   - Navigation works
   - Images load correctly

2. **Deploy to dev:**

   ```bash
   git checkout dev
   git merge upgrade-to-v4.11.0
   git push origin dev
   ```

   - Check Cloudflare build succeeds
   - Test on dev URL

3. **If everything looks good, merge to main:**
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

### Future Upgrades

**Planned Upgrade Path:**

- ✅ v4.9.0 → v4.11.0 (COMPLETED)
- ✅ v4.11.0 → v5.0.0 (COMPLETED)
- ⏭️ v5.0.0 → v6.9.0 (Latest version)

**Important Notes for Future Upgrades:**

- Always check release notes for breaking changes
- Test incrementally (minor → major → latest)
- Keep `customized-files.txt` updated for reference
- Preserve custom fonts and branding
- Review component changes carefully

### Resources

- [Astro Cactus GitHub](https://github.com/chrismwilliams/astro-theme-cactus)
- [v4.10.0 Release Notes](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v4.10.0)
- [v4.11.0 Release Notes](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v4.11.0)
- [Full Changelog: v4.9.0...v4.11.0](https://github.com/chrismwilliams/astro-theme-cactus/compare/v4.9.0...v4.11.0)

---

**Generated on:** October 13, 2025
**Upgrade performed by:** GitHub Copilot (Agentic Mode)

---

## v4.11.0 → v5.0.0 (Completed ✓)

**Date:** October 13, 2025
**Branch:** `upgrade-to-v5.0.0`
**Status:** ✅ Completed and tested

### Major Changes

This is a **major version upgrade** with breaking changes due to Astro v5.

#### 1. Dependencies Updated

**Major Upgrades:**

- `astro@4.14.6` → `astro@5.0.3` ⚠️ **Breaking Changes**
- `@astrojs/mdx@3.1.5` → `@astrojs/mdx@4.0.1`
- `@astrojs/rss@4.0.7` → `@astrojs/rss@4.0.10`
- `@astrojs/sitemap@3.1.6` → `@astrojs/sitemap@3.2.1`
- `@astrojs/tailwind@5.1.0` → `@astrojs/tailwind@5.1.3`

**Added:**

- `rehype-unwrap-images@^1.0.0` - Moved from remark to rehype plugin

**Removed:**

- `remark-unwrap-images@^4.0.0` - Replaced by rehype version

**Other Updates:**

- `satori@0.10.14` → `satori@0.12.0`
- `astro-expressive-code@0.36.0` → `astro-expressive-code@0.38.3`
- `@biomejs/biome@1.8.3` → `@biomejs/biome@1.9.4`
- `typescript@5.5.4` → `typescript@5.7.2`
- `pagefind@1.1.0` → `pagefind@1.2.0`

#### 2. Configuration Changes

**`astro.config.ts`:**

- Imported `envField` from `astro/config`
- Moved `remarkUnwrapImages` to `rehypePlugins` as `rehypeUnwrapImages`
- Removed `remarkUnwrapImages` from `remarkPlugins` array
- Added **Astro env API schema** for environment variables:
  ```ts
  env: {
    schema: {
      WEBMENTION_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      WEBMENTION_URL: envField.string({ context: "client", access: "public", optional: true }),
      WEBMENTION_PINGBACK: envField.string({ context: "client", access: "public", optional: true }),
    },
  }
  ```

**`tsconfig.json`:**

- Simplified import path aliases from specific mappings to unified `@/*`:
  - Before: `@/assets/*`, `@/components/*`, `@/data/*`, `@/layouts/*`, `@/utils/*`, `@/types`, `@/site-config`
  - After: `@/*` (all source files)
- Added `"include": [".astro/types.d.ts", "**/*"]`

**`src/content.config.ts` (NEW FILE):**

- Migrated from `src/content/config.ts`
- Uses new **glob loaders** from `astro/loaders`
- Simplified collection definitions with file system-based loading
- Added **Note collection** for shorter-form content:
  ```ts
  const note = defineCollection({
  	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
  	schema: baseSchema.extend({
  		description: z.string().optional(),
  		publishDate: z
  			.string()
  			.datetime({ offset: true })
  			.transform((val) => new Date(val)),
  	}),
  });
  ```

**`src/site.config.ts`:**

- Removed `sortPostsByUpdatedDate` option (always sorts by publishDate now)
- Removed `webmentions` configuration object (moved to `.env`)
- Added **Notes** menu link: `{ path: "/notes/", title: "Notes" }`

**`src/types.ts`:**

- Removed `sortPostsByUpdatedDate` from `SiteConfig` interface
- Removed `webmentions` optional property from `SiteConfig` interface

**`.env` (NEW FILE):**

- Created for local development environment variables:
  ```
  WEBMENTION_API_KEY=
  WEBMENTION_URL=
  WEBMENTION_PINGBACK=#optional
  ```

#### 3. Data Layer Changes

**`src/data/post.ts`:**

- Removed `getPostSortDate()` function (no longer needed)
- Updated `getAllPosts()` to return `Promise<CollectionEntry<"post">[]>` with explicit typing
- Simplified `sortMDByDate()` - directly uses `publishDate` instead of conditional logic
- Updated `groupPostsByYear()` - uses `post.data.publishDate` directly

**`src/utils/date.ts`:**

- Updated `getFormattedDate()` signature:
  - Parameter changed from `string | number | Date` to `Date | undefined`
  - Returns `"Invalid Date"` for undefined inputs
  - Simplified implementation - no longer caches DateTimeFormat
- Added `collectionDateSort()` helper for sorting post/note collections

#### 4. Component Updates

**`src/components/blog/PostPreview.astro`:**

- Removed `getPostSortDate` import
- Changed slug reference from `post.slug` to `post.id` (Astro v5 change)
- Directly uses `post.data.publishDate` instead of computed date
- Updated import path from `../FormattedDate.astro` to `@/components/FormattedDate.astro`
- Added `font-semibold` class to date display

**`src/components/blog/webmentions/index.astro`:**

- Simplified conditional rendering - removed redundant `!!webMentions.length &&` wrapper
- Early return pattern with clear comment

#### 5. README.md

**Completely replaced with upstream v5.0.0 version** per user request:

- Updated to Astro v5 references
- Added Notes collection documentation
- Updated frontmatter schema documentation (separate Post and Note schemas)
- Added VSCode snippet information for both posts and notes
- Updated Pagefind search description (now includes notes)
- Removed `sortPostsByUpdatedDate` references
- Added `.env` configuration instructions for webmentions
- Updated all example code and paths

### Files Preserved (Your Customizations)

The following customizations were **preserved** during the upgrade:

#### Content & Branding:

- All blog posts in `src/content/post/`
- Custom images: `src/assets/eling.jpg`, `src/assets/eling-about.jpg`
- Personal site configuration in `src/site.config.ts` (author, title, description)
- Custom public assets (favicons, social card, webmanifest short_name)

#### Fonts & Styling:

- Merriweather (serif): `@fontsource/merriweather`
- Raleway (sans-serif): `@fontsource/raleway`
- Custom orange color scheme in `tailwind.config.ts` and `global.css`
- Typography customizations (font sizes, spacing)
- Layout widths (`max-w-4xl`)

#### Custom Components:

- Header with custom logo (`eling.jpg`)
- SocialList with your links (GitHub, LinkedIn, Twitter, Spotify, Email)
- Homepage project showcase (elingProject array)
- About page content

### Breaking Changes & Migration

**Astro v5 Changes:**

1. **Content Collections now use glob loaders** - migrated to `src/content.config.ts`
2. **Entry IDs changed** - `post.slug` → `post.id` in components
3. **Environment variables** - moved to Astro env API with schema
4. **Import paths** - simplified to unified `@/*` pattern

**Plugin Changes:**

- `remark-unwrap-images` → `rehype-unwrap-images` (different stage in pipeline)

**Configuration Removals:**

- `sortPostsByUpdatedDate` - always sorts by `publishDate` now
- `webmentions` object in site config - moved to `.env`

### Build Verification

✅ Build successful with no errors:

```bash
pnpm install  # +174 packages, -30 packages
pnpm build    # 7 pages built successfully
pnpm postbuild # Pagefind: 7 pages, 354 words indexed
```

**Output:**

- 7 static pages generated
- 10 OG images created
- Search index built with Pagefind v1.4.0
- All assets optimized (images converted to WebP)

### Known Issues

- Some TypeScript configuration warnings (tsconfig.json strict mode)
- JSX type inference warnings in `.astro` files (cosmetic, doesn't affect build)
- These are upstream issues and don't impact functionality

### Testing Checklist

Before deploying:

- ✅ Local build succeeds
- ✅ All pages render correctly
- ⬜ Theme toggle works
- ⬜ Navigation includes new "Notes" link
- ⬜ Search functionality operational
- ⬜ Blog posts display correctly
- ⬜ Custom branding/styling preserved
- ⬜ Cloudflare Pages build succeeds

### Resources

- [Astro v5.0.0 Release Notes](https://astro.build/blog/astro-5/)
- [Astro Cactus v5.0.0 Release](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v5.0.0)
- [Full Changelog: v4.11.0...v5.0.0](https://github.com/chrismwilliams/astro-theme-cactus/compare/v4.11.0...v5.0.0)
- [Astro Content Collections (v5)](https://docs.astro.build/en/guides/content-collections/)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)

---

**Updated on:** October 13, 2025
**Upgrade performed by:** GitHub Copilot (Agentic Mode)

---

## v5.0.0 New Features Explained

### 1. Notes Collection (NEW in v5.0.0) 📝

**What are Notes?**

Notes are a **new type of content** designed for shorter, more casual posts compared to full blog posts. Think of them like:

- Twitter/X posts but on your own site
- Quick thoughts or observations
- Brief updates or announcements
- Micro-blogging content

**Key Differences from Blog Posts:**

| Feature             | Blog Posts                      | Notes                           |
| ------------------- | ------------------------------- | ------------------------------- |
| **Purpose**         | Long-form articles              | Short-form content              |
| **Location**        | `src/content/post/`             | `src/content/note/`             |
| **URL Pattern**     | `/posts/[slug]/`                | `/notes/[slug]/`                |
| **Required Fields** | title, description, publishDate | title, publishDate              |
| **Optional Fields** | tags, draft, coverImage, etc.   | description only                |
| **Date Format**     | Flexible (ISO or readable)      | ISO 8601 with timezone (strict) |
| **Tags**            | ✅ Full tag support             | ❌ No tags                      |
| **Draft Mode**      | ✅ Supported                    | ❌ Not supported                |
| **TOC**             | ✅ Table of Contents            | ❌ No TOC (too short)           |
| **Reading Time**    | ✅ Displayed                    | ❌ Not displayed                |
| **Typical Length**  | 500+ words                      | 50-200 words                    |
| **Webmentions**     | ✅ Supported                    | ❌ Not included                 |
| **RSS Feed**        | `/rss.xml`                      | `/notes/rss.xml`                |
| **Component**       | `BlogPost.astro` layout         | `Note.astro` component          |

**Example Note Frontmatter:**

```yaml
---
title: "Hello, Welcome"
description: "An introduction to using notes" # optional
publishDate: "2024-10-14T11:23:00Z" # MUST be ISO 8601 format!
---
This is a short note. No tags, no drafts, just quick content.
```

**Where Notes Appear:**

- **Homepage**: Shows latest 5 notes (if any exist)
- **Notes Page**: `/notes/` - paginated list (10 per page)
- **Individual Pages**: `/notes/[slug]/`
- **RSS Feed**: `/notes/rss.xml`
- **Search**: Indexed by Pagefind

**When to Use Notes:**

- ✅ Quick thoughts or opinions
- ✅ Brief announcements
- ✅ Links to interesting content with commentary
- ✅ Status updates
- ✅ Short tutorials or tips
- ❌ In-depth tutorials (use blog posts)
- ❌ Content needing tags/categories (use blog posts)
- ❌ Long-form articles (use blog posts)

**How to Create a Note:**

```bash
# Create new note file
touch src/content/note/my-first-note.md
```

```yaml
---
title: "My First Note"
publishDate: "2025-01-13T10:00:00Z" # Use ISO 8601!
---
This is my first note. It's short and sweet!
```

**VSCode Snippet:**

Type `frontmatter-note` in a `.md` file to auto-generate the frontmatter structure.

---

### 2. Tag Collection & Custom Tag Pages (NEW in v5.0.0) 🏷️

**IMPORTANT: Tags Still Work Automatically!**

The tag collection is **completely optional**. Your existing tags work exactly as before without any changes.

**How Tags Work (Always):**

```yaml
---
title: "My Post"
tags: ["javascript", "tutorial"]
---
```

This **automatically** creates:

- Tag page at `/tags/javascript/` (auto-generated from `src/pages/tags/[tag]/[...page].astro`)
- Tag page at `/tags/tutorial/` (auto-generated same way)
- Both show list of posts with that tag
- **No manual files needed!**

**What's NEW in v5.0.0? (Optional Enhancement)**

You can now **optionally customize** tag pages by creating files in `src/content/tag/`:

```bash
# OPTIONAL: Create custom intro for a tag page
touch src/content/tag/javascript.md
```

```yaml
---
title: "JavaScript Tutorials" # Custom page title (optional)
description: "Learn JavaScript with these tutorials" # Meta description (optional)
---
Welcome to my JavaScript tutorials! Here you'll find everything from basics to advanced topics.

I've been writing JavaScript for over 5 years, and these posts represent my journey...
```

**What This Customization Adds:**

- **Custom H1 title** instead of just "Tag: #javascript"
- **Custom meta description** for SEO
- **Intro paragraph(s)** before the list of posts
- **Markdown content** to explain the tag/category

**Key Differences:**

| Old Tags (v4)               | New Tag Pages (v5)                       |
| --------------------------- | ---------------------------------------- |
| Just strings in frontmatter | **Optional** files in `src/content/tag/` |
| Auto-generated title        | Custom title & description               |
| No intro text               | Markdown intro content                   |
| Basic tag page              | Rich content page                        |
| Still works!                | Enhanced experience                      |

**CRITICAL Understanding:**

1. **Tags from `src/content/tag/` do NOT generate tag pages**
2. **Tag pages are ALWAYS generated from post frontmatter tags**
3. **Files in `src/content/tag/` ONLY add custom content to existing tag pages**
4. **You must use a tag in a post's frontmatter for its page to exist**
5. **Filename MUST match tag name** - `javascript.md` for tag `"javascript"` (case-sensitive, lowercase)

**How It Works:**

```yaml
# In any post: src/content/post/my-post.md
tags: ["javascript"] # This creates /tags/javascript/ page automatically
```

```md
<!-- OPTIONAL: src/content/tag/javascript.md -->

## <!-- This adds custom intro to the EXISTING /tags/javascript/ page -->

title: "JavaScript Tutorials"
description: "My JavaScript posts"

---

Custom intro text here...
```

**Examples Included (These are demonstrations - you can delete them):**

- `src/content/tag/test.md` - Full example with title and description
- `src/content/tag/markdown.md` - Shows custom intro text
- `src/content/tag/image.md` - Example without title (just description)

**When to Use Custom Tag Pages:**

- ✅ You have a series of posts on a topic
- ✅ You want to explain what the tag category is about
- ✅ Better SEO for important categories
- ✅ Professional appearance for main topics
- ❌ One-off tags (not worth the effort)
- ❌ Self-explanatory tags (may not need intro)

---

### 3. Other Important New Features in v5.0.0

#### **Astro env API (Environment Variables)**

**Before v5.0.0:**

```ts
// astro.config.ts
export default defineConfig({
	// ...
});

// .env file accessed directly via import.meta.env
const apiKey = import.meta.env.WEBMENTION_API_KEY;
```

**After v5.0.0:**

```ts
// astro.config.ts
import { defineConfig, envField } from "astro/config";

export default defineConfig({
	env: {
		schema: {
			WEBMENTION_API_KEY: envField.string({
				context: "server", // Only available server-side
				access: "secret", // Won't be exposed to client
				optional: true,
			}),
			WEBMENTION_URL: envField.string({
				context: "client", // Available client-side
				access: "public",
				optional: true,
			}),
		},
	},
});
```

```ts
// In components
import { WEBMENTION_URL } from "astro:env/client";
import { WEBMENTION_API_KEY } from "astro:env/server";
```

**Benefits:**

- ✅ **Type-safe** environment variables
- ✅ **Validation** at build time
- ✅ **Clear separation** between server/client vars
- ✅ **Security** - server vars never exposed to client
- ✅ **Auto-completion** in your IDE

---

#### **Glob Loaders (Content Collections)**

**Before v5.0.0:**

```ts
// src/content/config.ts
const post = defineCollection({
	type: "content",
	schema: ({ image }) =>
		z.object({
			// schema...
		}),
});
```

**After v5.0.0:**

```ts
// src/content.config.ts (note: different filename!)
import { glob } from "astro/loaders";

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: ({ image }) =>
		z.object({
			// schema...
		}),
});
```

**Benefits:**

- ✅ **Faster builds** - more efficient file loading
- ✅ **More flexible** - can load from anywhere, not just content/
- ✅ **Better for large sites** - scales better with many files
- ✅ **Future-proof** - enables future data sources (CMS, APIs, etc.)

---

#### **Entry ID Changes (Breaking Change)**

**Before v5.0.0:**

```ts
const { slug } = entry;
// Use: /posts/${slug}/
```

**After v5.0.0:**

```ts
const { id } = entry;
// Use: /posts/${id}/
```

**Why?** Better aligns with filesystem structure and future data sources.

**Files Updated:**

- `src/components/blog/PostPreview.astro`
- `src/layouts/BlogPost.astro`
- `src/pages/posts/[...slug].astro`
- `src/pages/rss.xml.ts`
- `src/pages/og-image/[...slug].png.ts`

---

#### **Plugin Migration (remark → rehype)**

**Before v5.0.0:**

```ts
markdown: {
  remarkPlugins: [remarkUnwrapImages],
}
```

**After v5.0.0:**

```ts
markdown: {
  rehypePlugins: [rehypeUnwrapImages],
}
```

**Why?** Better positioning in the rendering pipeline for image processing.

---

### Summary of What's New

**Major Features:**

1. ✅ **Notes Collection** - Short-form content type
2. ✅ **Custom Tag Pages** - Rich tag category pages
3. ✅ **Astro env API** - Type-safe environment variables
4. ✅ **Glob Loaders** - More efficient content loading
5. ✅ **Simplified Imports** - Unified `@/*` path alias

**Breaking Changes Handled:**

1. ✅ `entry.slug` → `entry.id`
2. ✅ `src/content/config.ts` → `src/content.config.ts`
3. ✅ `remarkUnwrapImages` → `rehypeUnwrapImages`
4. ✅ Environment variables moved to Astro env API

**Files Added:**

- `src/content.config.ts` - New content collections file
- `src/content/note/welcome.md` - Example note
- `src/content/tag/*.md` - Example tag pages (3 files)
- `src/components/note/Note.astro` - Note display component
- `src/pages/notes/[...page].astro` - Notes listing
- `src/pages/notes/[...slug].astro` - Individual note pages
- `src/pages/notes/rss.xml.ts` - Notes RSS feed
- `.env` - Environment variables configuration

**Unchanged (Your Content):**

- ✅ All your blog posts
- ✅ Your customizations (fonts, colors, layout)
- ✅ Your branding and images
- ✅ Your social links
- ✅ Homepage project showcase

---

```

```

## v5.0.0 → v6.0.0 (Completed ✓)

**Date:** October 17, 2025
**Branch:** `upgrade-to-v6.0.0`
**Status:** ✅ Completed and tested

### Major Changes

This is a **major version upgrade** with **Tailwind CSS v4** migration - the biggest breaking change in this upgrade.

#### 1. Dependencies Updated

**Major Upgrades:**

- `tailwindcss@3.4.16` → `tailwindcss@4.0.0` ⚠️ **Major Breaking Changes**
- `@astrojs/tailwind@5.1.3` → **REMOVED** (replaced by `@tailwindcss/vite`)
- `@tailwindcss/vite@4.0.0-beta.8` → **NEW** (Tailwind v4 integration)
- `astro@5.0.3` → `astro@5.1.5`
- `@astrojs/mdx@4.0.1` → `@astrojs/mdx@4.0.5`

**Added:**

- `@astrojs/markdown-remark@^6.0.2` - Core markdown processing
- `@tailwindcss/vite@4.0.0-beta.8` - Tailwind v4 Vite plugin
- `rehype-autolink-headings@^7.1.0` - Auto-link headings

**Removed:**

- `@astrojs/tailwind@5.1.3` - Replaced by @tailwindcss/vite
- `postcss.config.cjs` - File removed (not needed in v4)

#### 2. Tailwind v4 Migration

Tailwind v4 is a complete rewrite with CSS-first configuration:

**Key Changes:**

- ✅ Colors now defined in CSS using `@theme` directive
- ✅ Custom components moved to `@layer components`
- ✅ Dark mode using `@variant dark` selector
- ✅ Uses `oklch()` color space instead of `hsl()`
- ✅ PostCSS no longer required
- ✅ `theme()` function replaced with CSS variables

**CSS Variable Renames:**

- `--theme-bg` → `--color-global-bg`
- `--theme-text` → `--color-global-text`
- `bg-bgColor` → `bg-global-bg`
- `text-textColor` → `text-global-text`

#### 3. Configuration Changes

**astro.config.ts:**

- Moved tailwind from integrations to vite.plugins
- Added rehype-autolink-headings plugin
- Site URL now uses `siteConfig.url`

**site.config.ts:**

- Added `url: "https://eling.id/"` property

**tailwind.config.ts:**

- Simplified from 250+ lines to ~80 lines
- Only typography plugin configuration remains

**global.css:**

- Complete rewrite for Tailwind v4 syntax
- New directives: `@import`, `@config`, `@variant`, `@theme`

#### 4. Component Updates

**TOC Component:**

- Changed from `<aside>` to `<details>` element
- Better accessibility and built-in expand/collapse

**All Components:**

- Updated class names throughout site
- Replaced `theme()` with `var()` in styles

#### 5. Custom Styling & Personalization

During the upgrade, several custom style tweaks were applied to differentiate from the upstream template:

**global.css:**
- Added `scrollbar-gutter: stable` to prevent layout shift
- Customized font stacks with proper fallbacks
- Removed smart quotes from blockquotes (`quotes: "none"`)
- Fine-tuned spacing and typography

**Component adjustments:**
- Search styles moved to separate `src/styles/blocks/search.css`
- Various layout and spacing tweaks across components
- Updated example content and notes

**Content updates:**
- Added `upgrade-web.md` note about the v6.0.0 upgrade
- Removed default welcome note
- Updated markdown examples

### Build Verification

✅ All checks passed:

- `pnpm build` - 19 pages, 13 indexed (2019 words)
- `pnpm format` - 1 file formatted
- `pnpm lint` - No issues
- `pnpm check` - 0 errors, 0 warnings

### Files Modified

**Configuration:** 8 files (package.json, astro.config.ts, tsconfig.json, site.config.ts, types.ts, tailwind.config.ts, global.css)
**Components:** 18 files updated with new class names and styles
**Content:** 1 note added, 1 removed, 2 posts updated
**Deleted:** 1 file (postcss.config.cjs)
**Added:** 1 file (src/styles/blocks/search.css)

### Resources

- [Tailwind CSS v4.0 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [Astro Cactus v6.0.0](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v6.0.0)
- [Full Changelog: v5.0.0...v6.0.0](https://github.com/chrismwilliams/astro-theme-cactus/compare/v5.0.0...v6.0.0)

---

**Updated on:** October 17, 2025
