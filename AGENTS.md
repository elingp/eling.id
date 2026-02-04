# AGENTS.md

> Agent instructions for eling.id — a personal website built with Astro 5, Tailwind CSS 4, and TypeScript.

## Quickstart

- **Skill usage**: Before acting, scan the Skills Index and invoke relevant skills first.
- **Runtime**: Node >=24, pnpm >=10.
- **Required validation**: Run `pnpm run check` after any change.
- **Auto-fix**: Run `pnpm run fix` before re-checking when needed.
- **Pre-commit**: `pnpm lint-staged` runs Biome on `*.{astro,js,jsx,ts,tsx,json,jsonc,html}` and Prettier on `*.{astro,css,md,mdx,yml,yaml}`.
- **Formatting authority**: Biome + Prettier + CI. Use tabs and 100 columns.

## Commands

| Command              | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `pnpm run dev`       | Start dev server at `localhost:4321`       |
| `pnpm run build`     | Production build (injects commit hash)     |
| `pnpm run postbuild` | Build Pagefind index (runs after `build`)  |
| `pnpm run preview`   | Preview the production build               |
| `pnpm run check`     | Type-check + lint + format check           |
| `pnpm run check:ci`  | CI-optimized check with GitHub annotations |
| `pnpm run fix`       | Auto-fix Biome + Prettier                  |

## Agent Commit & Handoff

- Default: stop before committing and provide a handoff (files changed, tests run, suggested Conventional Commit message).
- If commits require GPG, do not request or accept passphrases; the user signs locally.
- Use `--no-gpg-sign` only when the user explicitly requests it. This removes GitHub's Verified badge and may violate branch protections.
- Atomic commits are optional. Only do them when the user explicitly requests them.

## Project Overview

Content-driven static site using Astro Content Collections.

| Path                 | Purpose                                |
| -------------------- | -------------------------------------- |
| `public/`            | Static assets (includes `icon.svg`)    |
| `src/assets/`        | Images and media                       |
| `src/components/`    | UI components                          |
| `src/content/post/`  | Long-form posts (Markdown/MDX)         |
| `src/content/note/`  | Short notes                            |
| `src/content/tag/`   | Tag metadata                           |
| `src/layouts/`       | Page layouts                           |
| `src/pages/`         | Routes (includes OG image route)       |
| `src/plugins/`       | Custom remark/rehype plugins           |
| `src/styles/`        | Global + component CSS                 |
| `src/utils/`         | Helpers (RSS, dates, TOC, webmentions) |
| `src/data/post.ts`   | Content querying helpers               |
| `src/site.config.ts` | Site metadata, nav, Expressive Code    |

## Content Authoring

### Post frontmatter (`src/content/post/<slug>/index.md`)

```yaml
---
title: "Post Title" # max 60 chars
description: "SEO description"
publishDate: "2026-01-30" # or ISO 8601
updatedDate: "2026-02-01" # optional
tags: ["astro", "web"]
draft: false # filtered in production
pinned: false
coverImage: # optional
  src: "./cover.png"
  alt: "Alt text"
ogImage: "/og-image/custom.png" # optional
autoUpdateDate: false # enable git-based last modified
---
```

Notes:

- `tags` are lowercased and deduped by the schema.
- `draft: true` is filtered in production builds.

### Note frontmatter (`src/content/note/<slug>.md`)

```yaml
---
title: "Note Title"
description: "SEO description (optional)"
publishDate: "2026-01-30T12:00:00+00:00"
updatedDate: "2026-02-01T09:00:00+00:00" # optional
autoUpdateDate: false # enable git-based last modified
---
```

**Date handling**: Dates without a time component normalize to UTC midnight.

## Markdown Extensions

Custom remark plugins (order matters in `astro.config.ts`):

| Syntax                                 | Plugin                  | Output              |
| -------------------------------------- | ----------------------- | ------------------- |
| `:::note[Title]\nContent\n:::`         | `remark-admonitions`    | Callout block       |
| `:::figure\n![alt](img)\nCaption\n:::` | `remark-figure-caption` | Figure with caption |
| `::github{repo="owner/repo"}`          | `remark-github-card`    | GitHub embed card   |

Admonition types: `tip`, `note`, `important`, `caution`, `warning`.

Headings get anchor links. External links open in a new tab and receive an icon.

## Code Conventions

### Imports

- Use `@/` alias for `src/` imports.
- Use `import type { X }` for type-only imports.

```typescript
import { siteConfig } from "@/site.config";
import type { SiteConfig } from "@/types";
```

### Linting & Formatting

- Biome: tabs, 100-char line width.
- Prettier: tabs, 100-char line width (md/mdx uses 80).
- Astro override: `useConst` and `useImportType` are off.

### Styling (Tailwind 4)

- **Flexoki palette**: CSS variables `--color-flexoki-*` in `src/styles/global.css`.
- **Dark mode**: `data-theme="dark"` attribute, use `@custom-variant dark`.
- **Breakpoints**: Mobile-first, use `lg:` for layout changes, `md:` for typography only.

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

1. Run `pnpm run check` after every implementation.
2. Preview with `pnpm run preview` for production build (`pnpm run build`) testing.
3. Check OG images at `/og-image/<slug>.png`.

