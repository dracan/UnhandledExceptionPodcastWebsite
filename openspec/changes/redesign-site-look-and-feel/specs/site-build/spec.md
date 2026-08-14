## MODIFIED Requirements

### Requirement: Passthrough copy of static assets

The build SHALL copy `images/`, `js/` and `favicon.ico` to the output directory unchanged.

Photoshop sources and other working files SHALL NOT be published.

#### Scenario: Images and scripts passthrough

- **WHEN** the site is built
- **THEN** `_site/images/` and `_site/js/` mirror their source directories

#### Scenario: No working files published

- **WHEN** the site is built
- **THEN** no `.psd` file is present anywhere under `_site/`

### Requirement: SCSS compilation

`css/main.scss` SHALL compile to `_site/css/main.css` via the `sass` CLI, with no Hugo templating
in the source.

Partials SHALL be composed with `@use` rather than the deprecated `@import`, and design tokens
SHALL live in their own partial so that `@use` rules can precede all other rules.

#### Scenario: No deprecation warnings

- **WHEN** `pnpm run build:sass` runs
- **THEN** the output contains no Sass deprecation warnings

## ADDED Requirements

### Requirement: Asset fingerprinting

Stylesheet, script and episode index URLs SHALL carry a fingerprint derived from the content of
their sources, so that a changed asset is served from a different URL.

This exists because GitHub Pages serves pages with a ten minute max-age but assets with a four
hour max-age. Without a fingerprint, a returning visitor pairs new HTML with a stylesheet up to
four hours stale.

Fingerprints SHALL be computed from source files rather than build output, because the dev script
runs sass and Eleventy in parallel and the compiled CSS may not exist when the data file is
evaluated.

#### Scenario: Changed stylesheet changes the URL

- **WHEN** any file under `css/` changes and the site is rebuilt
- **THEN** the `href` of the stylesheet link changes

#### Scenario: Unchanged sources keep the URL stable

- **WHEN** the site is rebuilt with no source changes
- **THEN** every fingerprint is identical to the previous build

### Requirement: Episode cover images resized at build time

Episode cover images SHALL be resized at build time to the dimensions the listing actually
renders, and served in a modern format with a fallback.

Original images SHALL remain available at their published paths, because post bodies and social
preview metadata reference them directly.

#### Scenario: Listing does not serve full-size originals

- **WHEN** the first page of the episode listing is loaded
- **THEN** the total weight of its cover images is under 250 KB

### Requirement: Build verification

A verification step SHALL run after the build and before deployment, failing the build on any of:

- a URL present in the committed known-URL snapshot that is absent from the build
- an HTML reference to a local image that does not exist on disk
- an unresolved icon name, detected by the presence of the fallback `icon-link` marker
- a page that is neither draft nor `unlisted` yet missing from the sitemap

The URL check SHALL be a subset check rather than an equality check, so that publishing an episode
does not require regenerating the snapshot.

#### Scenario: Removed permalink fails the build

- **WHEN** a post's `permalink` is changed or removed
- **THEN** verification fails, naming the URL that disappeared

#### Scenario: New episode passes without snapshot changes

- **WHEN** a new post is added and the site is built
- **THEN** verification passes without any change to the known-URL snapshot
