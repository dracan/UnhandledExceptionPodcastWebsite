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
      .replace(/[^\w.#-]+/g, "")
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

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tagSet = new Set();
    collectionApi.getFilteredByGlob("posts/*.md").forEach((item) => {
      if (item.data && item.data.draft) return;
      let tags = item.data.tags || [];
      if (typeof tags === "string") tags = [tags];
      tags
        .map((t) => String(t))
        .filter((t) => t && t.toLowerCase() !== "post")
        .forEach((t) => tagSet.add(t));
    });
    return Array.from(tagSet).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );
  });

  eleventyConfig.addCollection("tagStats", function (collectionApi) {
    const counts = new Map();
    collectionApi.getFilteredByGlob("posts/*.md").forEach((item) => {
      if (item.data && item.data.draft) return;
      let tags = item.data.tags || [];
      if (typeof tags === "string") tags = [tags];
      tags.forEach((t) => {
        const tag = String(t);
        if (!tag || tag.toLowerCase() === "post") return;
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    const items = Array.from(counts, ([tag, count]) => ({ tag, count }));
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
    const byTag = new Map();
    collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((p) => p.data && !p.data.draft)
      .forEach((post) => {
        let tags = post.data.tags || [];
        if (typeof tags === "string") tags = [tags];
        tags
          .map((t) => String(t))
          .filter((t) => t && t.toLowerCase() !== "post")
          .forEach((tag) => {
            if (!byTag.has(tag)) byTag.set(tag, []);
            byTag.get(tag).push(post);
          });
      });

    const hugoSlug = (str) =>
      String(str)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w.#-]+/g, "")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

    const pages = [];
    Array.from(byTag.entries())
      .sort(([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .forEach(([tag, posts]) => {
        posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
        const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
        for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
          const start = (pageNumber - 1) * PAGE_SIZE;
          pages.push({
            tag,
            slug: hugoSlug(tag),
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