## Environment Variables (Optional)

Webmentions support (site builds without these):

```bash
WEBMENTION_API_KEY=...
WEBMENTION_URL=...
WEBMENTION_PINGBACK=...
```

## Agent Skills Available

If a skill applies, invoke it before taking action.

### Core Development

| Skill                        | Use When                                       |
| ---------------------------- | ---------------------------------------------- |
| `astro`                      | Astro CLI, project structure, adapters         |
| `astro-framework`            | Islands architecture, content collections, SSR |
| `astroflare`                 | Astro + Tailwind v4 on Cloudflare Workers      |
| `pnpm`                       | pnpm commands, workspaces, catalogs            |
| `vite`                       | Vite config, plugins, SSR                      |
| `bun-development`            | Bun runtime, bundling, migration from Node.js  |
| `modern-javascript-patterns` | ES6+ patterns, async/await, modules            |
| `typescript-advanced-types`  | Advanced TS typing utilities                   |
| `api-design-principles`      | REST/GraphQL API design guidance               |
| `error-handling-patterns`    | Error handling patterns and resilience         |
| `database-schema-designer`   | Data modeling, migrations, indexing            |
| `github-actions-templates`   | CI/CD workflows and templates                  |
| `git-advanced-workflows`     | Rebase, cherry-pick, bisect, worktrees         |

### UI & Design

| Skill                       | Use When                                      |
| --------------------------- | --------------------------------------------- |
| `frontend-design`           | Production-grade UI components and styling    |
| `ui-ux-pro-max`             | UI design patterns, palettes, typography      |
| `visual-design-foundations` | Color, spacing, typography systems            |
| `responsive-design`         | Container queries, fluid layouts, breakpoints |
| `design-system-patterns`    | Design tokens and theming infrastructure      |
| `tailwind-design-system`    | Tailwind-based design systems                 |
| `web-component-design`      | Component architecture patterns               |
| `interaction-design`        | Microinteractions and motion design           |
| `web-design-guidelines`     | UI review and design best practices           |
| `wcag-audit-patterns`       | Accessibility audit patterns                  |
| `accessibility-compliance`  | WCAG 2.2 compliant UI implementation          |

### Testing & Quality

| Skill                         | Use When                                   |
| ----------------------------- | ------------------------------------------ |
| `javascript-testing-patterns` | Jest/Vitest/Testing Library strategy       |
| `debugging-strategies`        | Systematic debugging and profiling         |
| `code-reviewer`               | Review local changes or PRs                |
| `code-review-excellence`      | Improve review quality and feedback        |
| `refactor`                    | Surgical refactors without behavior change |
| `vercel-composition-patterns` | React composition APIs at scale            |
| `vercel-react-best-practices` | React/Next.js performance guidance         |
| `naming-analyzer`             | Improve names for variables/functions      |

### Documentation & Diagrams

| Skill                           | Use When                              |
| ------------------------------- | ------------------------------------- |
| `doc-coauthoring`               | Co-authoring structured documentation |
| `crafting-effective-readmes`    | Writing or improving README files     |
| `writing-clearly-and-concisely` | Clear, concise prose for humans       |
| `humanizer`                     | Make text sound more human-written    |
| `mermaid-diagrams`              | Creating diagrams with Mermaid        |

### Utilities

| Skill               | Use When                                 |
| ------------------- | ---------------------------------------- |
| `agent-browser`     | Web testing, form filling, screenshots   |
| `agent-md-refactor` | Refactor AGENTS/CLAUDE docs              |
| `git-commit`        | Conventional commit messages and staging |

### Superpowers (Process Skills)

| Skill                            | Use When                                      |
| -------------------------------- | --------------------------------------------- |
| `using-superpowers`              | Start any conversation; load skill guidance   |
| `brainstorming`                  | Requirements discovery and design exploration |
| `writing-plans`                  | Create a detailed implementation plan         |
| `executing-plans`                | Execute a plan task-by-task                   |
| `subagent-driven-development`    | Implement plan with subagents + reviews       |
| `dispatching-parallel-agents`    | Run independent tasks in parallel             |
| `test-driven-development`        | Implement features with TDD discipline        |
| `systematic-debugging`           | Debug bugs with a structured approach         |
| `verification-before-completion` | Verify claims before declaring done           |
| `requesting-code-review`         | Ask for code review before merge              |
| `receiving-code-review`          | Implement review feedback carefully           |
| `finishing-a-development-branch` | Wrap up and integrate finished work           |
| `using-git-worktrees`            | Create isolated git worktrees                 |
| `writing-skills`                 | Create or edit skills safely                  |

## MCP Servers

Always use **Context7 MCP** when you need library/API documentation, code generation, setup, or configuration steps.

## Key Files Reference

- `astro.config.ts` — Integrations, markdown pipeline, image domains
- `src/content.config.ts` — Collection schemas with Zod
- `src/site.config.ts` — Site metadata, menu links, Expressive Code
- `src/styles/global.css` — Flexoki palette, dark mode, Tailwind config
- `tailwind.config.ts` — Typography plugin customization
- `package.json` — Scripts, engines, lint-staged
- `biome.json` — Linting and formatting rules
