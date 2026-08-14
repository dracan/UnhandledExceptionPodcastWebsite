## Why

The Hugo-to-Eleventy migration was a pure technology swap that deliberately kept the m10c
look-and-feel, on the understanding that styling work would follow. This is that work.

The new look-and-feel comes from the "Unhandled Exception Redesign" Claude Design project.
It replaces the m10c header-sidebar-above-content layout with a sticky sidebar shell, adds
episode cover art, guest names and blurbs to the listing, and introduces client-side search.

The specs in `openspec/specs/theme/` currently describe m10c in enough detail to be actively
misleading - they assert SCSS variables, partial filenames and CSS classes that no longer
exist. This change brings them back in line with the site.

## What Changes

- Replace the m10c SCSS tree with a port of the redesign. Design tokens become CSS custom
  properties; every dimension is expressed in `rem` off a single root font size, because the
  design was authored at 125% browser zoom and its px values render 25% small at 100%.
- Replace the header sidebar with a `.shell` grid: a sticky sidebar (wordmark, host chip, nav
  with counts, Discord CTA, listen-on tiles, coffee CTA, newsletter, socials, tag cloud) and a
  centred content column.
- Derive `ep.number`, `ep.title`, `ep.guest`, `ep.blurb` and `ep.cover` from existing front
  matter and body text, so episode rows carry cover art and context without back-filling 88
  posts. Add `guest` / `epNumber` / `blurb` front matter overrides for where the parsing guesses
  wrong.
- Add client-side search and tag filtering over a generated `/episodes.json` index, degrading to
  plain tag links without JavaScript.
- Generate resized episode cover thumbnails at build time. The unoptimised originals were
  costing 2.4 MB on the first page of the listing.
- Fingerprint CSS, JS and the episode index so a stale browser cache cannot pair new HTML with
  an old stylesheet.
- Add a build verification step that fails the build on a disappeared URL, a missing image, an
  unresolved icon name, or a page missing from the sitemap.
- **BREAKING (URLs unchanged)**: no page URL changes. Permalinks and Giscus comment threads are
  unaffected; this is verified by the new URL guard.

## Capabilities

### Modified Capabilities

- `theme`: the look-and-feel is now the redesign rather than m10c. Layout, partials, token
  system, typographic scale and episode listing all change.
- `content-model`: adds derived episode fields and their front matter overrides, page
  presentation front matter, and the `unlisted` flag.
- `site-build`: adds JS passthrough, asset fingerprinting, build-time image resizing, and a
  verification step between build and deploy.

### Unaffected Capabilities

- `url-preservation`: every URL is unchanged and is now enforced by an automated guard.
- `comments`: Giscus remains on posts only, still keyed by pathname.
- `hosting`: still GitHub Pages via GitHub Actions, with a CNAME written during the workflow.

## Non-goals

- A Guests index page. The design includes one, but the repository holds no structured guest
  data (names, roles and photos are free text in titles and bodies) and inventing it was
  rejected.
- Converting the Guest FAQ into the design's accordion. The real page is long-form prose under
  question headings, not short Q&A pairs.
- Changing markdown heading levels. Post bodies continue to emit `<h1>` for `#`.
