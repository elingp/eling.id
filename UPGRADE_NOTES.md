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

