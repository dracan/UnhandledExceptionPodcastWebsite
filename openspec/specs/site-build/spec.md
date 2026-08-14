# Site Build

## Purpose

The Eleventy build pipeline that turns the repository into a deployable static site, including asset handling and pre-deploy verification.
## Requirements
### Requirement: Eleventy build pipeline

The site SHALL be built with Eleventy v3 using Nunjucks as the template engine for HTML, Markdown, and data templates. The build SHALL produce static output at `_site/` suitable for serving by any static web host.

#### Scenario: Production build

- **WHEN** `npm run build` is executed
- **THEN** Eleventy produces a complete static site at `_site/` with zero errors and zero unresolved template references

#### Scenario: Build output is deterministic

- **WHEN** `npm run build` is executed twice with no content changes
- **THEN** the generated HTML under `_site/` is byte-identical between runs (ignoring timestamps emitted by the RSS plugin)

### Requirement: Local development server

The build tooling SHALL provide a local dev server with live reload for authoring.

#### Scenario: Dev server runs

- **WHEN** `npm run dev` is executed
- **THEN** Eleventy serves the site locally (default port 8080) and reloads the browser when source files change

### Requirement: Passthrough copy of static assets

The build SHALL copy `images/`, `js/` and `favicon.ico` to the output directory unchanged.

Photoshop sources and other working files SHALL NOT be published.

#### Scenario: Images passthrough

- **WHEN** the site is built
- **THEN** every image file under `images/` in the source exists at the same relative path under `_site/images/`

#### Scenario: Scripts passthrough

- **WHEN** the site is built
- **THEN** `_site/js/` mirrors the source `js/` directory

#### Scenario: No working files published

- **WHEN** the site is built
- **THEN** no `.psd` file is present anywhere under `_site/`

### Requirement: SCSS compilation

`css/main.scss` SHALL compile to `_site/css/main.css` via the `sass` CLI, with no Hugo templating
in the source.

Partials SHALL be composed with `@use` rather than the deprecated `@import`, and design tokens
SHALL live in their own partial so that `@use` rules can precede all other rules.

#### Scenario: SCSS compiles without Hugo templating

- **WHEN** the site is built
- **THEN** `_site/css/main.css` exists, is minified, and contains the redesign component styles

#### Scenario: No deprecation warnings

- **WHEN** `pnpm run build:sass` runs
- **THEN** the output contains no Sass deprecation warnings

### Requirement: Dependencies pinned via lockfile

The repo SHALL include a committed `package-lock.json` so that CI builds and local builds resolve the same dependency versions.

#### Scenario: CI install uses lockfile

- **WHEN** the GitHub Actions workflow runs `npm ci`
- **THEN** the install succeeds using only versions present in `package-lock.json`

### Requirement: Hugo toolchain removed

The repository SHALL NOT contain Hugo configuration, layouts, themes, or build artifacts after the migration lands.

#### Scenario: No Hugo files remain

- **WHEN** the migration commit is merged to `main`
- **THEN** `config.toml`, `archetypes/`, `layouts/`, `themes/`, `.gitmodules`, `resources/`, `go.ps1`, and `createnew.ps1` are absent from the working tree

#### Scenario: public/ untracked

- **WHEN** inspecting git status after the migration
- **THEN** `public/` is no longer tracked and `_site/` is listed in `.gitignore`

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

