# Url Preservation

### Requirement: Every post URL matches the previous Hugo output

Every published post under the Eleventy build SHALL be emitted at a URL path byte-identical to the path produced by the previous Hugo build for the same source file.

#### Scenario: Post URL byte-match

- **WHEN** a post `posts/0070-NamingThingsIsHard.md` with `permalink: /posts/0070-namingthingsishard/` is built
- **THEN** `_site/posts/0070-namingthingsishard/index.html` exists and no other post path variant (differently-cased, trailing-slash-missing, etc.) is emitted

### Requirement: Every page URL matches the previous Hugo output

Every static page under the Eleventy build SHALL be emitted at a URL path byte-identical to the Hugo output, including the `/pages/` prefix (e.g. `/pages/about/`, `/pages/guest-faq/`, `/pages/sponsorship/`, `/pages/guest-faq-manual-recordings/`).

#### Scenario: Page URL byte-match

- **WHEN** the site is built
- **THEN** each of `/pages/about/`, `/pages/guest-faq/`, `/pages/guest-faq-manual-recordings/`, `/pages/sponsorship/` resolves to an HTML file at that exact path under `_site/`

### Requirement: Tag URLs preserve Hugo slug conventions

Tag index pages SHALL be emitted at `/tags/<slug>/` where `<slug>` matches the exact directory name produced by Hugo for that tag, including preserved `.` and `#` characters (e.g. `/tags/c#/`, `/tags/asp.net/`, `/tags/c#12/`, `/tags/dotnet/`).

#### Scenario: Tag directory parity

- **WHEN** the current live site has a tag directory `public/tags/c#/`
- **THEN** the Eleventy build emits `_site/tags/c#/index.html`

#### Scenario: All tags index

- **WHEN** the site is built
- **THEN** `/tags/index.html` exists and lists every tag present across all non-draft posts

### Requirement: Pagination URL parity

Home and tag-detail pagination SHALL emit pages at `/page/<n>/` and `/tags/<slug>/page/<n>/` respectively, matching Hugo's pagination URL pattern, starting from `/page/2/` (page 1 lives at the index).

#### Scenario: Home pagination

- **WHEN** the total post count exceeds one page
- **THEN** `_site/page/2/index.html` exists with older posts and links forward/backward correctly

### Requirement: Home page URL

The site index SHALL be emitted at `/` as `_site/index.html`, paginating the `posts` collection at the same page size the Hugo build used.

#### Scenario: Home index

- **WHEN** the site is built
- **THEN** `_site/index.html` lists the most recent posts in descending date order

### Requirement: URL diff verification before cutover

Before the migration commit is merged to `main`, a comparison SHALL be performed between the sorted list of all HTML paths in the Hugo `public/` build and the sorted list of all HTML paths in the Eleventy `_site/` build. The diff MUST be empty, or any differences MUST be individually documented and explicitly accepted.

#### Scenario: Empty diff gate

- **WHEN** the URL diff script compares Hugo and Eleventy outputs
- **THEN** the diff output is empty, or each non-empty entry appears in an accepted-differences list committed to the change

### Requirement: CNAME preserved

The deployed site SHALL continue to serve from the custom domain `unhandledexceptionpodcast.com`. The build or deploy SHALL ensure a file `CNAME` containing `unhandledexceptionpodcast.com` is present at the root of the deployed artifact.

#### Scenario: CNAME on gh-pages

- **WHEN** the deploy workflow pushes to the `gh-pages` branch
- **THEN** the root of that branch contains a `CNAME` file with contents `unhandledexceptionpodcast.com` (plus optional trailing newline)
