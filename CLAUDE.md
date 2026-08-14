# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website repository for "The Unhandled Exception Podcast" - a software development podcast hosted by Dan Clarke. The site is built with [Eleventy](https://www.11ty.dev/) (v3). The look-and-feel is a port of the "Unhandled Exception Redesign" Claude Design project, hand-written into `css/components/`. The site is deployed to GitHub Pages and is accessible at https://unhandledexceptionpodcast.com/.

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
- **Verify build**: `pnpm run verify` (`scripts/verify-build.mjs`)
  - Runs in CI between build and deploy, so a failure blocks the deploy
  - Fails on: a URL from `scripts/known-urls.txt` that is no longer built, an HTML reference to a
    local image that doesn't exist, an unresolved icon name (the `icon-link` fallback), a published
    page missing from the sitemap, or a working file (`.psd` etc.) in the output
  - **The URL check guards Giscus threads**, which are keyed by pathname. It is a subset check, so
    adding an episode passes with a note. Run `node scripts/verify-build.mjs --update-urls` only
    when you have *deliberately* removed or renamed a URL.

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
    - `images`: Array of image paths (first is used for OG/Twitter preview **and** as the episode's cover thumbnail in the list; falls back to `/images/logo.png`)
  - Optional overrides for the derived episode fields (see `posts/posts.11tydata.js`):
    - `guest`: overrides the guest parsed out of the title. `guest: ""` means "no guest" and also stops the title being split on " with ".
    - `epNumber`: overrides the episode number parsed from the title
    - `blurb`: overrides the blurb derived from the first paragraph of the body

- **Pages** (`pages/`): Static pages like About, Guest FAQ, Sponsorship
  - Must include `permalink` (e.g. `/pages/about/`) and `layout: "layouts/page.njk"`
  - Page layout intentionally skips date, tags, and the Giscus comments block
  - `unlisted: true` keeps a page out of the sitemap while still building it at its permalink.
    Used by `guest-faq-manual-recordings`, which documents the pre-Riverside recording method and
    is handed to guests directly rather than linked from the site.
  - Optional `eyebrow` and `pageSub` front matter render above/below the page title

### Layouts & Templates

- **Layouts** (`_includes/layouts/`):
  - `base.njk`: Outer HTML plus the `.shell` grid (sticky sidebar + `.main` content column)
  - `post.njk`: Extends base; renders the episode header (cover, EP number, date, title, tag chips), the markdown body inside `.prose`, and Giscus
  - `page.njk`: Extends base; renders `.page-head` (eyebrow, title, sub) and the body inside `.prose`
  - `list.njk`: Wrapper for paginated list pages (tag pages, `/tags/`)

- **Partials** (`_includes/partials/`): Reusable template fragments — sidebar, giscus, listenon, bmac, tagcloud, icon, brandicon, newsletter, discord, patreon, episodelist (macros), pagination (macro).
  - `icon.njk` exports a macro that looks up stroke SVGs from `_data/icons.json` (Feather).
  - `brandicon.njk` exports a macro of solid brand glyphs (Apple, Spotify, Discord, ...) ported from the design's `src/icons.jsx`. These can't go through `icon.njk` because that macro hard-codes stroke attributes.
  - `episodelist.njk` exports `episodeRow(post)` / `episodeList(posts)`. **If you change the row markup, mirror it in `rowHtml()` in `js/site.js`** - the client-side filter renders the same rows.

- **Shortcodes** (registered in `eleventy.config.js`):
  - `{% buzzsprout EPISODE_ID %}` — Embeds the Buzzsprout podcast player for a post
  - `{% image src, alt, class, widths, sizes %}` — Resizes a site asset at build time via
    `@11ty/eleventy-img` and emits an `<img>` with a `srcset`. Used for the sidebar wordmark and
    host avatar. **Episode covers do not use this** — see computed episode data below.

- **Filters** (registered in `eleventy.config.js`):
  - `dateDisplay` — Formats dates as "Jan 2, 2006"
  - `hugoSlug` — Slugifier compatible with Hugo's urlize (preserves `.`, `#`, `/` so tags like `c#`, `asp.net`, `ci/cd` map to Hugo's directory names)

- **Collections**: `posts`, `pages` (static pages, excluding `unlisted` ones — used by the sitemap), `tagList`, `tagStats`, `tagPages` (pre-paginated per-tag entries for URL parity with Hugo).

- **Computed episode data** (`posts/posts.11tydata.js`): derives `ep.number`, `ep.label` (`EP.085`), `ep.title`, `ep.guest`, `ep.blurb` and `ep.cover` from the existing title, body and `images` front matter, so episode rows have everything the design needs without back-filling 88 posts.
  - It also resizes the cover here rather than in a template, producing `ep.coverSrc` and
    `ep.coverSrcset`. That is deliberate: those URLs also have to reach `/episodes.json` so the
    client-side renderer uses the thumbnails too. Resizing in the template would leave filtered
    search results quietly loading the full-size originals.
  - `ep.cover` stays the **original** path — post bodies and social preview metadata reference it
    directly, and scrapers want the full-size image.

### Home page search

- `episodes.njk` builds `/episodes.json`, a compact index of every episode.
- `js/site.js` (passthrough-copied from `js/`) filters that index in place as the visitor types or clicks a tag chip, hiding the server-rendered pagination while a filter is active and restoring the original markup when it clears. Without JS the chips remain plain links to their tag pages.

### Theme / Styling

- `css/main.scss` declares the design tokens as CSS custom properties (colours, fonts, radii, sidebar width) and imports the component partials under `css/components/`.
  - The design ships a tweak panel; the variant baked in here is amber / sidebar / row cards / cozy / mono display. Swapping `--font-display` to `"Space Grotesk"` gives the design's alternative display face (the font is already loaded).
- `css/_extra.scss` holds overrides for classes used directly inside markdown content (`about-profile-photo`, `about-stats`, `about-listen-on`, `guest-bio`). They are scoped under `.prose` so they beat the generic prose rules.
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
