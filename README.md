# eling.id

Personal website and blog of Eling Pramuatmaja.

## About

This repository contains the source code for my personal website where I share thoughts on my hobbies, technology, and my learning journey in general. The site serves as both a platform to share long-form blog posts and quick notes, as well as a portfolio showcasing my work.

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) with [@tailwindcss/typography](https://github.com/tailwindlabs/tailwindcss-typography)
- **Content**: Markdown/MDX with [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- **Code Highlighting**: [Expressive Code](https://expressive-code.com/)
- **Search**: [Pagefind](https://pagefind.app/) for static search
- **Open Graph Images**: [Satori](https://github.com/vercel/satori) for auto-generated social images
- **Linting/Formatting**: [Biome](https://biomejs.dev/) and [Prettier](https://prettier.io/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Theme**: Based on [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams

## Features

- Fast, static-site generation with Astro
- Dark and light mode support
- Fully responsive design
- Static search functionality via Pagefind
- Blog posts and notes with tag support
- Auto-generated OG images with Satori
- RSS feeds for posts and notes (`/rss.xml` and `/notes/rss.xml`)
- Webmentions support for social interactions
- Syntax highlighting with Expressive Code
- Git-based automatic last-modified dates
- Custom remark plugins for enhanced markdown (admonitions, figure captions, GitHub cards, reading time)
- SEO optimized with sitemap, robots.txt, and web manifest

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/elingp/eling.id.git
cd eling.id

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Commands

| Command          | Description                                                   |
| :--------------- | :------------------------------------------------------------ |
| `pnpm install`   | Install dependencies                                          |
| `pnpm dev`       | Start local dev server at `localhost:4321`                    |
| `pnpm build`     | Build production site to `./dist/` (includes git commit hash) |
| `pnpm postbuild` | Build Pagefind search index (automatically runs after build)  |
| `pnpm preview`   | Preview production build locally                              |
| `pnpm lint`      | Lint code with Biome                                          |
| `pnpm format`    | Format code with Biome and Prettier                           |
| `pnpm check`     | Type-check with Astro's TypeScript checker                    |

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and media
│   ├── components/  # Astro components
│   ├── content/     # Blog posts, notes, and tags (Markdown/MDX)
│   ├── layouts/     # Page layouts
│   ├── pages/       # Route pages
│   ├── plugins/     # Custom remark/rehype plugins
│   ├── styles/      # Global CSS and Tailwind config
│   └── utils/       # Utility functions
├── astro.config.ts  # Astro configuration
└── package.json
```

## Content

### Posts vs Notes

**Posts** are long-form, polished articles meant for sharing complete thoughts, tutorials, or in-depth explorations. They support:

- Required description for SEO and previews
- Optional cover images
- Tags for categorization
- Draft mode
- Pinning to homepage
- Optional manual `updatedDate` override
- Flexible date format (e.g., "30 Mar 2022" or ISO 8601)

**Notes** are quick, timestamped thoughts or updates. They're more casual and don't require:

- Descriptions (optional)
- Tags
- Cover images

Notes use strict ISO 8601 datetime format with timezone offsets (e.g., `"2025-10-19T15:27:00Z"`).

### Writing Posts

Create new blog posts in `src/content/post/` as Markdown or MDX files:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and post preview"
publishDate: "1 Jan 2024"
tags: ["tag1", "tag2"]
draft: false
pinned: false
---

Your content here...
```

**Frontmatter Fields:**

- `title` (required, max 60 chars)
- `description` (required)
- `publishDate` (required) - Can be "DD MMM YYYY" or ISO 8601
- `updatedDate` (optional) - Manually override the last-modified date
- `tags` (optional) - Array of strings, auto-lowercased and de-duplicated
- `draft` (optional, default: false) - Hides post from production builds
- `pinned` (optional, default: false) - Shows on homepage (max 3)
- `coverImage` (optional) - Object with `src` (image path) and `alt` (string)
- `ogImage` (optional) - Custom OG image path (auto-generated if omitted)

### Writing Notes

Create quick notes in `src/content/note/`:

```markdown
---
title: "Note Title"
publishDate: "2024-01-01T12:00:00Z"
description: "Optional short description"
---

Your note content...
```

**Frontmatter Fields:**

- `title` (required, max 60 chars)
- `publishDate` (required) - Must be ISO 8601 with timezone (e.g., "2024-01-01T12:00:00Z" or "2024-01-01T12:00:00+07:00")
- `description` (optional)

### Date Handling

This site has intelligent date handling:

1. **Published Date**:
   - Posts: Accept friendly formats like "30 Mar 2022" (converted to UTC midnight) or ISO 8601
   - Notes: Require strict ISO 8601 with timezone offset

2. **Last Modified Date**:
   - Automatically determined from Git history via `remark-git-metadata` plugin
   - Only shows if modified >1 day after publish AND after 2025-10-28 (to ignore URL migration commits)
   - Can be manually overridden with `updatedDate` in frontmatter

3. **Display Format**:
   - Configured in `src/site.config.ts` (currently: "31 Oct 2025" format with en-GB locale)
   - Converted to user's local timezone on the client-side via JavaScript

### Custom Markdown Features

This blog includes custom remark plugins for enhanced markdown:

#### Admonitions

Use `:::note`, `:::tip`, `:::important`, `:::warning`, `:::caution` for callout blocks:

```markdown
:::note[Custom Title]
Your content here
:::
```

#### Figure Captions

Wrap images with captions:

```markdown
:::figure
![Alt text](./image.png "Title")

Caption with **formatting** and [links](https://example.com)
:::
```

#### GitHub Cards

Embed dynamic GitHub repo or user cards:

```markdown
::github{repo="chrismwilliams/astro-theme-cactus"}
::github{user="withastro"}
```

#### Reading Time

Automatically calculated and displayed on post pages.

## Configuration

### Site Configuration (`src/site.config.ts`)

Customize:

- Site title, author, and description
- Language and locale settings
- Date formatting options
- Social links
- Navigation menu items
- Expressive Code themes and styling

### Tailwind Configuration (`tailwind.config.ts`)

The site uses Tailwind CSS v4 with custom configuration:

- Typography plugin customization (responsive font sizes for headings, figcaptions)
- Custom prose styles for links, blockquotes, tables
- CSS variables for theming (`--color-link`, `--color-accent`, etc.)

### Environment Variables

Create a `.env` file for optional features:

```bash
# Optional: Enable webmentions
WEBMENTION_API_KEY=your_webmention_io_token
```

Without `WEBMENTION_API_KEY`, the site builds fine but webmentions won't be fetched.

### Custom Remark Plugins

The site includes several custom remark plugins in `src/plugins/`:

- `remark-admonitions.ts` - Callout blocks (note, tip, warning, etc.)
- `remark-figure-caption.ts` - Semantic figure/figcaption elements
- `remark-git-metadata.ts` - Auto-generate last-modified dates from Git
- `remark-github-card.ts` - Embed GitHub repo/user cards
- `remark-reading-time.ts` - Calculate reading time

### Content Collections Schema

Content types are defined in `src/content.config.ts`:

- **Posts**: Flexible dates, tags, drafts, pinning, cover images
- **Notes**: Strict ISO 8601 dates, minimal metadata
- **Tags**: Optional custom title and description per tag

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Theme based on [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by Chris Williams

## Contact

- Website: [eling.id](https://eling.id)
- Email: [eling@eling.id](mailto:eling@eling.id)
- GitHub: [@elingp](https://github.com/elingp)
