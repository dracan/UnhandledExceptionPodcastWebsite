## Why

The site is currently built with Hugo and the m10c theme (a git submodule). The maintainer already runs an Eleventy-based site (`danclarke-website`) and wants a single toolchain across projects. Consolidating on Eleventy reduces cognitive overhead and makes future iteration easier. This change is a pure technology swap — visual styling and hosting stay the same for now. Future styling work will happen on top of the Eleventy foundation.

## What Changes

- Replace Hugo with Eleventy (v3) as the static site generator.
- Port the m10c theme look-and-feel into plain SCSS files inside the repo; drop the `themes/m10c` git submodule and `.gitmodules`.
- Convert all 85 posts and 4 pages from Hugo templating to Nunjucks/Markdown, adding an explicit literal `permalink` to every post and page front matter so URLs match the existing site byte-for-byte.
- Replace the Hugo `{{< buzzsprout-episode N >}}` shortcode with an Eleventy Nunjucks shortcode `{% buzzsprout N %}`.
- Replace Hugo's internal OpenGraph / Twitter cards templates with hand-written equivalents in the `<head>` include.
- Replace the GitHub Actions Hugo build step with `npm ci && npm run build`; keep `peaceiris/actions-gh-pages@v4` for deployment and continue to write `CNAME` during the workflow.
- Stop tracking the Hugo `public/` build output in git; add `_site/` and `node_modules/` to `.gitignore`.
- **BREAKING (internal tooling only)**: `hugo server` / `createnew.ps1` / `go.ps1` workflows are replaced by `npm run dev` / `npm run build`. No user-facing URL breakage.

## Capabilities

### New Capabilities

- `site-build`: Eleventy build pipeline, dev server, config, passthrough copy, SCSS compilation.
- `content-model`: Post and page front matter schema, collections, tag handling, draft handling, Buzzsprout shortcode.
- `url-preservation`: Literal per-post permalinks, tag slug compatibility with Hugo's output, URL diff verification step.
- `comments`: Giscus integration preserved on post URLs (not pages), pathname-based thread mapping unchanged.
- `hosting`: GitHub Pages deployment via GitHub Actions, CNAME emission, branch/token configuration.
- `theme`: m10c look-and-feel ported as plain SCSS (no Hugo templating), layouts, partials, icon set.

### Modified Capabilities

(None — no existing specs in `openspec/specs/`.)

## Impact

- **Codebase**: full replacement of `layouts/`, `archetypes/`, `config.toml`, `content/`, `static/`, `assets/` with Eleventy equivalents (`_includes/`, `_data/`, `eleventy.config.js`, `package.json`, `posts/`, `pages/`, `images/`, `css/`).
- **Submodules**: `themes/m10c` removed; `.gitmodules` deleted.
- **Tracked build output**: `public/` removed from git tracking.
- **CI/CD**: `.github/workflows/buildanddeploy.yml` rewritten for the Node toolchain.
- **Local dev**: contributors need Node.js (LTS) instead of Hugo Extended; `CLAUDE.md` and `README.md` updated.
- **External systems unchanged**: Buzzsprout, Giscus repo `dracan/unhandledexceptionpodcast-comments`, Google Analytics `G-RN9Q259LF1`, domain `unhandledexceptionpodcast.com`, Buzzsprout RSS feed link.
- **Risk**: URL drift silently detaching Giscus comment threads. Mitigated by an explicit URL-diff verification step (Hugo `public/` vs Eleventy `_site/`) before cutover.
