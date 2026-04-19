# Site Build

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

The build SHALL copy the `images/` directory and `favicon.ico` (if present) through to `_site/` unchanged, preserving directory structure and filenames exactly.

#### Scenario: Images passthrough

- **WHEN** the site is built
- **THEN** every file under `images/` in the source exists at the same relative path under `_site/images/`

### Requirement: SCSS compilation

The build SHALL compile `css/main.scss` and its imports into a single minified `_site/css/main.css` file referenced from every rendered page.

#### Scenario: SCSS compiles without Hugo templating

- **WHEN** the site is built
- **THEN** `_site/css/main.css` exists, is minified, and contains the ported m10c component styles

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
