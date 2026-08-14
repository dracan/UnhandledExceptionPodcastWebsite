# Content Model

## Purpose

The shape of episode and page content: front matter schema, the collections built from it, and the presentation data derived from existing fields.
## Requirements
### Requirement: Post front matter schema

Every file under `posts/` SHALL carry front matter with:

- `title` (string, required)
- `date` (ISO date, required)
- `draft` (boolean, required; `false` for published)
- `episodeId` (integer, required — Buzzsprout episode id)
- `permalink` (string, required — literal URL path matching the Hugo-generated URL, e.g. `/posts/0070-namingthingsishard/`)
- `layout` (string, required — set to `layouts/post.njk`)
- `tags` (array of strings, optional)
- `twitter_cards` (boolean, optional)
- `images` (array of strings, optional)

The first entry of `images` SHALL serve as both the social preview image and the episode's cover
thumbnail in the listing.

The following optional fields SHALL override the values derived from the title and body (see
"Derived episode fields"):

- `guest` (string, optional — overrides the parsed guest. An empty string means the episode has no
  guest, and additionally suppresses splitting the title on " with ")
- `epNumber` (integer, optional — overrides the parsed episode number)
- `blurb` (string, optional — overrides the blurb derived from the body)

#### Scenario: Existing post renders with required fields

- **WHEN** a post file with all required front-matter fields is built
- **THEN** Eleventy emits an HTML file at the exact path specified by `permalink`

#### Scenario: Draft posts excluded from production build

- **WHEN** `pnpm run build` runs against a post with `draft: true`
- **THEN** the post is not emitted to `_site/` and does not appear in any collection

#### Scenario: Guest override suppresses title splitting

- **WHEN** a post titled `Episode 22: Jetbrains Rider, and Code With Me` declares `guest: ""`
- **THEN** the derived episode title retains the full text after the episode number, and no guest
  is rendered

### Requirement: Page front matter schema

Every file under `pages/` SHALL carry front matter with:

- `title` (string, required)
- `permalink` (string, required — literal URL path, e.g. `/pages/about/`)
- `draft` (boolean, required)
- `layout` (string, required — set to `layouts/page.njk`)
- `eyebrow` (string, optional — small label rendered above the page title)
- `pageSub` (string, optional — standfirst rendered below the page title)
- `unlisted` (boolean, optional — when true the page is excluded from the sitemap)

#### Scenario: Page renders without post chrome

- **WHEN** a page at `pages/about.md` is built
- **THEN** the output `_site/pages/about/index.html` contains no Giscus script tag, no post date, and no tag list

#### Scenario: Unlisted page excluded from sitemap

- **WHEN** a page declares `unlisted: true`
- **THEN** the page is still built and reachable at its permalink, but no `<loc>` entry for it
  appears in `/sitemap.xml`

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

### Requirement: Derived episode fields

Episode presentation data SHALL be derived at build time from existing front matter and body text,
so that the listing can show cover art, episode numbers, guests and blurbs without back-filling
every post.

A computed `ep` object SHALL expose:

- `number` — parsed from a `Episode <n>:` title prefix
- `label` — the number formatted as `EP.085`
- `title` — the title with the episode prefix and trailing guest clause removed
- `guest` — parsed from a ` - with ` or ` with ` clause in the title
- `blurb` — the first prose paragraph of the body, stripped of markdown and truncated
- `cover` — the first `images` entry, or the podcast logo
- `hasCover` — whether a real cover image was found

Derivation SHALL be overridable per post by the `guest`, `epNumber` and `blurb` front matter
fields.

#### Scenario: Episode number and guest parsed from title

- **WHEN** a post is titled `Episode 85: Simplicity First - with Chris Woody Woodruff`
- **THEN** `ep.label` is `EP.085`, `ep.title` is `Simplicity First`, and `ep.guest` is
  `Chris Woody Woodruff`

#### Scenario: Blurb skips non-prose

- **WHEN** a body opens with an HTML tag, a shortcode, a heading or a list
- **THEN** those blocks are skipped and the blurb is taken from the first paragraph of prose

### Requirement: Episode search index

The build SHALL emit `/episodes.json` containing one entry per published episode with its URL,
label, title, guest, display date, blurb, resized cover URL and tags.

The index SHALL be requested with a fingerprint derived from the post sources, so that publishing
an episode cannot be masked by a cached copy of the index.

#### Scenario: Index covers every published episode

- **WHEN** the site is built
- **THEN** `/episodes.json` contains exactly one entry per post in the `posts` collection

