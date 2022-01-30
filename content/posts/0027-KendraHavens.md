---
title: "Episode 27: Visual Studio 2022 - with Kendra Havens"
date: 2021-10-24
draft: false
episodeId: 9422343
---

Not long to go until the release of both .NET 6 and Visual Studio 2022! But if you can't wait that long - the preview releases of both can be downloaded right now! In this episode, I was joined by [Kendra Havens](https://twitter.com/gotheap) to chat about what's new and coming! Kendra is a Program Manager on the .NET and Visual Studio team, and we also chatted a bit in this episode about what software development is like internally at Microsoft, and learn that Microsoft face the same struggles as most other companies! We're all human after all!

{{< buzzsprout-episode 9422343 >}}

# Kendra's social links

* [Twitter](https://twitter.com/gotheap)
* [LinkedIn](https://www.linkedin.com/in/kendrahavens/)
* [Github](https://github.com/kendrahavens)

# Links from the show

* [Visual Studio 2022 Preview](https://visualstudio.microsoft.com/vs/preview/)
* [.NET Conf 2021](https://www.dotnetconf.net/)
* [Update on .NET Multi-platform App UI (.NET MAUI)](https://devblogs.microsoft.com/dotnet/update-on-dotnet-maui/)
* [IntelliCode](https://visualstudio.microsoft.com/services/intellicode/)
* [IntelliTest](https://docs.microsoft.com/en-us/visualstudio/test/intellitest-manual/?view=vs-2019)
* [Pex](https://www.microsoft.com/en-us/research/project/pex-and-moles-isolation-and-white-box-unit-testing-for-net)
* [Playwright](https://playwright.dev/)
* [Git podcast episode that was mentioned](https://unhandledexceptionpodcast.com/posts/0023-git/)
* [Multi repo support in Visual Studio](https://devblogs.microsoft.com/visualstudio/multi-repo-support-in-visual-studio/)
* [Hot Reload](https://devblogs.microsoft.com/dotnet/introducing-net-hot-reload/)
* [GitHub Copilot](https://copilot.github.com/)

# Followup notes from the show...

Below is some information from Kendra addressing a couple of points mentioned in the show...

## Intellisense completion for unimported doc

_"The partial check box for providing intellisense completion for unimported namespaces signifies you may or may not be part of an AB test we are using to roll it out as “on” by default. We have some perf concerns of it slowing down intellisense loading so we want an easy way to flip it off and we’re watching if people experience any delays. Checking it entirely on with the check box will opt you in! We’ve added this in VS 2019 version 16.5. We also have completion for extension methods which is pretty cool!"_

[More information](https://docs.microsoft.com/en-us/visualstudio/ide/reference/intellisense-completion-unimported-types-extension-methods?view=vs-2019)

## IntelliCode whole-line completion

_"IntelliCode whole line completions are doing something similar with rolling out “on by default” options in VS 22. They have a slightly different UI, but same idea. So some listeners might need to turn it on by default."_

[More information](https://devblogs.microsoft.com/visualstudio/type-less-code-more-with-intellicode-completions/)
