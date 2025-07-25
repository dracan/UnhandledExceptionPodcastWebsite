---
title: "Episode 75: The Outbox Pattern - with Tomek Masternak and Szymon Pobiega"
date: 2025-03-31
draft: false
episodeId: 16891790
tags: ["messaging"]
twitter_cards: true
images: ["images/0075-TheOutboxPattern/OutboxPatternGraphic.png"]
---

In this episode, I was joined by Tomek Masternak and Szymon Pobiega from Particular Software (NServiceBus) for a technical discussion about the Outbox Pattern! The pattern is designed to
improve reliability of messaging by storing outgoing messages in a database table (the "outbox") as part of the same transaction that modifies business data - allowing a separate process to read and publish those messages to a message broker.

{{< buzzsprout-episode 16891790 >}}

# Tomek's bio

Technology geek passionate about the design and development of software systems. Interested in distributed, message-based architectures and technology in general. Likes to know if systems work correctly, how they fail, and what that even means in the first place. Co-author at https://exactly-once.github.io/.

# Szymon's bio

Szymon works an engineer at Particular Software, the makers of NServiceBus. His main areas of expertise are Domain-Driven Design and asynchronous messaging. He is especially interested in the intersection of these two topics -- in the patterns and tools for ensuring all messages are processed exactly once and in the correct order.

Szymon is a co-author of https://exactly-once.github.io/, a website dedicated to all things related to messaging.

In his free time Szymon plays with Lego, building models of real-life off-road vehicles.

---

# Contact links

* [Tomek on LinkedIn](https://www.linkedin.com/in/tomek-masternak-9142602/)
* [Szymon on LinkedIn](https://www.linkedin.com/in/szymonpobiega/)
* [Tomek on X-Twitter](https://x.com/Masternak)
* [Szymon on X-Twitter](https://x.com/SzymonPobiega)
* [Joint blog written by both Tomek and Syzmon](https://exactly-once.github.io/)

---

# Links from the show

* [Workshop material on GitHub](https://github.com/exactly-once/workshop/tree/master/NewExercises)
* [Oskar's post on implementing Outbox using PostgreSQL](https://event-driven.io/en/push_based_outbox_pattern_with_postgres_logical_replication)
* [Jimmy Bogard @ NDC London 2025: Consistency and Agreements in Distributed Systems](https://www.youtube.com/watch?v=FZ-1dbtQXYY)
* Some outbox flavours:
    * [Async/bach](https://learn.microsoft.com/en-us/azure/architecture/databases/guide/transactional-outbox-cosmos)
    * [HTTP triggered (NServiceBus, Dapr)](https://www.youtube.com/watch?v=rTovKpG0rhY&t=1846s)

## From dev picks section

* [Zero-G flights](https://www.gozerog.com/)
* [Readwise invite link](https://readwise.io/i/dan7773) (gives an extra 1-month free trial)
* [Onyx Boox Go 6](https://euroshop.boox.com/products/boox-go-6)

---

If you're enjoying the podcast, please remember to subscribe and share this episode with your friends and colleagues!
