## ADDED Requirements

### Requirement: Deploy to GitHub Pages via GitHub Actions

Pushes to `main` SHALL trigger a GitHub Actions workflow that builds the Eleventy site and deploys the contents of `_site/` to the `gh-pages` branch. The workflow SHALL be defined in `.github/workflows/buildanddeploy.yml`.

#### Scenario: Push to main triggers deploy

- **WHEN** a commit is pushed to the `main` branch
- **THEN** the `buildanddeploy.yml` workflow runs and, on success, the new static output is present on the `gh-pages` branch

### Requirement: Deploy action and auth unchanged

The workflow SHALL continue to use `peaceiris/actions-gh-pages@v4` and the default `GITHUB_TOKEN` for authentication.

#### Scenario: Deploy action reference

- **WHEN** inspecting `buildanddeploy.yml`
- **THEN** the deploy step uses `peaceiris/actions-gh-pages@v4` with `github_token: ${{ secrets.GITHUB_TOKEN }}` and `publish_dir: ./_site`

### Requirement: Build uses Node LTS and locked dependencies

The workflow SHALL install Node.js (LTS), run `npm ci` to install locked dependencies, and run `npm run build` to produce the site.

#### Scenario: Build steps

- **WHEN** the workflow runs
- **THEN** it executes `actions/setup-node@v4` with Node LTS, `npm ci`, and `npm run build` in that order, with no Hugo installation step

### Requirement: Custom domain preserved

The deployed site SHALL be reachable at `https://unhandledexceptionpodcast.com/` with no TLS or redirect regression relative to the pre-migration state.

#### Scenario: Custom domain resolves

- **WHEN** a visitor navigates to `https://unhandledexceptionpodcast.com/`
- **THEN** the home page is served from the `gh-pages` branch under HTTPS

### Requirement: Submodule initialization no longer required

Contributors cloning the repository SHALL NOT need to initialize or update any git submodule to build or develop the site.

#### Scenario: Fresh clone builds

- **WHEN** a contributor runs `git clone <repo>` followed by `npm ci && npm run build`
- **THEN** the build succeeds with no submodule-related errors and without running `git submodule update --init`
