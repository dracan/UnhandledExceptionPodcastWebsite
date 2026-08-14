## MODIFIED Requirements

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

#### Scenario: Permalink honoured

- **WHEN** a post declares `permalink: /posts/0070-namingthingsishard/`
- **THEN** Eleventy emits an HTML file at the exact path specified by `permalink`

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

#### Scenario: Unlisted page excluded from sitemap

- **WHEN** a page declares `unlisted: true`
- **THEN** the page is still built and reachable at its permalink, but no `<loc>` entry for it
  appears in `/sitemap.xml`

## ADDED Requirements

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
