---
name: podcast-create-social-post
description: Write the social media post announcing a new podcast episode, as one text that works on X, LinkedIn, Bluesky and Mastodon. Use when Dan asks for a social post, tweet or announcement for an episode.
user-invocable: true
---

Write one announcement post for an episode that Dan can paste unchanged into X, LinkedIn, Bluesky and Mastodon.

## Gather

- Work out which episode from the conversation. If it's unclear, use the latest published post in `posts/` (no `draft: true`, date on or before today) and say which one you picked.
- Read that post's front matter and intro paragraph. Take the guest's X handle from the guest socials list (e.g. `https://x.com/gsferreira` becomes `@gsferreira`).
- The URL is `https://unhandledexceptionpodcast.com` + the post's `permalink`.

## Shape

Follow this example, which Dan wrote and used:

```
🎙️ New episode has just dropped! @gsferreira is back on the podcast for the first of two episodes, and this time we're chatting about Claude Code, including our favourite features and tips! #UnhandledException

https://unhandledexceptionpodcast.com/posts/0089-guiferreira/
```

- Open with `🎙️ New episode has just dropped!`.
- Refer to the guest by their X handle. If they have no X handle, use their name.
- Call it "the podcast". Don't write out "The Unhandled Exception Podcast".
- Say what the episode is about in one sentence, at the level of the topic. Don't list specific features, tips or segments.
- Only describe the episode's format in ways the show notes or transcript support. Don't call it a "lightning round", "deep dive", "debate" and so on unless it actually was one.
- If the guest has been on before, say they're "back". If the episode is part of a series recorded together, say so (e.g. "the first of two episodes").
- End the sentence paragraph with `#UnhandledException` on the same line. Don't give the hashtag its own paragraph.
- Put the URL alone in the last paragraph.
- Use plain ASCII punctuation: hyphens, not em-dashes, and straight quotes. The 🎙️ emoji is the exception.

## Length

Keep the whole post, including the full URL, at 300 characters or fewer. That's Bluesky's limit, and Bluesky counts the full URL. X counts any link as 23 characters, so a post under 300 on Bluesky is under X's 280. Mastodon (500) and LinkedIn are looser.

Count with a script, not by eye, e.g. `python3 -c "print(len(open('post.txt').read().rstrip()))"` on a scratchpad file.

## Output

Give the post in a code block so Dan can copy it, then its character count on one line. Don't suggest per-platform variants unless asked.
