---
title: "About"
draft: false
permalink: "/pages/about/"
layout: "layouts/page.njk"
---

<img class="about-profile-photo" src="/images/dan-profile.jpg" alt="Dan Clarke" />

The Unhandled Exception Podcast is a software development show hosted by [Dan Clarke](https://www.danclarke.com) - conversations with guests from across the industry about the craft of building software.

{% set firstPost = collections.posts | last %}
<p class="about-stats">{{ collections.posts.length }} episodes since {{ firstPost.date.getFullYear() }}</p>

Historically the show has been more .NET focused, while still covering plenty of broader topics like Git, Kubernetes, Docker, testing, architecture, performance, DevOps, and soft skills. The back catalogue is broad, so dip in wherever interests you.

But given the changing times with AI - the focus has shifted toward AI-driven development: AI-assisted coding, agents, LLM tooling, the new workflows that come with them, and what it all means for the day-to-day of shipping software.

Episodes are conversational rather than scripted, and most end with "dev picks": a tip, tool, project, or article worth sharing.

<div class="about-listen-on">
  <p class="about-listen-on-label">Listen on</p>
  {% include "partials/listenon.njk" %}
</div>

# Get in touch

All my contact details and social links can be found on my website: [danclarke.com](https://www.danclarke.com).

You're also welcome to join the podcast's [Discord community](https://discord.gg/bfsWQDP9Nh).

