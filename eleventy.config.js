const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = async function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy({ "favicon.ico": "favicon.ico" });

  eleventyConfig.addShortcode("buzzsprout", function (id) {
    return (
      `<div id="buzzsprout-player-${id}"></div>\n` +
      `<script src="https://www.buzzsprout.com/978640/${id}-hello-world.js` +
      `?container_id=buzzsprout-player-${id}&player=small" ` +
      `type="text/javascript" charset="utf-8"></script>`
    );
  });

  eleventyConfig.addFilter("dateDisplay", function (dateObj) {
    if (!dateObj) return "";
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
  });

  eleventyConfig.addFilter("hugoSlug", function (str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w.#/-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  eleventyConfig.addFilter("absoluteUrl", function (url, base) {
    try {
      return new URL(url, base).toString();
    } catch {
      return url;
    }
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((p) => p.data && !p.data.draft)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  const hugoSlugFn = (str) =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w.#/-]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const groupPostsBySlug = (collectionApi) => {
    const bySlug = new Map();
    collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((p) => p.data && !p.data.draft)
      .forEach((post) => {
        let tags = post.data.tags || [];
        if (typeof tags === "string") tags = [tags];
        const seenThisPost = new Set();
        tags
          .map((t) => String(t))
          .filter((t) => t && t.toLowerCase() !== "post")
          .forEach((tag) => {
            const slug = hugoSlugFn(tag);
            if (!slug) return;
            if (seenThisPost.has(slug)) return;
            seenThisPost.add(slug);
            if (!bySlug.has(slug)) bySlug.set(slug, { names: [], posts: [] });
            const entry = bySlug.get(slug);
            entry.names.push(tag);
            entry.posts.push(post);
          });
      });
    return bySlug;
  };

  const pickName = (names) =>
    names.find((n) => n !== n.toLowerCase()) || names[0];

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const bySlug = groupPostsBySlug(collectionApi);
    return Array.from(bySlug.values())
      .map(({ names }) => pickName(names))
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  });

  eleventyConfig.addCollection("tagStats", function (collectionApi) {
    const bySlug = groupPostsBySlug(collectionApi);
    const items = Array.from(bySlug.entries()).map(([slug, { names, posts }]) => ({
      tag: pickName(names),
      slug,
      count: posts.length,
    }));
    const max = items.reduce((m, x) => Math.max(m, x.count), 0);
    const min = items.reduce((m, x) => Math.min(m, x.count), max || 0);
    const denom = Math.max(1, max - min);
    items.forEach((x) => {
      x.weight = (x.count - min) / denom;
    });
    items.sort(
      (a, b) =>
        b.count - a.count || a.tag.toLowerCase().localeCompare(b.tag.toLowerCase())
    );
    return { items, min, max };
  });

  eleventyConfig.addCollection("tagPages", function (collectionApi) {
    const PAGE_SIZE = 10;
    const bySlug = groupPostsBySlug(collectionApi);
    const pages = [];
    Array.from(bySlug.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([slug, { names, posts }]) => {
        const tag = pickName(names);
        posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
        const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          const start = (pageNumber - 1) * PAGE_SIZE;
          pages.push({
            tag,
            slug,
            pageNumber,
            totalPages,
            posts: posts.slice(start, start + PAGE_SIZE),
          });
        }
      });
    return pages;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
