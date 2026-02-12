# eling.id

<!-- markdownlint-disable MD033 -->
<!-- prettier-ignore -->
<div align="center">
   <img src="./public/icon.svg" alt="eling.id icon" height="96" />

   <p>
      Personal website of Eling Pramuatmaja — posts, notes, RSS, search, and webmentions.
   </p>

   <p>
      <a href="https://eling.id/">Live site</a> ·
      <a href="#getting-started">Getting started</a> ·
      <a href="#project-commands">Commands</a> ·
      <a href="#content-authoring">Content</a>
   </p>

   <p>
      <a href="https://astro.build"><img alt="Astro" src="https://img.shields.io/badge/Astro-5-FF5D01?style=flat-square&logo=astro&logoColor=fff"></a>
      <a href="https://nodejs.org/"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-%3E%3D24-3c873a?style=flat-square&logo=node.js&logoColor=fff"></a>
      <a href="https://pnpm.io/"><img alt="pnpm" src="https://img.shields.io/badge/pnpm-10-f69220?style=flat-square&logo=pnpm&logoColor=fff"></a>
      <a href="https://pages.cloudflare.com/"><img alt="Cloudflare Pages" src="https://img.shields.io/badge/Cloudflare%20Pages-deployed-f38020?style=flat-square&logo=cloudflare&logoColor=fff"></a>
   </p>
</div>
<!-- markdownlint-enable MD033 -->

## Overview

This repository contains the source code for [https://eling.id/](https://eling.id/).

The site is built with [Astro](https://astro.build/) and uses Astro Content Collections for authoring **posts** and **notes** in Markdown/MDX.

> [!NOTE]
> This codebase started from (and still takes inspiration from) the excellent [Astro Cactus theme](https://github.com/chrismwilliams/astro-theme-cactus).

## Features

- Posts + notes (separate feeds and listing pages)
- RSS feeds: `/rss.xml` and `/notes/rss.xml` (rendered from Markdown/MDX and sanitized for feed readers)
- Static search via [Pagefind](https://pagefind.app/)
- Auto-generated Open Graph images via [Satori](https://github.com/vercel/satori)
- Syntax highlighting via [Expressive Code](https://expressive-code.com/)
- Optional webmentions support (webmention.io)
- SEO essentials: sitemap, robots.txt, web manifest

## Tech stack

- Framework: [Astro](https://astro.build/) (TypeScript)
- Content: Markdown/MDX + [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- Styling: [Tailwind CSS](https://tailwindcss.com/) (+ typography)
- Formatting/linting: [Biome](https://biomejs.dev/) and [Prettier](https://prettier.io/)
- Deployment: [Cloudflare Pages](https://pages.cloudflare.com/)

## Getting started

### Prerequisites

- Node.js **24+**
- pnpm **10+**

> [!TIP]
> This repo includes a minimal [mise](https://mise.jdx.dev/) config. If you use mise, run `mise install` to get the right Node.js version.

### Setup

```bash
git clone https://github.com/elingp/eling.id.git
cd eling.id

pnpm install
pnpm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

## Project commands

| Command              | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `pnpm run dev`       | Start the dev server (`localhost:4321`)                         |
| `pnpm run build`     | Build the site to `dist/` (includes commit hash when available) |
| `pnpm run postbuild` | Build the Pagefind index for search (runs after `build`)        |
| `pnpm run preview`   | Preview the production build locally                            |
| `pnpm run check`     | Type-check + lint + format check (comprehensive validation)     |
| `pnpm run check:ci`  | CI-optimized check with GitHub annotations (runs in Actions)    |
| `pnpm run fix`       | Fix everything (formatting, linting, imports)                   |

> [!IMPORTANT]
> `pnpm run build` runs `git rev-parse` to inject a commit hash into the build when Git metadata is available.

## Content authoring

Content lives in `src/content/`:

- `src/content/post/` — long-form posts
- `src/content/note/` — short notes
- `src/content/tag/` — tag metadata

### Post frontmatter

```md
---
title: "Your Post Title"
description: "A short description for previews and SEO"
publishDate: "1 Jan 2026" # or ISO 8601
tags: ["astro", "web"]
draft: false
pinned: false
updatedDate: "2026-01-23" # optional override
autoUpdateDate: false
---
```

### Note frontmatter

```md
---
title: "Note Title"
publishDate: "2026-01-23T12:00:00+00:00"
description: "Optional"
updatedDate: "2026-01-24T08:30:00+00:00" # optional
autoUpdateDate: false
---
```

> [!NOTE]
> Dates are parsed in the content schema (see `src/content.config.ts`). If you provide a date string without a time component, it is normalized to UTC midnight.

## Markdown extensions

This site adds a few authoring conveniences via custom remark/rehype plugins.

### Admonitions

```md
:::note[Heads up]
This is a callout block.
:::
```

### Figure captions

```md
:::figure
![Alt text](./image.png)

Caption text here.
:::
```

### GitHub cards

```md
::github{repo="chrismwilliams/astro-theme-cactus"}
::github{user="withastro"}
```

## Configuration

- `src/site.config.ts` — site metadata, nav links, date formatting, Expressive Code themes
- `astro.config.ts` — integrations (sitemap, robots.txt, web manifest), markdown pipeline, image domains

### Environment variables

All webmentions env vars are optional (the site builds without them):

```bash
WEBMENTION_API_KEY=...
WEBMENTION_URL=...
WEBMENTION_PINGBACK=...
```

## Project structure

```text
public/          Static assets (includes icon.svg)
src/assets/      Images and media
src/components/  UI components
src/content/     Posts, notes, tags
src/layouts/     Page layouts
src/pages/       Routes
src/plugins/     remark/rehype plugins
src/styles/      Global + component CSS
src/utils/       Helpers (RSS, dates, TOC, webmentions)
```

## Styling architecture

- Entry point: `src/styles/global.css` imports Tailwind v4 + local partials, then `@config`.
- `src/styles/theme.css`: design tokens and `@custom-variant dark`.
- `src/styles/base.css`: `@layer base` (site tokens, element defaults, Astro image helpers).
- `src/styles/components.css`: `@layer components` + `src/styles/components/*.css`.
- `src/styles/utilities.css`: `@utility` overrides (prose).
- Feature or third-party CSS: `src/styles/blocks/`, imported by the owning component/page.

## UI breakpoint policy

This site follows a mobile-first approach with a strict two-mode layout policy:

- Base (no prefix): mobile layout defaults
- `lg:`: desktop layout changes
- `md:`: typography/readability-only adjustments

> [!TIP]
> Avoid using `sm:` for layout changes to keep the mental model simple.
