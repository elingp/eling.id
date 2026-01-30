# AGENTS.md

> Agent instructions for eling.id — a personal website built with Astro 5, Tailwind CSS 4, and TypeScript.

## Build & Validation Commands

```bash
pnpm dev          # Start dev server → localhost:4321
pnpm build        # Production build (injects commit hash) + Pagefind index
pnpm check        # Type-check + lint (astro check && biome check)
pnpm lint         # Auto-fix with Biome
pnpm format       # Format with Prettier
```

**After implementing any changes, always run:**

```bash
pnpm run check
```

Fix all type errors and lint issues before committing. The pre-commit hook runs `lint-staged` (Prettier + Biome).

## Project Overview

Content-driven static site using Astro Content Collections:

| Directory            | Purpose                              |
| -------------------- | ------------------------------------ |
| `src/content/post/`  | Long-form blog posts (Markdown/MDX)  |
| `src/content/note/`  | Short notes with minimal frontmatter |
| `src/content/tag/`   | Tag metadata for tag pages           |
| `src/plugins/`       | Custom remark/rehype plugins         |
| `src/data/post.ts`   | Content querying functions           |
| `src/site.config.ts` | Site metadata and configuration      |

## Content Authoring

### Post frontmatter (`src/content/post/<slug>/index.md`)

```yaml
---
title: "Post Title" # max 60 chars
description: "SEO description"
publishDate: "2026-01-30" # or ISO 8601
tags: ["astro", "web"]
draft: false # filtered in production
pinned: false
autoUpdateDate: false # enable git-based last modified
---
```

### Note frontmatter (`src/content/note/<slug>.md`)

```yaml
---
title: "Note Title"
publishDate: "2026-01-30T12:00:00+00:00"
---
```

**Date handling**: Dates without time component normalize to UTC midnight.

## Markdown Extensions

Custom remark plugins (order matters in `astro.config.ts`):

| Syntax                                 | Plugin                  | Output              |
| -------------------------------------- | ----------------------- | ------------------- |
| `:::note[Title]\nContent\n:::`         | `remark-admonitions`    | Callout block       |
| `:::figure\n![alt](img)\nCaption\n:::` | `remark-figure-caption` | Figure with caption |
| `::github{repo="owner/repo"}`          | `remark-github-card`    | GitHub embed card   |

Admonition types: `tip`, `note`, `important`, `caution`, `warning`

## Code Conventions

### Imports

- Use `@/` alias for `src/` imports
- Use `import type { X }` for type-only imports

```typescript
import { siteConfig } from "@/site.config";
import type { SiteConfig } from "@/types";
```

### Linting (Biome)

- Tabs, 100 char line width
- Astro files override: `useConst: off`, `useImportType: off`

### Styling (Tailwind 4)

- **Flexoki palette**: CSS variables `--color-flexoki-*` in `src/styles/global.css`
- **Dark mode**: `data-theme="dark"` attribute, use `@custom-variant dark`
- **Breakpoints**: Mobile-first, use `lg:` for desktop layout, `md:` for typography only

### Content Querying

```typescript
import { getAllPosts, getUniqueTags, groupPostsByYear } from "@/data/post";
const posts = await getAllPosts(); // Filters drafts in production
```

### Rendering Content

```astro
---
import { render } from "astro:content";
const { Content, headings, remarkPluginFrontmatter } = await render(post);
const readingTime = remarkPluginFrontmatter.minutesRead;
const lastModified = remarkPluginFrontmatter.lastModified;
---
```

## Testing & Validation

1. Run `pnpm run check` after every implementation
2. Fix all TypeScript and Biome errors before committing
3. Preview with `pnpm preview` for production build testing
4. Check OG images at `/og-image/<slug>.png`

## Environment Variables (Optional)

Webmentions support (site builds without these):

```bash
WEBMENTION_API_KEY=...
WEBMENTION_URL=...
WEBMENTION_PINGBACK=...
```

## Agent Skills Available

The following skills are installed globally and can provide additional context:

| Skill             | Use When                                       |
| ----------------- | ---------------------------------------------- |
| `astro`           | Astro CLI, project structure, adapters         |
| `astro-framework` | Islands architecture, content collections, SSR |
| `pnpm`            | Package management, workspaces, catalogs       |
| `vite`            | Build config, plugins, dev server              |
| `frontend-design` | UI components, styling patterns                |
| `code-reviewer`   | Reviewing code changes                         |
| `git-commit`      | Conventional commit messages                   |

## Key Files Reference

- [astro.config.ts](astro.config.ts) — Integrations, markdown pipeline, image domains
- [src/content.config.ts](src/content.config.ts) — Collection schemas with Zod
- [src/site.config.ts](src/site.config.ts) — Site metadata, menu links, Expressive Code
- [src/styles/global.css](src/styles/global.css) — Flexoki palette, dark mode, Tailwind config
- [tailwind.config.ts](tailwind.config.ts) — Typography plugin customization
