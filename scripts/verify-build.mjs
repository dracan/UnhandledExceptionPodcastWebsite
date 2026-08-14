#!/usr/bin/env node
//
// Post-build checks, run between build and deploy.
//
// Eleventy exits 0 for a lot of things that are actually broken: an icon name
// that doesn't resolve renders a fallback glyph, a `selectattr` that matches
// nothing renders an empty loop, and a front matter path pointing at a file
// that doesn't exist renders a broken image. Every one of those has shipped
// from this repo. These checks turn them into build failures.
//
// Usage:  node scripts/verify-build.mjs [--update-urls]

import fs from "node:fs";
import path from "node:path";

const SITE = "_site";
const SNAPSHOT = "scripts/known-urls.txt";

const failures = [];
const notes = [];

function fail(check, detail) {
  failures.push({ check, detail });
}

function walk(dir, predicate) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full, predicate));
    else if (predicate(full)) found.push(full);
  }
  return found;
}

const htmlFiles = walk(SITE, (f) => f.endsWith(".html"));
const htmlBySource = new Map(htmlFiles.map((f) => [f, fs.readFileSync(f, "utf8")]));

// ---------------------------------------------------------------------------
// 1. No known URL has disappeared.
//
// Giscus threads are keyed by pathname, so a changed permalink silently orphans
// an episode's comments. Deliberately a subset check: publishing an episode
// adds a URL and must not require regenerating the snapshot, or the snapshot
// becomes something you update reflexively without reading.
// ---------------------------------------------------------------------------
const builtUrls = htmlFiles
  .map((f) => "/" + path.relative(SITE, f).split(path.sep).join("/"))
  .map((u) => u.replace(/index\.html$/, ""))
  .sort();

if (process.argv.includes("--update-urls")) {
  fs.writeFileSync(SNAPSHOT, builtUrls.join("\n") + "\n");
  console.log(`Wrote ${builtUrls.length} URLs to ${SNAPSHOT}`);
  process.exit(0);
}

if (!fs.existsSync(SNAPSHOT)) {
  fail("urls", `${SNAPSHOT} is missing. Create it with: node scripts/verify-build.mjs --update-urls`);
} else {
  const known = fs.readFileSync(SNAPSHOT, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
  const built = new Set(builtUrls);
  const missing = known.filter((u) => !built.has(u));
  if (missing.length) {
    fail("urls", `${missing.length} previously published URL(s) no longer built:\n    ` + missing.join("\n    "));
  }
  const added = builtUrls.filter((u) => !known.includes(u));
  if (added.length) notes.push(`${added.length} new URL(s) since the snapshot (fine; run --update-urls to record them)`);
}

// ---------------------------------------------------------------------------
// 2. Every local image referenced in the HTML exists on disk.
//
// posts/0080-OhMyPosh.md pointed at images/0080-JanDeDobbeleer/ for years. The
// only symptom was a broken social preview card, which nobody sees.
// ---------------------------------------------------------------------------
const IMG_EXT = /\.(?:png|jpe?g|gif|svg|webp|avif|ico)$/i;
const missingImages = new Map();
for (const [file, html] of htmlBySource) {
  const urls = [
    ...[...html.matchAll(/(?:src|href|content)="(\/[^"]+)"/g)]
      .map((m) => m[1])
      .filter((u) => IMG_EXT.test(u)),
    // srcset is where the resized responsive URLs actually live, so checking
    // only `src` would miss most of the images on a listing page.
    ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap(([, set]) =>
      set
        .split(",")
        .map((candidate) => candidate.trim().split(/\s+/)[0])
        .filter((u) => u.startsWith("/") && IMG_EXT.test(u))
    ),
  ];
  for (const url of urls) {
    const onDisk = path.join(SITE, decodeURIComponent(url));
    if (!fs.existsSync(onDisk)) {
      if (!missingImages.has(url)) missingImages.set(url, []);
      missingImages.get(url).push(path.relative(SITE, file));
    }
  }
}
if (missingImages.size) {
  fail(
    "images",
    [...missingImages.entries()]
      .map(([url, pages]) => `${url}  (referenced by ${pages.length} page(s), e.g. /${pages[0]})`)
      .join("\n    ")
  );
}

// ---------------------------------------------------------------------------
// 3. No unresolved icon names.
//
// icon.njk renders a generic chain-link glyph when a name isn't in
// _data/icons.json. That shipped on every episode row after a macro was
// imported without `with context`, and looked like a black smudge.
// ---------------------------------------------------------------------------
const iconFallbacks = [...htmlBySource.entries()].filter(([, html]) => html.includes("icon-link"));
if (iconFallbacks.length) {
  fail(
    "icons",
    `fallback icon rendered on ${iconFallbacks.length} page(s), e.g. /` +
      path.relative(SITE, iconFallbacks[0][0]) +
      "\n    (an icon name is missing from _data/icons.json, or a macro was imported without `with context`)"
  );
}

// ---------------------------------------------------------------------------
// 4. Every published page is in the sitemap.
//
// The sitemap's page loop used a Nunjucks selectattr that matched nothing, so
// the static pages were absent for months without a single warning.
// ---------------------------------------------------------------------------
const sitemapPath = path.join(SITE, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("sitemap", "no sitemap.xml was generated");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const unlisted = fs
    .readdirSync("pages")
    .filter((f) => f.endsWith(".md"))
    .filter((f) => /^unlisted:\s*true/m.test(fs.readFileSync(path.join("pages", f), "utf8")))
    .map((f) => f.replace(/\.md$/, ""));

  const pageUrls = builtUrls.filter((u) => u.startsWith("/pages/"));
  const expected = pageUrls.filter((u) => !unlisted.some((n) => u === `/pages/${n}/`));
  const absent = expected.filter((u) => !sitemap.includes(`<loc>https://unhandledexceptionpodcast.com${u}</loc>`));
  if (absent.length) fail("sitemap", "published page(s) missing from sitemap:\n    " + absent.join("\n    "));

  const leaked = unlisted.filter((n) => sitemap.includes(`/pages/${n}/`));
  if (leaked.length) fail("sitemap", "unlisted page(s) present in sitemap:\n    " + leaked.join("\n    "));
}

// ---------------------------------------------------------------------------
// 5. No working files published.
// ---------------------------------------------------------------------------
const working = walk(SITE, (f) => /\.(psd|ai|sketch|fig|xcf)$/i.test(f));
if (working.length) {
  fail("assets", "working file(s) in the build output:\n    " + working.join("\n    "));
}

// ---------------------------------------------------------------------------

console.log(`Verified ${htmlFiles.length} pages.`);
for (const note of notes) console.log(`  note: ${note}`);

if (failures.length) {
  console.error("\nBuild verification FAILED:\n");
  for (const { check, detail } of failures) console.error(`  [${check}] ${detail}\n`);
  process.exit(1);
}

console.log("All checks passed.");
