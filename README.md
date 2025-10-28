# eling.id

Personal website of Eling Pramuatmaja, built with [Astro](https://astro.build).

## About

This repository contains the source code for my personal website where I write about stuff. The site serves as both a platform to share my thoughts and a portfolio showcasing my work.

## Tech Stack

- **Framework**: [Astro](https://astro.build) v5
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **Content**: Markdown/MDX with Content Collections
- **Search**: [Pagefind](https://pagefind.app/) for static search
- **Deployment**: Cloudflare Pages
- **Theme**: Based on [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus)

## Features

- Fast, static-site generation with Astro
- Dark and light mode support
- Fully responsive design
- Accessible, semantic HTML
- Static search functionality
- Blog posts and notes with tags
- Auto-generated OG images with [Satori](https://github.com/vercel/satori)
- RSS feeds for posts and notes
- Webmentions support
- SEO optimized

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

| Command          | Description                                   |
| :--------------- | :-------------------------------------------- |
| `pnpm install`   | Install dependencies                          |
| `pnpm dev`       | Start local dev server at `localhost:4321`    |
| `pnpm build`     | Build production site to `./dist/`            |
| `pnpm postbuild` | Build search index (runs after build)         |
| `pnpm preview`   | Preview production build locally              |
| `pnpm sync`      | Generate TypeScript types from content schema |

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

### Writing Posts

Create new blog posts in `src/content/post/` as Markdown or MDX files:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
publishDate: "2024-01-01"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Writing Notes

Create quick notes in `src/content/note/`:

```markdown
---
title: "Note Title"
publishDate: "2024-01-01"
---

Your note content...
```

## Configuration

Edit `src/site.config.ts` to customize:

- Site title and description
- Author information
- Social links
- Date formatting
- Navigation menu

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Theme based on [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) by [Chris Williams](https://github.com/chrismwilliams)
- Built with [Astro](https://astro.build)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

## Contact

- Website: [eling.id](https://eling.id)
- Email: [eling@eling.id](mailto:eling@eling.id)
- GitHub: [@elingp](https://github.com/elingp)
