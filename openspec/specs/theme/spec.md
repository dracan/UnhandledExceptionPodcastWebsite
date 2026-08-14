# Theme

## Purpose

The look and feel of the site: layout, design tokens, typography, components and the templates that render them.
## Requirements
### Requirement: Google Analytics tag preserved

The rendered `<head>` SHALL include the Google Analytics gtag snippet for measurement ID `G-RN9Q259LF1`.

#### Scenario: GA snippet present

- **WHEN** any page is rendered
- **THEN** the page HTML contains a `<script>` referencing `https://www.googletagmanager.com/gtag/js?id=G-RN9Q259LF1` and a corresponding `gtag('config', 'G-RN9Q259LF1')` call

### Requirement: OpenGraph and Twitter Card metadata

Every rendered page SHALL include OpenGraph meta tags (`og:title`, `og:type`, `og:url`, `og:description`, `og:image` where available). Post pages with `twitter_cards: true` and at least one `images` entry SHALL additionally emit a `twitter:card` meta tag set to `summary_large_image`.

#### Scenario: OG tags on a post

- **WHEN** a post with `title`, `images`, and a description is rendered
- **THEN** the `<head>` contains `og:title`, `og:type=article`, `og:url` matching the canonical URL, `og:description`, and `og:image` pointing to the first entry in `images`

#### Scenario: Twitter summary_large_image

- **WHEN** a post has `twitter_cards: true` and a non-empty `images` array
- **THEN** the rendered `<head>` contains `<meta name="twitter:card" content="summary_large_image">`

### Requirement: Buzzsprout RSS link in head

Every rendered page SHALL include a `<link rel="alternate" type="application/rss+xml">` pointing to `https://feeds.buzzsprout.com/978640.rss` with title `The Unhandled Exception Podcast`.

#### Scenario: RSS link present

- **WHEN** any page is rendered
- **THEN** the `<head>` contains the Buzzsprout RSS alternate link exactly as specified

### Requirement: Redesign look-and-feel implemented as plain SCSS

The site SHALL render with the "Unhandled Exception Redesign" look-and-feel, implemented as plain
SCSS inside the repository with no dependency on any theme submodule. Design tokens SHALL be
declared as CSS custom properties rather than SCSS variables.

Every dimension SHALL be expressed in `rem` units relative to a single root font size, so that the
whole interface scales from one declaration. The root size SHALL be 125% on desktop, stepping down
on narrower viewports.

#### Scenario: Tokens are custom properties

- **WHEN** inspecting `css/main.scss`
- **THEN** `--bg`, `--fg`, `--accent`, `--surface`, `--line`, `--radius`, `--font-display`,
  `--font-body`, `--sidebar-w`, `--content-max`, `--page-max` and `--main-pad-x` are declared on
  `:root`, and no SCSS `$` variables are defined

#### Scenario: Interface scales from one declaration

- **WHEN** the root font size declared in `css/components/_base.scss` is changed
- **THEN** type, spacing, cover art and sidebar width all scale proportionally, and no component
  retains a hardcoded pixel dimension other than borders

#### Scenario: Component styles present

- **WHEN** inspecting `css/components/`
- **THEN** SCSS partials are present for at least: base, shell, sidebar, episodes, tags, post,
  pages, responsive

### Requirement: Layouts reproduce the redesign page structure

Layouts SHALL be provided as:

- `_includes/layouts/base.njk` — outer HTML plus a `.shell` grid containing the sidebar partial
  and a centred `.main` content column.
- `_includes/layouts/post.njk` — extends base; renders the episode header (EP number, date, title,
  tag chips), the markdown body inside `.prose`, and the Giscus block.
- `_includes/layouts/page.njk` — extends base; renders `.page-head` (optional eyebrow, title,
  optional sub) and the body inside `.prose`. No date, tags or Giscus.
- `_includes/layouts/list.njk` — wrapper for paginated list pages.

