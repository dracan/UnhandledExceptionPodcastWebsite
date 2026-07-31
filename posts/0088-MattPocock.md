---
title: "Episode 88: Agent Skills - with Matt Pocock"
date: 2026-07-31
episodeId: 19580032
tags: ["ai", "productivity"]
twitter_cards: true
images: ["images/0088-MattPocock/matt-pocock.jpg"]
permalink: "/posts/0088-mattpocock/"
layout: "layouts/post.njk"
---

In this episode, I was joined by [Matt Pocock](https://www.mattpocock.com/) - creator of [Total TypeScript](https://www.totaltypescript.com/), and the author of the wildly popular [mattpocock/skills](https://github.com/mattpocock/skills) repo of agent skills, which work with any agent or model. We deliberately agreed beforehand not to plan this one, and just let the conversation go wherever it wanted to! We chatted about his `grill-me` and `wayfinder` skills, the death of tactical programming, the "smart zone" and the "dumb zone" of context windows, whether sprints still make any sense, and the era of personal software.

{% buzzsprout 19580032 %}

---

# Matt Pocock

Matt Pocock teaches AI coding full-time at AI Hero, where he runs the AI Coding for Real Engineers cohorts. He also maintains an open-source library of agent skills - among them /grill-me, which interrogates a plan before an agent writes any of it - described in the repo as skills for doing real engineering, not vibe coding. Before AI Hero he built Total TypeScript. Before that he was a developer advocate at Vercel and a member of the XState core team, and before _that_ he was a voice coach. He lives in Oxfordshire.

* [Website](https://www.mattpocock.com/)
* [AI Hero](https://www.aihero.dev/)
* [Total TypeScript](https://www.totaltypescript.com/)
* [GitHub](https://github.com/mattpocock)
* [X / Twitter](https://x.com/mattpocockuk)
* [YouTube](https://www.youtube.com/@mattpocockuk)
* [Bluesky](https://bsky.app/profile/mattpocock.com)

---

![Dan and Matt during the recording](/images/0088-MattPocock/webcams.jpg)

---

# Links from the show

* [mattpocock/skills](https://github.com/mattpocock/skills) - Matt's agent skills repo, now approaching 200,000 GitHub stars and around 11 million downloads. The skills are agent agnostic - install them into Claude Code as a plugin, or into Codex and other agents via [skills.sh](https://skills.sh/mattpocock/skills)
* [AI Hero: Skills for Real Engineers](https://www.aihero.dev/skills) - Matt's articles and videos covering each of the skills
* [mattpocock/skills: A complete AI Coding workflow, end-to-end](https://www.youtube.com/watch?v=M6mYodf0dJM) - Matt's walkthrough video of the full skill lifecycle
* [grill-me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md) - the skill that relentlessly interviews *you* about what you're building, rather than letting the agent rush to an answer (the "chorizo sandwich" problem!)
* [My 'Grill Me' Skill Went Viral](https://www.aihero.dev/my-grill-me-skill-has-gone-viral) - Matt on why such a small skill made such a difference
* [grill-with-docs](https://github.com/mattpocock/skills/blob/main/docs/engineering/grill-with-docs.md) - grilling that also builds up a thin documentation layer over the repo, bringing DDD's ubiquitous language (and ADRs) into the codebase
* [wayfinder](https://github.com/mattpocock/skills/blob/main/docs/engineering/wayfinder.md) - maps out larger pieces of work as a tree of decision tickets in your issue tracker, including a "fog" section for what can't be scoped yet
* [handoff](https://github.com/mattpocock/skills/blob/main/docs/productivity/handoff.md) - writes up what needs doing so you can hand it to a fresh agent without derailing your current session
* [claude-handoff](https://github.com/mattpocock/skills/blob/main/skills/in-progress/claude-handoff/SKILL.md) - the evolution of the above, which spawns the new agent for you rather than making you do it by hand
* [prototype](https://github.com/mattpocock/skills/blob/main/docs/engineering/prototype.md) - because a working prototype is "catnip to agents"
* [teach](https://github.com/mattpocock/skills/blob/main/docs/productivity/teach.md) - Matt's teaching skill that we compared notes on
* [to-questionnaire](https://github.com/mattpocock/skills/blob/main/skills/in-progress/to-questionnaire/SKILL.md) - the in-progress skill Matt built to grill a non-technical collaborator via a shared doc instead of a live interrogation
* [Thariq Shihipar's tweet on letting Claude interview you](https://x.com/trq212/status/2005315275026260309) - Thariq is on Anthropic's Claude Code team, and Matt credits him for the interviewing technique that inspired `grill-me`
* [A Philosophy of Software Design](https://web.stanford.edu/~ouster/cgi-bin/book.php) - John Ousterhout's book, and the source of the tactical vs strategic programming framing (chapter 3, "Working Code Isn't Enough")
* [The Mythical Man-Month](https://en.wikipedia.org/wiki/The_Mythical_Man-Month) - Frederick P. Brooks' classic, which came up when we got onto where the labour constraint has moved to
* [OpenSpec](https://openspec.dev/) - the spec framework I use daily, which came up when we got onto specs
* [Episode 87: OpenSpec - with Tabish Bidiwale](/posts/0087-openspec/) - the previous episode, with OpenSpec's creator
* [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) - Dex Horthy of [HumanLayer](https://humanlayer.dev/), where the "smart zone" and "dumb zone" framing comes from ([and his talk on it](https://www.youtube.com/watch?v=IS_y40zY-hc))
* [Llama 4 Scout](https://ai.meta.com/blog/llama-4-multimodal-intelligence/) - the model with the 10 million token context window that Matt mentioned when explaining why context window size isn't a statement about model behaviour
* [Night Shift agentic workflow](https://jamon.dev/night-shift) - Jamon Holmgren's "day shift / night shift" framing that Matt referenced
* [Dan's "One at a time" skill](https://gist.github.com/dracan/d0c3dc90bc0b2527e5adbb58d92e33ca) - has the AI ask one question at a time instead of a wall of text
* [tmux](https://github.com/tmux/tmux) - Dan's dev pick: a terminal multiplexer that keeps your sessions alive independently of the terminal window, and that agents know how to drive
* [Spectre.Console](https://spectreconsole.net/) - what Dan had Claude Code build his tmux session dashboard with
* [Herdr](https://herdr.dev/) - Matt's dev pick: run all your coding agents from one terminal, with agent-aware state tracking ([GitHub](https://github.com/herdrdev/herdr))
* [Wispr Flow](https://wisprflow.ai/) - the dictation app we both use (and yes, the mobile app is great for dictating messages on a walk)
* [Handy](https://handy.computer/) - the open source, fully local dictation alternative Dan has tried
* [garmin_mcp](https://github.com/Taxuspt/garmin_mcp) - the community-built Garmin Connect MCP server Dan uses to have Claude Code coach his running. It sits on top of the reverse-engineered [python-garminconnect](https://github.com/cyberjunky/python-garminconnect) library

---

If you're enjoying the podcast, please remember to subscribe and share this episode with your friends and colleagues!
