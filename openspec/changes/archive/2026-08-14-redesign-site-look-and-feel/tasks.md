# Tasks

Items 1-8 shipped ahead of this proposal being written; they are recorded here so the archived
change reflects what was actually done. Items 9-16 are the follow-up work agreed after review.

## 1. Port the redesign

- [x] 1.1 Replace the m10c SCSS tree with redesign component partials
- [x] 1.2 Declare design tokens as CSS custom properties
- [x] 1.3 Rebuild `base.njk` as the `.shell` grid with a sidebar partial
- [x] 1.4 Rewrite post, page and list layouts
- [x] 1.5 Add `brandicon.njk` for solid brand glyphs
- [x] 1.6 Rewrite the listen-on, discord, newsletter, bmac and tagcloud partials

## 2. Derived episode data

- [x] 2.1 Add `posts/posts.11tydata.js` deriving number, title, guest, blurb and cover
- [x] 2.2 Support `guest` / `epNumber` / `blurb` front matter overrides
- [x] 2.3 Fix the broken cover path in `posts/0080-OhMyPosh.md`

## 3. Search

- [x] 3.1 Emit `/episodes.json`
- [x] 3.2 Add `js/site.js` with search, tag chips and pagination restore
- [x] 3.3 Keep tag chips working as plain links without JavaScript

## 4. Sizing

- [x] 4.1 Convert every dimension to `rem` off a single root font size
- [x] 4.2 Set the root to 125%, stepping down on narrow viewports
- [x] 4.3 Expose `--content-max`, `--page-max` and `--main-pad-x`

## 5. Episode page

- [x] 5.1 Remove the duplicate cover thumbnail from the episode header

## 6. Cache correctness

- [x] 6.1 Fingerprint CSS, JS and the episode index from their sources
- [x] 6.2 Add `css/` as an Eleventy watch target

## 7. Responsive corrections

- [x] 7.1 Keep the episode row side-by-side on narrow screens
- [x] 7.2 Stop shrinking the cover at tablet widths

## 8. Icon macro context

- [x] 8.1 Import the episode list macros `with context` so icon lookups resolve

## 9. Image optimisation

- [x] 9.1 Add `@11ty/eleventy-img` and a shortcode or filter for episode covers
- [x] 9.2 Emit resized covers in the listing and mirror them in `js/site.js`
- [x] 9.3 Carry the resized cover URL in `/episodes.json`
- [x] 9.4 Add the image cache directory to `.gitignore`
- [x] 9.5 Confirm first-page cover weight is under 250 KB

## 10. Home page heading

- [x] 10.1 Add a visually hidden `<h1>` to the home page and later pagination pages

## 11. Sitemap

- [x] 11.1 Add a `pages` collection and use it in `sitemap.njk`
- [x] 11.2 Add `unlisted: true` to `pages/guest-faq-manual-recordings.md`
- [x] 11.3 Exclude unlisted pages from the sitemap

## 12. Sass modernisation

- [x] 12.1 Move `:root` tokens into their own partial
- [x] 12.2 Convert `@import` to `@use`
- [x] 12.3 Verify the compiled CSS is unchanged

## 13. Toolchain

- [x] 13.1 Bump `actions/checkout`, `actions/setup-node` and `pnpm/action-setup`

## 14. Dead assets

- [x] 14.1 Delete the orphaned images, the two Photoshop sources and `patreon.njk`
- [x] 14.2 Drop the unused Space Grotesk family from the font request

## 15. Accessibility

- [x] 15.1 Add `aria-live="polite"` to the filtered result count
- [x] 15.2 Add a skip link
- [x] 15.3 Add `:focus-visible` styles matching the design

## 16. Build verification

- [x] 16.1 Add `scripts/verify-build.mjs` with the four checks
- [x] 16.2 Commit the known-URL snapshot
- [x] 16.3 Wire `pnpm run verify` into CI between build and deploy
