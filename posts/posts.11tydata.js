const fs = require("fs");

// Cover thumbnails render at 160px on desktop, 144px on tablet and 72px on
// phones, so 160w and 320w (for 2x displays) is all the listing ever needs.
// The originals are up to 1254x1254 PNGs - one of them alone was 1.2MB.
const COVER_WIDTHS = [160, 320];

let eleventyImage = null;
async function loadImage() {
  // eleventy-img is ESM and this data file is CommonJS.
  if (!eleventyImage) eleventyImage = import("@11ty/eleventy-img").then((m) => m.default);
  return eleventyImage;
}

async function resizeCover(urlPath) {
  try {
    const Image = await loadImage();
    const metadata = await Image("." + urlPath, {
      widths: COVER_WIDTHS,
      formats: ["webp"],
      outputDir: "./_site/img/",
      urlPath: "/img/",
    });
    const variants = metadata.webp;
    return {
      src: variants[variants.length - 1].url,
      srcset: variants.map((v) => v.srcset).join(", "),
    };
  } catch {
    // A missing or undecodable source falls back to the original path rather
    // than failing the build; verify-build.mjs is what catches broken paths.
    return { src: urlPath, srcset: "" };
  }
}

// The redesign's episode rows need a few fields that aren't in the front matter:
// the episode number, the guest name, a short blurb and a cover image. Rather
// than back-fill all 88 posts, derive them from what's already there.
//
// Escape hatches (front matter, per post):
//   epNumber: 42          - override the parsed episode number
//   guest: "Ada Lovelace" - override the parsed guest ("" suppresses it)
//   blurb: "..."          - override the derived blurb

const FALLBACK_COVER = "/images/logo.png";

// "Episode 85: Simplicity First - with Chris Woody Woodruff"
//   -> { number: 85, title: "Simplicity First", guest: "Chris Woody Woodruff" }
function parseTitle(rawTitle, splitGuest = true) {
  let rest = String(rawTitle || "").trim();
  let number = null;

  // `[^:]*` swallows things like the party popper in "Episode 50 🎉:"
  const numberMatch = /^Episode\s+(\d+)[^:]*:\s*/i.exec(rest);
  if (numberMatch) {
    number = parseInt(numberMatch[1], 10);
    rest = rest.slice(numberMatch[0].length).trim();
  }

  // An explicit `guest` in the front matter also means "leave my title alone" -
  // otherwise a title like "Jetbrains Rider, and Code With Me" loses its tail.
  if (!splitGuest) return { number, title: rest, guest: null };

  let guest = null;
  // Prefer an explicit " - with " separator, then fall back to a bare " with ".
  const separator =
    /\s+[-–—]\s+with\s+/i.exec(rest) || /\s+with\s+/i.exec(rest);
  if (separator) {
    guest = rest.slice(separator.index + separator[0].length).trim();
    rest = rest.slice(0, separator.index).trim();
  }

  return { number, title: rest, guest: guest || null };
}

function readBody(inputPath) {
  try {
    const raw = fs.readFileSync(inputPath, "utf8");
    const frontMatter = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(raw);
    return frontMatter ? raw.slice(frontMatter[0].length) : raw;
  } catch {
    return "";
  }
}

// First real prose block, skipping HTML, shortcodes, headings, lists and rules.
function firstParagraph(body) {
  for (const block of body.split(/\r?\n\s*\r?\n/)) {
    const text = block.trim();
    if (!text) continue;
    if (/^(<|\{%|#|!\[|\*|-\s|-{3,}|>|\||```)/.test(text)) continue;
    return text;
  }
  return "";
}

function toPlainText(markdown) {
  return String(markdown)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]*)\*\*/g, "$1")
    .replace(/\*([^*]*)\*/g, "$1")
    .replace(/(^|\s)_([^_]*)_(?=\s|$)/g, "$1$2")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, limit) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  return trimmed.replace(/[\s,;:.]+$/, "") + "...";
}

function coverFor(images) {
  const first = Array.isArray(images) ? images[0] : null;
  if (!first) return FALLBACK_COVER;
  return first.startsWith("/") ? first : "/" + first.replace(/^\.?\//, "");
}

module.exports = {
  eleventyComputed: {
    ep: async (data) => {
      const hasGuestOverride = data.guest !== undefined;
      const parsed = parseTitle(data.title, !hasGuestOverride);
      const number = data.epNumber != null ? data.epNumber : parsed.number;
      const guest = hasGuestOverride ? data.guest || null : parsed.guest;
      const blurb =
        data.blurb || truncate(toPlainText(firstParagraph(readBody(data.page.inputPath))), 240);

      const cover = coverFor(data.images);
      const resized = await resizeCover(cover);

      return {
        number,
        label: number == null ? null : "EP." + String(number).padStart(3, "0"),
        title: parsed.title || data.title,
        guest,
        blurb,
        // `cover` stays the original: post bodies and social preview metadata
        // reference it directly, and scrapers want the full-size image.
        cover,
        coverSrc: resized.src,
        coverSrcset: resized.srcset,
        hasCover: Boolean(Array.isArray(data.images) && data.images[0]),
      };
    },
  },
};
