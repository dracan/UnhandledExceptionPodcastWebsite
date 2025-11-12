# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website repository for "The Unhandled Exception Podcast" - a software development podcast hosted by Dan Clarke. The site is built with Hugo (a static site generator) and uses the m10c theme. The site is deployed to GitHub Pages and is accessible at https://unhandledexceptionpodcast.com/.

## Setup

1. Install Hugo Extended version: `choco install hugo-extended` (Windows) or follow Hugo docs for other OSs
2. Clone the repository
3. Initialize submodules: `git submodule update --init` (critical - the m10c theme is a submodule)

## Common Commands

### Development
- **Run local dev server**: `.\go.ps1` (PowerShell) or `hugo server -D` directly
  - Runs Hugo dev server with draft posts visible
  - Server typically runs on http://localhost:1313

### Content Management
- **Create new episode post**: `.\createnew.ps1 <filename>` or `hugo new posts/<filename>.md`
  - Creates a new post in `content/posts/` using the archetype template
  - Naming convention: `0XXX-NameOfEpisode.md` (e.g., `0077-ShawnWildermuth.md`)

### Building
- **Build site**: `hugo --theme=m10c`
  - Generates static site to `public/` directory
  - This is what the CI/CD pipeline runs

## Architecture

### Content Structure

- **Posts** (`content/posts/`): Podcast episode pages with front matter and markdown content
  - Front matter fields:
    - `title`: Episode title
    - `date`: Publication date
    - `draft`: Boolean (set to false when ready to publish)
    - `episodeId`: Buzzsprout episode ID (required for embedding player)
    - `tags`: Array of tags
    - `twitter_cards`: Boolean (enables Twitter card metadata)
    - `images`: Array of image paths (for social media previews)

- **Pages** (`content/pages/`): Static pages like About, Guest FAQ, Sponsorship
  - Must include `type: page` in front matter to prevent Giscus comments from appearing

### Layouts & Templates

- **Custom layouts** (`layouts/`):
  - `_default/single.html`: Main template for post/page rendering - includes Giscus integration
  - `_default/list.html`: List template for indexes
  - `_default/baseof.html`: Base HTML template

- **Partials** (`layouts/partials/`): Reusable template components
  - `giscus.html`: Comments integration using Giscus (GitHub Discussions)
  - Other social/community partials (Discord, Twitter, Patreon, etc.)

- **Shortcodes** (`layouts/shortcodes/`):
  - `buzzsprout-episode.html`: Embeds Buzzsprout podcast player
  - Usage in posts: `{{< buzzsprout-episode EPISODE_ID >}}`

### Theme

The site uses the **m10c theme** (installed as a Git submodule in `themes/m10c`). Custom overrides live in the root `layouts/` directory and take precedence over theme defaults.

### Configuration

`config.toml` contains:
- Site metadata (title, baseURL, language)
- Menu structure (Home, Tags, About, Guest FAQ, Sponsorship)
- Social links (GitHub, Twitter)
- Giscus configuration (`giscusRepoId`, `giscusCategoryId`)
- Google Analytics ID

### Comments System

Uses **Giscus** (GitHub Discussions-based commenting):
- Repository: `dracan/unhandledexceptionpodcast-comments`
- Configured in `config.toml` with repo/category IDs
- Implementation in `layouts/partials/giscus.html`
- Only appears on posts, not pages (controlled by `type` in front matter)

### Deployment

Automated via GitHub Actions (`.github/workflows/buildanddeploy.yml`):
1. Triggers on push to `main` branch
2. Checks out code with submodules
3. Sets up Hugo v0.82.0 Extended
4. Builds site with `hugo --theme=m10c`
5. Creates CNAME file for custom domain
6. Deploys to `gh-pages` branch using `peaceiris/actions-gh-pages@v3`

### Static Assets

- **Images**: `static/images/` - podcast logo, episode guest photos, etc.
- **CSS**: Custom styles in `assets/css/` (processed by Hugo's asset pipeline)

## Important Notes

- Always ensure submodules are initialized when cloning (theme dependency)
- Episode numbering follows pattern: `0001`, `0002`, etc.
- Draft posts won't appear in production builds (only with `-D` flag)
- The site rebuilds and deploys automatically on every push to main
