const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Cache-busting fingerprints.
//
// GitHub Pages serves /css/main.css with `cache-control: max-age=14400` but
// pages with `max-age=600`. Without a fingerprint a returning visitor picks up
// new HTML within 10 minutes while keeping the old stylesheet for up to four
// hours, which renders the site with mismatched markup and CSS.
//
// Appending a content hash to the URL means a changed asset is a different URL,
// so a stale cache entry simply can't match it. Hashing the *sources* (rather
// than the build output) keeps this independent of whether sass has run yet,
// which matters because `pnpm run dev` runs sass and Eleventy in parallel.

function filesUnder(dir, ext) {
  const found = [];
  const walk = (current) => {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(ext)) found.push(full);
    }
  };
  walk(dir);
  return found.sort();
}

function fingerprint(paths) {
  const hash = crypto.createHash("sha1");
  for (const file of paths) {
    try {
      hash.update(file);
      hash.update(fs.readFileSync(file));
    } catch {
      // A file that vanished mid-build just doesn't contribute to the hash.
    }
  }
  return hash.digest("hex").slice(0, 8);
}

module.exports = {
  css: fingerprint(filesUnder("css", ".scss")),
  js: fingerprint(filesUnder("js", ".js")),
  // /episodes.json is derived from the posts, so it goes stale whenever an
  // episode is published - which would otherwise leave the home page search
  // unable to find the newest episode for four hours.
  episodes: fingerprint(filesUnder("posts", ".md")),
};
