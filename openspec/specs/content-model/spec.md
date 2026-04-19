# Content Model

### Requirement: Post front matter schema

Every podcast episode post under `posts/*.md` SHALL include front matter with the following fields:

- `title` (string, required)
- `date` (ISO date, required)
- `draft` (boolean, required; `false` for published)
- `episodeId` (integer, required — Buzzsprout episode id)
- `permalink` (string, required — literal URL path matching the Hugo-generated URL, e.g. `/posts/0070-namingthingsishard/`)
- `layout` (string, required — set to `layouts/post.njk`)
- `tags` (array of strings, optional)
- `twitter_cards` (boolean, optional)
- `images` (array of strings, optional)

#### Scenario: Existing post renders with required fields

- **WHEN** a post file with all required front-matter fields is built
- **THEN** Eleventy emits an HTML file at the exact path specified by `permalink`

#### Scenario: Draft posts excluded from production build

- **WHEN** `npm run build` runs against a post with `draft: true`
- **THEN** the post is not emitted to `_site/` and does not appear in any collection

### Requirement: Page front matter schema

Every static page under `pages/*.md` SHALL include:

- `title` (string, required)
- `permalink` (string, required — literal URL path, e.g. `/pages/about/`)
- `layout` (string, required — set to `layouts/page.njk`)

Pages SHALL NOT render the Giscus comments block, publication date, or tag metadata.

#### Scenario: Page renders without post chrome

- **WHEN** a page at `pages/about.md` is built
- **THEN** the output `_site/pages/about/index.html` contains no Giscus script tag, no post date, and no tag list

### Requirement: Post collection sorted by date descending

The build SHALL expose a `posts` collection containing every `posts/*.md` file with `draft: false`, sorted by `date` descending (newest first).

#### Scenario: Collection ordering

- **WHEN** the `posts` collection is iterated
- **THEN** the first entry is the most recently dated post and the last entry is the oldest

### Requirement: Buzzsprout episode shortcode

The build SHALL provide a Nunjucks shortcode `{% buzzsprout <episodeId> %}` that emits the Buzzsprout embed markup equivalent to the previous Hugo shortcode.

#### Scenario: Shortcode renders player

- **WHEN** a post body contains `{% buzzsprout 15655098 %}`
- **THEN** the rendered HTML contains `<div id="buzzsprout-player-15655098">` followed by a `<script>` tag sourcing `https://www.buzzsprout.com/978640/15655098-hello-world.js?container_id=buzzsprout-player-15655098&player=small`

#### Scenario: All episode posts use the shortcode

- **WHEN** the migration completes
- **THEN** no Hugo-style `{{< buzzsprout-episode ... >}}` strings remain in any file under `posts/`

### Requirement: Tag list and tag stats collections

The build SHALL expose two derived collections:

- `tagList` — an alphabetically sorted array of unique tag strings (excluding any reserved tag like `post`).
- `tagStats` — an array of `{tag, count, weight}` objects where `weight` is normalized to `[0, 1]` based on count, sorted by count descending.

These support the all-tags index page and the sidebar tag cloud respectively.

#### Scenario: Tag cloud sizing

- **WHEN** the sidebar tag cloud renders using `tagStats`
- **THEN** the most-used tag has the largest visual weight and the least-used has the smallest

### Requirement: Content directory layout

The repository SHALL organise content as:

- `posts/` — podcast episode markdown files (previously `content/posts/`)
- `pages/` — static pages markdown files (previously `content/pages/`)
- `images/` — static images (previously `static/images/`)

#### Scenario: No Hugo content paths remain

- **WHEN** the migration commit is merged
- **THEN** `content/` and `static/` are absent from the working tree
