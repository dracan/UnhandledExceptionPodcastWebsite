module.exports = {
  title: "The Unhandled Exception Podcast",
  baseUrl: "https://unhandledexceptionpodcast.com/",
  languageCode: "en-gb",
  description: "Software Development podcast hosted by Dan Clarke",
  author: "Dan Clarke",
  avatar: "/images/UepLogoText.png",
  menuItemSeparator: " - ",
  googleAnalyticsId: "G-RN9Q259LF1",
  buzzsproutShowId: "978640",
  buzzsproutRssUrl: "https://feeds.buzzsprout.com/978640.rss",
  giscus: {
    repo: "dracan/unhandledexceptionpodcast-comments",
    repoId: "R_kgDOQSZ8HA",
    category: "Comments",
    categoryId: "DIC_kwDOQSZ8HM4CxnOC",
  },
  social: [
    { name: "github", url: "https://github.com/dracan/UnhandledExceptionPodcastWebsite" },
    { name: "twitter", url: "https://x.com/dracan" },
    { name: "mastodon", url: "https://mstdn.social/@danclarke" },
  ],
  // `icon` is a key from _data/icons.json; `count` picks the counter shown in
  // the sidebar nav ("episodes" or "tags").
  menu: [
    { name: "Episodes", url: "/", icon: "headphones", count: "episodes" },
    { name: "Tags", url: "/tags/", icon: "tag", count: "tags" },
    { name: "About", url: "/pages/about/", icon: "info" },
    { name: "Guest FAQ", url: "/pages/guest-faq/", icon: "help-circle" },
    { name: "Sponsorship", url: "/pages/sponsorship/", icon: "heart" },
  ],
  discordUrl: "https://discord.gg/bfsWQDP9Nh",
  buyMeACoffeeUrl: "https://www.buymeacoffee.com/danclarke",
  newsletterUrl:
    "https://danclarke.beehiiv.com/?utm_source=UnhandledExceptionPodcastWebsite&utm_medium=website",
  hostUrl: "https://www.danclarke.com/",
  copyrightYear: new Date().getFullYear(),
  listenOn: [
    { name: "Apple Podcasts", icon: "apple", color: "#a24cc0", url: "https://podcasts.apple.com/gb/podcast/the-unhandled-exception-podcast/id1536194837" },
    { name: "Spotify", icon: "spotify", color: "#1db954", url: "https://open.spotify.com/show/2DgUE1Iyl9cZxzzvUUIPBK" },
    { name: "YouTube", icon: "youtube", color: "#ff0000", url: "https://www.youtube.com/@UnhandledExceptionPodcast/podcasts" },
    { name: "Pocket Casts", icon: "pocketcasts", color: "#f43e37", url: "https://play.pocketcasts.com/podcasts/63c68d60-f59a-0138-e82d-0acc26574db2" },
    { name: "Podcast Addict", icon: "podcastaddict", color: "#f4842d", url: "https://podcastaddict.com/podcast/3143967" },
    { name: "Podchaser", icon: "podchaser", color: "#eb6f67", url: "https://www.podchaser.com/podcasts/the-unhandled-exception-podcas-1519582" },
    { name: "RSS Feed", icon: "rss-filled", color: "#ee802f", url: "https://feeds.buzzsprout.com/978640.rss" },
  ],
};
