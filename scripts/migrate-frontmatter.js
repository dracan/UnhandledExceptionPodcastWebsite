const fs = require("fs");
const path = require("path");

function readDir(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function processFile(file, { kind }) {
  const raw = fs.readFileSync(file, "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) {
    console.error(`No front matter in ${file}`);
    process.exit(1);
  }
  let fm = match[1];
  let body = match[2];

  const slug = path.basename(file, ".md").toLowerCase();
  const permalink =
    kind === "post" ? `/posts/${slug}/` : `/pages/${slug}/`;
  const layout = kind === "post" ? "layouts/post.njk" : "layouts/page.njk";

  // Skip if already has permalink
  if (!/^permalink:/m.test(fm)) {
    fm = fm.replace(/\s*$/, "") + `\npermalink: "${permalink}"`;
  }
  if (!/^layout:/m.test(fm)) {
    fm = fm.replace(/\s*$/, "") + `\nlayout: "${layout}"`;
  }
  // Remove `type: page` for pages (now unused)
  if (kind === "page") {
    fm = fm.replace(/^type:\s*page\s*$/m, "").replace(/\n\n+/g, "\n");
  }

  // Replace Hugo shortcode with Eleventy shortcode (posts only)
  if (kind === "post") {
    body = body.replace(
      /\{\{\s*<\s*buzzsprout-episode\s+(\d+)\s*>\s*\}\}/g,
      "{% buzzsprout $1 %}"
    );
  }

  const out = `---\n${fm.trim()}\n---\n${body}`;
  fs.writeFileSync(file, out, "utf8");
}

const postsDir = path.resolve(__dirname, "..", "posts");
const pagesDir = path.resolve(__dirname, "..", "pages");

let postCount = 0;
readDir(postsDir).forEach((f) => {
  processFile(f, { kind: "post" });
  postCount++;
});
let pageCount = 0;
readDir(pagesDir).forEach((f) => {
  processFile(f, { kind: "page" });
  pageCount++;
});

console.log(`Migrated ${postCount} posts, ${pageCount} pages`);