The episode page SHALL NOT render cover art in its header, because the Buzzsprout player
immediately below already displays the same artwork alongside the episode title and guest name.

#### Scenario: Sidebar content

- **WHEN** any page is rendered
- **THEN** the sidebar contains, in order: wordmark linking home, "Hosted by" chip linking to the
  host site, nav with episode and tag counts, Discord CTA, listen-on tiles, Buy Me a Coffee CTA,
  newsletter box, social icons, tag cloud, and the Audionautix credit

#### Scenario: Episode page has no duplicate artwork

- **WHEN** an episode page is rendered
- **THEN** no `.ep-thumb` element is emitted

### Requirement: Partials provided

The following partials SHALL exist under `_includes/partials/`: `sidebar`, `bmac`, `discord`,
`giscus`, `listenon`, `newsletter`, `tagcloud`, `icon`, `brandicon`, `episodelist`, `pagination`.

`icon.njk` SHALL render stroke SVGs looked up from `_data/icons.json`. `brandicon.njk` SHALL render
solid brand glyphs, which cannot use `icon.njk` because that macro hardcodes stroke attributes.

Macros that nest the `icon` macro SHALL be imported `with context`, otherwise the icon lookup
silently falls back to a generic link glyph.

#### Scenario: No unresolved icons

- **WHEN** the site is built
- **THEN** no rendered page contains the fallback `icon-link` marker

### Requirement: Menu matches the redesign navigation

The sidebar nav SHALL contain, in order: Episodes (`/`), Tags (`/tags/`), About (`/pages/about/`),
Guest FAQ (`/pages/guest-faq/`), Sponsorship (`/pages/sponsorship/`). Items SHALL render as
stacked rows with an icon, with a count shown against Episodes and Tags. No visual separator is
used between items.

#### Scenario: Active item highlighted

- **WHEN** a page under `/posts/`, `/page/` or `/` is rendered
- **THEN** the Episodes nav item carries the `active` class and `aria-current="page"`

### Requirement: Episode listing shows cover, guest and blurb

The episode listing SHALL render each episode as a row containing cover art, the EP number, the
publication date, the episode title, the guest where known, a blurb, and up to four tag chips.

Row markup SHALL be defined once in `_includes/partials/episodelist.njk` and mirrored by the
client-side renderer in `js/site.js`, which renders the same rows for filtered results.

#### Scenario: Row markup parity

- **WHEN** the client-side filter renders a result row
- **THEN** it produces the same element structure and classes as the server-rendered row,
  including the resized cover image rather than the original

#### Scenario: Cover falls back to the podcast logo

- **WHEN** a post has no `images` front matter
- **THEN** the row renders `/images/logo.png` and marks the cover with the `is-fallback` class so
  it is letterboxed rather than cropped

### Requirement: Home page search and tag filtering

The home page SHALL provide a search field and a row of tag chips that filter the episode list in
place, without a page load.

Filtering SHALL be progressive enhancement: without JavaScript the tag chips remain plain links to
their tag pages and the server-rendered listing with pagination is unaffected.

#### Scenario: Filtering hides pagination

- **WHEN** a search term or tag filter is active
- **THEN** the server-rendered pagination is hidden, and it is restored when the filter clears

#### Scenario: Result count is announced

- **WHEN** the filtered result count changes
- **THEN** the count element carries `aria-live="polite"` so assistive technology announces it

### Requirement: Keyboard and assistive technology support

Every page SHALL provide a skip link that bypasses the sidebar navigation and is visible on focus.
Interactive elements SHALL have a `:focus-visible` style consistent with the design rather than
relying on the browser default.

The home page SHALL carry an `<h1>`, which MAY be visually hidden where the design has no visible
page title.

#### Scenario: Skip link

- **WHEN** a keyboard user presses Tab on page load
- **THEN** the first focusable element is a skip link that moves focus to the main content

#### Scenario: Home page has a heading

- **WHEN** the home page is rendered
- **THEN** it contains exactly one `<h1>` element

