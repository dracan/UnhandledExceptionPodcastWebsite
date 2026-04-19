# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website repository for "The Unhandled Exception Podcast" - a software development podcast hosted by Dan Clarke. The site is built with [Eleventy](https://www.11ty.dev/) (v3) and the m10c look-and-feel is hand-ported into `css/components/`. The site is deployed to GitHub Pages and is accessible at https://unhandledexceptionpodcast.com/.

## Setup

1. Install Node.js (LTS). pnpm is the expected package manager.
2. Clone the repository. No submodules to initialize.
3. Install dependencies: `pnpm install --frozen-lockfile` (or `pnpm install` for first run / updates).

## Common Commands

### Development
- **Run local dev server**: `.\go.ps1` (PowerShell) or `pnpm run dev` directly
  - Runs Eleventy's dev server with live reload and watches `css/main.scss`
  - Server typically runs on http://localhost:8080

### Content Management
- **Create new episode post**: add `posts/0XXX-NameOfEpisode.md` with the front matter shown below
  - Naming convention: `0XXX-NameOfEpisode.md` (e.g., `0077-ShawnWildermuth.md`)
  - Filename (lowercased, `.md` stripped) is the URL slug

### Building
- **Build site**: `pnpm run build`
  - Compiles `css/main.scss` to `_site/css/main.css` and runs Eleventy
  - Generates static site to `_site/` directory
  - This is what the CI/CD pipeline runs

## Architecture

### Content Structure

- **Posts** (`posts/`): Podcast episode pages with front matter and markdown content
  - Front matter fields:
    - `title`: Episode title
    - `date`: Publication date (ISO)
    - `draft`: Boolean (set to `false` when ready to publish)
    - `episodeId`: Buzzsprout episode ID (required for embedding player)
    - `permalink`: **Required.** Literal URL path, e.g. `/posts/0077-shawnwildermuth/`. Must be all lowercase and match the filename slug to preserve existing URLs and Giscus comment threads.
    - `layout`: `"layouts/post.njk"`
    - `tags`: Array of strings (optional)
    - `twitter_cards`: Boolean — set true with `images` to emit `summary_large_image`
    - `images`: Array of image paths (first is used for OG/Twitter preview)

- **Pages** (`pages/`): Static pages like About, Guest FAQ, Sponsorship
  - Must include `permalink` (e.g. `/pages/about/`) and `layout: "layouts/page.njk"`
  - Page layout intentionally skips date, tags, and the Giscus comments block

### Layouts & Templates

- **Layouts** (`_includes/layouts/`):
  - `base.njk`: Outer HTML, header sidebar (avatar, menu, listen-on, bmac, social, tag cloud), main content slot
  - `post.njk`: Extends base; renders post title, date, tag chips, content, Giscus
  - `page.njk`: Extends base; renders title and content only
  - `list.njk`: Wrapper for paginated list pages (home, tag pages, `/tags/`)

- **Partials** (`_includes/partials/`): Reusable template fragments — giscus, listenon, bmac, tagcloud, icon, newsletter, twitter, mastodon, discord, patreon, postlist (macro), pagination.
  - `icon.njk` exports a macro that looks up SVGs from `_data/icons.json` (ported from m10c).

- **Shortcodes** (registered in `eleventy.config.js`):
  - `{% buzzsprout EPISODE_ID %}` — Embeds the Buzzsprout podcast player for a post

- **Filters** (registered in `eleventy.config.js`):
  - `dateDisplay` — Formats dates as "Jan 2, 2006"
  - `hugoSlug` — Slugifier compatible with Hugo's urlize (preserves `.`, `#`, `/` so tags like `c#`, `asp.net`, `ci/cd` map to Hugo's directory names)

- **Collections**: `posts`, `tagList`, `tagStats`, `tagPages` (pre-paginated per-tag entries for URL parity with Hugo).

### Theme / Styling

- `css/main.scss` defines the m10c color palette as hardcoded SCSS variables and imports the component partials under `css/components/` (ported from the upstream m10c theme, MIT).
- `css/_extra.scss` contains the site-specific overrides (listen-on icon sprites, Buy Me a Coffee button, Patreon container, tag cloud classes).
- Styles compile via the `sass` CLI to `_site/css/main.css`.

### Site Configuration

`_data/site.js` contains site metadata (title, baseUrl, description, author, menu, social links, Giscus ids, Google Analytics id, Buzzsprout RSS URL). Reference as `site.*` in templates.

### Comments System

Uses **Giscus** (GitHub Discussions-based commenting):
- Repository: `dracan/unhandledexceptionpodcast-comments`
- Configured in `_data/site.js` and rendered via `_includes/partials/giscus.njk`
- Mapping is `pathname`, so comment threads are keyed by the post URL — **do not change a post's permalink after publishing**
- Only appears on posts, not pages (controlled by which layout the front matter selects)

### Deployment

Automated via GitHub Actions (`.github/workflows/buildanddeploy.yml`):
1. Triggers on push to `main` branch
2. Checks out the repository (no submodules)
3. Sets up pnpm + Node.js LTS with pnpm cache
4. Runs `pnpm install --frozen-lockfile` and `pnpm run build`
5. Writes `CNAME` to `_site/` for the custom domain
6. Deploys to the `gh-pages` branch using `peaceiris/actions-gh-pages@v4`

### Static Assets

- **Images**: `images/` — podcast logo, episode guest photos, social icons (passthrough-copied unchanged)
- **CSS**: `css/` — SCSS source, compiled by the build

## Important Notes

- Episode numbering follows pattern: `0001`, `0002`, etc.
- **Permalinks are explicit and literal** in every post's and page's front matter. When adding a new post, set `permalink` to `/posts/<lowercased-filename-without-extension>/`.
- Draft posts won't appear in production builds (Eleventy excludes `draft: true` from the `posts` collection).
- The site rebuilds and deploys automatically on every push to `main`.
- The site was migrated from Hugo to Eleventy in April 2026 — see `openspec/changes/archive/` for the change proposal and URL-preservation diff report.
