## Context

The site currently uses Hugo with the m10c theme (git submodule) and deploys static output to GitHub Pages via `peaceiris/actions-gh-pages@v4`. It has 85 episode posts, 4 static pages, and ~64 image directories. Comments are provided by Giscus using `data-mapping="pathname"` against the repo `dracan/unhandledexceptionpodcast-comments`.

The maintainer also operates `danclarke-website` on Eleventy v3 and wants to consolidate toolchains. That repo provides useful reference patterns (nunjucks layouts, collections, cache-busting, tag cloud, custom slug filter for `.NET`) but is not a drop-in template — the podcast site must preserve its own m10c visual style.

The migration is technology-only: no visual change, no hosting change, no URL change. Future styling iterations are explicitly out of scope.

## Goals / Non-Goals

**Goals:**

- Replace Hugo with Eleventy v3 as the generator.
- Visually match the current m10c rendering (at reasonable fidelity — exact pixel parity is not required, but the site should feel unchanged to visitors).
- Preserve every existing URL byte-for-byte (posts, pages, tags, pagination, sitemap, home).
- Preserve every Giscus comment thread (follows from URL preservation).
- Keep hosting on GitHub Pages with the same domain `unhandledexceptionpodcast.com`.
- Drop the `themes/m10c` git submodule cleanly.
- Land the migration in a single deploy with a verifiable URL diff.

**Non-Goals:**

- No visual redesign, no new navigation, no new pages.
- No move to a different host (k8s, Netlify, Vercel, etc.) — GitHub Pages stays.
- No search, transcripts, or other new features.
- No change to Buzzsprout, Giscus, Google Analytics, or the RSS feed URL.
- No change to the Hugo-side history of `public/` — we simply stop tracking it going forward.

## Decisions

### Decision 1: Eleventy v3 with Nunjucks

Use Eleventy v3 (`@11ty/eleventy@^3`) with Nunjucks as the template engine for HTML, Markdown, and data templates. Matches `danclarke-website` exactly so the maintainer is working with one mental model.

**Alternatives considered:** Astro (more features, but a bigger leap and a heavier runtime); staying on Hugo with a non-submodule theme (doesn't solve the consolidation goal).

### Decision 2: Per-post literal permalinks in front matter

Every post and page gets an explicit `permalink:` string in its front matter, e.g. `permalink: /posts/0070-namingthingsishard/`.

**Rationale:** The maintainer asked for fully explicit permalinks. Every URL is greppable, overridable per-file, and immune to slugify drift. Avoids surprises with the `0006-DDD` / `0006-StuartLeeks` filename collision (same numeric prefix, different slugs).

**Alternatives considered:** Directory data file (`posts/posts.json` with a computed permalink). Simpler to maintain but less explicit; rejected at the maintainer's request.

### Decision 3: Port m10c SCSS in-repo; no Hugo templating

Copy the m10c component SCSS (`_app.scss`, `_base.scss`, `_post.scss`, `_posts_list.scss`, `_tag.scss`, `_tags_list.scss`, `_pagination.scss`, `_icon.scss`, `_error_404.scss`) into `css/components/` and hardcode the color variables (`$darkest-color: #242930`, `$dark-color: #353b43`, `$light-color: #afbac4`, `$lightest-color: #ffffff`, `$primary-color: #57cc8a`) at the top of `css/main.scss`. Keep the existing `_extra.scss` overrides. Compile via `sass` CLI or an Eleventy plugin; pre-minify for production.

**Rationale:** The current `config.toml` doesn't set any `[params.style]` overrides, so templating is dead weight. Hardcoded vars keep the SCSS plain and maintainable. Since m10c is MIT-licensed (verify `themes/m10c/LICENSE.md`), copying is fine.

**Alternatives considered:** Continue using the submodule (defeats the point); rewrite CSS from scratch (out of scope).

### Decision 4: Buzzsprout as a registered Nunjucks shortcode

Register `{% buzzsprout 12345678 %}` in `eleventy.config.js`:

```js
eleventyConfig.addShortcode("buzzsprout", function(id) {
  return `<div id="buzzsprout-player-${id}"></div>\n` +
    `<script src="https://www.buzzsprout.com/978640/${id}-hello-world.js` +
    `?container_id=buzzsprout-player-${id}&player=small" ` +
    `type="text/javascript" charset="utf-8"></script>`;
});
```

A scripted find/replace converts all 85 post bodies from `{{< buzzsprout-episode N >}}` to `{% buzzsprout N %}`.

**Note on the `-hello-world` slug in the URL:** this is a Buzzsprout quirk — the episode slug portion of the URL doesn't actually need to match the episode, it's cosmetic in the player script URL. The current Hugo shortcode uses `-hello-world` literally for all episodes and it works. We preserve that verbatim.

### Decision 5: Hugo-compatible slug filter for tags

Hugo's default URL slugification keeps literal `#` and `.` for tag directories — the existing site has `/tags/c#/`, `/tags/asp.net/`, `/tags/c#12/`. A naive `slug` filter will mangle these. Implement a custom `hugoSlug` filter that:

1. Lowercases
2. Replaces spaces with hyphens
3. Preserves `.`, `#`, and alphanumerics
4. Collapses consecutive hyphens

Verify against the full list of tag directories in the current `public/tags/` output.

**Alternatives considered:** Rewrite all tag URLs to modern slugs (e.g. `dotnet` instead of `.net`). Rejected — breaks external links.

### Decision 6: Layout templates — reproduce Hugo's `single.html` / `list.html` / `terms.html`

Three Nunjucks layouts under `_includes/layouts/`:

- `base.njk` — outer `<html>`, head, header/sidebar, menu, social icons, listen-on buttons, tag cloud, footer, main slot.
- `post.njk` — extends base, renders post title/date/tags + content + Giscus block.
- `page.njk` — extends base, renders title + content, **no** Giscus, no date/tags meta (matches Hugo's `{{- if ne .Type "page" }}` suppression).

`list.njk` is a specialized layout used by `index.njk`, `tag.njk`, and `tags.njk` pagination pages.

### Decision 7: Collections and pagination

```js
eleventyConfig.addCollection("posts", c =>
  c.getFilteredByGlob("posts/*.md")
   .sort((a,b) => b.date - a.date));

eleventyConfig.addCollection("tagList", c => { /* unique tags */ });
eleventyConfig.addCollection("tagStats", c => { /* counts for sidebar cloud */ });
```

Home page paginates the `posts` collection, 10 per page (match Hugo default), emitting `/`, `/page/2/`, `/page/3/`, … Tag detail pages paginate per tag, emitting `/tags/<slug>/`, `/tags/<slug>/page/2/`, …

The Hugo default pagination size is 10 — confirm by counting entries on the current home page before locking this in.

### Decision 8: OpenGraph and Twitter Cards — hand-rolled in `head.njk`

Replace Hugo's internal `opengraph.html` and `twitter_cards.html` with explicit `<meta>` tags driven by post front matter:

- `og:title`, `og:type`, `og:url`, `og:image` (from first `images:` entry), `og:description`.
- `twitter:card` = `summary_large_image` when `twitter_cards: true` and `images` is non-empty, else `summary`.

Validate against the Twitter Card Validator and OG debugger before cutover.

### Decision 9: GitHub Pages deploy — minimal workflow change

Keep `peaceiris/actions-gh-pages@v4` and the `gh-pages` branch. Replace the Hugo steps with:

```yaml
- uses: actions/setup-node@v4
  with: { node-version: 'lts/*', cache: 'npm' }
- run: npm ci
- run: npm run build
- run: echo 'unhandledexceptionpodcast.com' > _site/CNAME
- uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./_site
```

No change to branch, token, or custom domain. Submodule checkout step removed.

### Decision 10: URL diff as a gate

Before merging to `main`, run a diff script locally:

1. `hugo --theme=m10c` → snapshot all paths under `public/` into a sorted list.
2. `npm run build` → snapshot all paths under `_site/` into a sorted list.
3. `diff` the two lists. Expected result: **identical** (modulo files intentionally dropped, e.g. `index.xml` if we don't reimplement per-section RSS).

Any non-empty diff must be explained and resolved or explicitly waived before cutover.

## Risks / Trade-offs

- **[Risk]** URL drift detaches Giscus comment threads. → **Mitigation**: URL-diff gate (Decision 10) before cutover; manual spot-check of 2-3 posts on the live site post-deploy confirms threads load.
- **[Risk]** Tag slug mismatch (`c#` vs `c-sharp`) breaks external links and comment threads on tag pages (though tag pages don't have Giscus). → **Mitigation**: custom `hugoSlug` filter (Decision 5) plus URL diff.
- **[Risk]** SEO regression from changed `<meta>` tag structure. → **Mitigation**: run OG / Twitter validators pre-deploy; keep structure close to Hugo's internal output.
- **[Risk]** Hugo internal RSS (`/index.xml`, `/tags/x/index.xml`) consumers break if we don't reimplement. → **Mitigation**: the public-facing RSS is Buzzsprout (`feeds.buzzsprout.com/978640.rss`) already linked in `<head>`. The Hugo-generated `/index.xml` is likely not consumed by anyone. Decision: do not reimplement per-tag RSS; reimplement site-wide `/index.xml` only if the URL diff flags it as expected.
- **[Risk]** Submodule removal leaves stale references on contributor clones. → **Mitigation**: commit the removal as `git rm themes/m10c` + delete `.gitmodules`, update `CLAUDE.md` and `README.md` setup steps in the same change.
- **[Risk]** The checked-in `public/` directory causes merge conflicts or accidental re-tracking. → **Mitigation**: `git rm -r --cached public/` and add to `.gitignore` in the migration commit.
- **[Trade-off]** Per-post literal permalinks are 85 lines of duplicated pattern vs. a single data file. Accepted for explicitness.
- **[Trade-off]** Hardcoding SCSS colors sacrifices the (unused) theming hook from `config.toml`. Accepted — no one's using it.

## Migration Plan

Single-commit cutover is risky given scope. Preferred sequence across several commits on a feature branch:

1. **Scaffold (no content)**: Add `package.json`, `eleventy.config.js`, `_includes/`, `css/`, `_data/site.js`. Hugo still builds the live site on `main`.
2. **Port SCSS and layouts**: visual parity against one or two hand-picked test posts.
3. **Bulk content move**: `git mv content/posts posts`, `git mv content/pages pages`, `git mv static/images images`. Script the Buzzsprout shortcode replacement and the permalink front-matter injection.
4. **URL diff gate**: script the Hugo-vs-Eleventy path comparison, iterate until clean.
5. **Workflow swap + cleanup**: replace `.github/workflows/buildanddeploy.yml`, `git rm -r themes/m10c`, delete `.gitmodules`, `git rm -r --cached public/`, update `.gitignore`, update `CLAUDE.md` + `README.md`.
6. **Merge and deploy**: push to `main`, GitHub Actions runs, `gh-pages` branch receives Eleventy output. Manually check: home, 2-3 posts, a tag page, `/pages/about/`, Giscus threads load.

**Rollback**: revert the merge commit on `main`. The Hugo toolchain is still in git history; GitHub Actions redeploys Hugo output to `gh-pages`.

## Open Questions

- Pagination size — Hugo default is 10, but confirm against current `public/page/2/index.html` to be sure the home-page episode groups don't shift.
- Does the site actually rely on `/index.xml` for anything external? If the URL diff shows it, decide then whether to reimplement or drop.
- `resources/` directory at the repo root — generated by Hugo, safe to delete in the same commit?
