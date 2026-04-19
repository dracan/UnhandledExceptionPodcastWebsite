## ADDED Requirements

### Requirement: m10c look-and-feel ported as plain SCSS

The site SHALL render with the same visual style as the current m10c-themed Hugo site (colors, typography, header/sidebar layout, post list, tag chips, pagination). Styles SHALL be implemented as plain SCSS files inside the repository, with no Hugo templating and no dependency on the `themes/m10c` submodule.

#### Scenario: Color variables hardcoded

- **WHEN** inspecting `css/main.scss`
- **THEN** the SCSS variables `$darkest-color: #242930`, `$dark-color: #353b43`, `$light-color: #afbac4`, `$lightest-color: #ffffff`, `$primary-color: #57cc8a` are defined as literal values at the top of the file

#### Scenario: Component styles ported

- **WHEN** inspecting `css/components/`
- **THEN** SCSS partials ported from m10c are present for at least: base, app layout, post, posts list, tag, tags list, pagination, icon, 404

### Requirement: Custom style overrides retained

The existing style overrides from `assets/css/_extra.scss` (listen-on button sprites, Buy Me a Coffee button, Patreon container, tag cloud custom classes) SHALL be carried over unchanged into the new SCSS tree.

#### Scenario: Overrides imported

- **WHEN** the site is built
- **THEN** the compiled `_site/css/main.css` contains the `.listen-on-icon`, `#bmc-container`, `.tags-list-custom`, and `#patreon-container` rules from the previous `_extra.scss`

### Requirement: Layouts reproduce Hugo page structure

Three Nunjucks layouts SHALL be provided:

- `_includes/layouts/base.njk` — outer HTML, head, header with avatar/menu/social/listen-on/tag-cloud sidebar, footer, main content slot.
- `_includes/layouts/post.njk` — extends base; renders post title, date, tag chips, post content, Giscus block.
- `_includes/layouts/page.njk` — extends base; renders title and content only (no date, tags, or Giscus).

Plus a list layout used by the home page and tag pages:

- A template (e.g. `index.njk`, `tag.njk`) that iterates the relevant collection and renders the m10c-style posts list with inline Buzzsprout embeds per item.

#### Scenario: Base layout header content

- **WHEN** any page is rendered
- **THEN** the header sidebar contains (in order): site avatar link, main nav menu, listen-on icons, Buy Me a Coffee button, site description, newsletter partial, Twitter partial, Mastodon partial, Discord partial, social icons, "Music by Audionautix.com" link, tag cloud

### Requirement: Partials ported

The following partials from the Hugo `layouts/partials/` directory SHALL be reimplemented as Nunjucks includes under `_includes/partials/` with equivalent output: `bmac`, `discord`, `giscus`, `listenon`, `mastodon`, `newsletter`, `patreon`, `tagcloud`, `twitter`, `twitter-cards`. An `icon` partial SHALL render inline SVG icons for at least: `calendar`, `tag`, `github`, `twitter`, plus any others referenced by the header or post templates.

#### Scenario: Icon partial usage

- **WHEN** a template calls the icon partial with name `calendar`
- **THEN** the rendered HTML contains an inline SVG element for the calendar icon

### Requirement: Menu matches current site

The header main menu SHALL contain the following items in order: Home (`/`), Tags (`/tags/`), About (`/pages/about/`), Guest FAQ (`/pages/guest-faq/`), Sponsorship (`/pages/sponsorship/`). Items SHALL be separated by the m10c visual separator (` - `).

#### Scenario: Menu order

- **WHEN** the header is rendered
- **THEN** the five menu links appear in the order listed above, with the configured separator between them

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
