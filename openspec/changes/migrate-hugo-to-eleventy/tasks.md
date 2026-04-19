## 1. Scaffold Eleventy project alongside Hugo

- [x] 1.1 Add `package.json` with `@11ty/eleventy@^3`, `@11ty/eleventy-plugin-rss`, `sass`, and scripts `dev` (`eleventy --serve --quiet`) and `build` (`eleventy`)
- [x] 1.2 Run `pnpm install` to generate `pnpm-lock.yaml`
- [x] 1.3 Create `eleventy.config.js` with Nunjucks as the default template engine for md/html/data
- [x] 1.4 Create `_data/site.js` with `title`, `baseUrl`, `description`, `author`, `giscusRepoId`, `giscusCategoryId`, `googleAnalyticsId` (values lifted from current `config.toml`)
- [x] 1.5 Create `.gitignore` entries for `_site/`, `node_modules/`
- [x] 1.6 Add `images/` and `favicon.ico` passthrough copy in `eleventy.config.js`

## 2. Port layouts and partials

- [ ] 2.1 Create `_includes/head.njk` with meta charset/viewport, preconnects (buzzsprout, giscus, fonts), author meta, description meta, stylesheet link, Buzzsprout RSS alternate link, Google Analytics gtag snippet for `G-RN9Q259LF1`, OpenGraph tags, and conditional Twitter Card tags
- [ ] 2.2 Create `_includes/layouts/base.njk` with header sidebar (avatar, menu, listen-on, bmac, description, newsletter, twitter, mastodon, discord, social icons, audionautix link, tag cloud) and main content slot
- [ ] 2.3 Create `_includes/layouts/post.njk` extending base; render title, date (icon + formatted), tag chips (icon + linked), content, Giscus block
- [ ] 2.4 Create `_includes/layouts/page.njk` extending base; render title and content only, no post meta, no Giscus
- [ ] 2.5 Create `_includes/partials/icon.njk` rendering inline SVGs for `calendar`, `tag`, `github`, `twitter`, and any others referenced by layouts
- [ ] 2.6 Port `_includes/partials/giscus.njk` with the exact data-* attributes from the comments spec
- [ ] 2.7 Port `_includes/partials/listenon.njk`, `bmac.njk`, `newsletter.njk`, `twitter.njk`, `mastodon.njk`, `discord.njk`, `patreon.njk` (content lifted from current `layouts/partials/*.html` with Hugo template syntax converted to Nunjucks)
- [ ] 2.8 Port `_includes/partials/tagcloud.njk` using the `tagStats` collection (first 10 by count, link to `/tags/<slug>/`, plus "All Tags" link)
- [ ] 2.9 Create `_includes/partials/pagination.njk` matching the Hugo theme pagination component
- [ ] 2.10 Create `index.njk` paginating the `posts` collection at the same page size Hugo used (confirm from current `public/`); emit list entries with inline Buzzsprout player per Hugo `list.html`
- [ ] 2.11 Create `tags.njk` listing every tag with counts, permalink `/tags/`
- [ ] 2.12 Create `tag.njk` paginating posts per tag using `tagList`; permalink pattern `/tags/<slug>/` with `/page/<n>/` for paginated pages
- [ ] 2.13 Create `404.njk` mimicking Hugo m10c's 404 page, permalink `/404.html`
- [ ] 2.14 Create `sitemap.njk` producing `/sitemap.xml`

## 3. Port SCSS

- [ ] 3.1 Copy m10c component SCSS files from `themes/m10c/assets/css/` into `css/components/` (rename with leading underscores as needed): `_base.scss`, `_app.scss`, `_post.scss`, `_posts_list.scss`, `_tag.scss`, `_tags_list.scss`, `_pagination.scss`, `_icon.scss`, `_error_404.scss`
- [ ] 3.2 Copy the existing `assets/css/_extra.scss` into `css/_extra.scss` unchanged
- [ ] 3.3 Create `css/main.scss` with hardcoded color variables (`$darkest-color: #242930`, `$dark-color: #353b43`, `$light-color: #afbac4`, `$lightest-color: #ffffff`, `$primary-color: #57cc8a`) followed by `@import` statements for base, components, and `_extra`
- [ ] 3.4 Wire SCSS compilation into the Eleventy build (either via `sass` CLI in the `build` npm script or an Eleventy plugin); output to `_site/css/main.css` minified
- [ ] 3.5 Confirm `_site/css/main.css` exists after `npm run build` and contains the `.listen-on-icon`, `.app-header`, `.posts-list`, and `.tags-list-custom` rules

## 4. Add Eleventy filters, shortcodes, and collections

- [ ] 4.1 Register Nunjucks shortcode `buzzsprout(id)` emitting the Buzzsprout embed markup (div + script) matching Hugo's shortcode output
- [ ] 4.2 Add `dateDisplay` filter formatting dates as "Jan 2, 2006"
- [ ] 4.3 Add `hugoSlug` filter that preserves `.` and `#`, lowercases, and replaces whitespace with hyphens (must match Hugo's tag slugification for `c#`, `asp.net`, `c#12`, etc.)
- [ ] 4.4 Register `posts` collection (non-draft only, sorted by date desc)
- [ ] 4.5 Register `tagList` collection (unique tags, excluding any reserved tag)
- [ ] 4.6 Register `tagStats` collection (tag, count, weight) sorted by count desc

## 5. Bulk content migration

- [ ] 5.1 `git mv content/posts posts` and `git mv content/pages pages`
- [ ] 5.2 `git mv static/images images`
- [ ] 5.3 Move `static/favicon.ico` (if present) to repo root; passthrough-copy handles it
- [ ] 5.4 Write and run a script that, for each file under `posts/`, injects into the front matter: `permalink: /posts/<lowercased-slug>/` (slug = filename sans `.md`) and `layout: layouts/post.njk`
- [ ] 5.5 Write and run a script that, for each file under `pages/`, injects into the front matter: `permalink: /pages/<slug>/` and `layout: layouts/page.njk`; remove the now-unused `type: page` field
- [ ] 5.6 Write and run a script that replaces every `{{< buzzsprout-episode N >}}` with `{% buzzsprout N %}` across all post files
- [ ] 5.7 Verify that no Hugo shortcode syntax (`{{<`, `{{%`) remains anywhere under `posts/` or `pages/`

## 6. URL diff gate

- [ ] 6.1 From a clean checkout with the Hugo toolchain, run `hugo --theme=m10c` and save a sorted list of every file path under `public/` to `/tmp/hugo-paths.txt`
- [ ] 6.2 Run `npm run build` and save a sorted list of every file path under `_site/` to `/tmp/eleventy-paths.txt`
- [ ] 6.3 Diff the two lists; iterate fixes (permalinks, tag slugs, pagination size, sitemap format) until the diff is empty or every remaining line is explicitly documented in an accepted-differences note committed to the change
- [ ] 6.4 Spot-check 5 random posts, 1 page, 1 tag page, `/page/2/`, `/tags/`, and `/404.html` in a local `_site/` preview

## 7. Metadata validation

- [ ] 7.1 Serve `_site/` locally and paste a post URL into the Twitter Card validator; confirm `summary_large_image` renders with the expected image and title
- [ ] 7.2 Paste the same URL into Facebook's Sharing Debugger (or any OG preview tool); confirm OG title/description/image render
- [ ] 7.3 Spot-check that the Buzzsprout player loads on three different posts in the local preview

## 8. Deploy workflow swap

- [ ] 8.1 Rewrite `.github/workflows/buildanddeploy.yml` to check out without submodules, set up Node LTS with npm cache, run `npm ci`, run `npm run build`, emit `CNAME` to `_site/`, and deploy via `peaceiris/actions-gh-pages@v4` with `publish_dir: ./_site`
- [ ] 8.2 Run the workflow on a feature branch (or `workflow_dispatch`) against a disposable `gh-pages-test` branch to confirm it builds green before pointing at real `gh-pages`

## 9. Cleanup and cutover

- [ ] 9.1 `git submodule deinit -f themes/m10c`, `git rm -rf themes/m10c`, delete `.gitmodules`
- [ ] 9.2 `git rm config.toml archetypes/ layouts/ resources/ go.ps1 createnew.ps1 assets/ content/ static/` (any remaining Hugo artefacts)
- [ ] 9.3 `git rm -r --cached public/` to stop tracking the Hugo build output; ensure `public/` is in `.gitignore` (or delete the directory entirely)
- [ ] 9.4 Update `CLAUDE.md` to document the Eleventy setup (`npm ci`, `npm run dev`, `npm run build`), remove Hugo install steps, remove submodule initialization step
- [ ] 9.5 Update `README.md` similarly
- [ ] 9.6 Merge the feature branch to `main`; watch Actions run to green

## 10. Post-deploy verification

- [ ] 10.1 Load `https://unhandledexceptionpodcast.com/` and confirm the home page renders correctly with recent episodes
- [ ] 10.2 Load three random episode URLs and confirm the Buzzsprout players load
- [ ] 10.3 Load one episode that previously had Giscus comments and confirm the thread displays
- [ ] 10.4 Load `/pages/about/`, `/pages/guest-faq/`, `/pages/sponsorship/` and confirm each renders without Giscus
- [ ] 10.5 Load `/tags/` and a tag with a special-character slug (`/tags/c#/` or `/tags/asp.net/`) and confirm posts list correctly
- [ ] 10.6 Monitor GitHub Pages 404 logs (or an external uptime/link checker) for 48 hours post-deploy; if any previously-valid URL 404s, add a redirect or fix the permalink
