# Semantic Line Breaker

<!-- ![](https://img.shields.io/github/downloads/chrisgrieser/obsidian-sembr/total?label=Total%20Downloads&style=plastic) ![](https://img.shields.io/github/v/release/chrisgrieser/obsidian-sembr?label=Latest%20Release&style=plastic) [![](https://img.shields.io/badge/changelog-click%20here-FFE800?style=plastic)](Changelog.md) -->

[Obsidian](https://obsidian.md/) Plugin for Semantic Line Breaks (SemBr)

## Table of Contents
<!-- MarkdownTOC -->

- [What are Semantic Line Breaks?](#what-are-semantic-line-breaks)
- [What does this plugin do?](#what-does-this-plugin-do)
- [Installation](#installation)
- [Contribute](#contribute)
- [About the Developer](#about-the-developer)
	- [Profiles](#profiles)
	- [Donate](#donate)

<!-- /MarkdownTOC -->

## What are Semantic Line Breaks?
At its core, "Semantic Line Breaks" (SemBr) simply means complying to one rule:

> When writing text with a compatible markup language, add a line break after each substantial unit of thought.

When you have the `Strict Line Breaks` settings enabled in Obsidian, single line breaks are ignored, meaning that in Reading View, the text is displayed normally.

Using Semantic line breaks has two advantages:
1. Text is broken up into unit of thought, which can be helpful for writing and editing text.
2. Most tools in Obsidian (or other text editors in general) work on a per-line-basis, e.g. `Swap Line Up`. While useful for notes and outlines, those commands are virtually useless when writing prose where your lines are essentially paragraphs consisting of multiple sentences. With Semantic line breaks, every line roughly equals a sentence, so that all those line-based commands now work on sentences. (Notably, this advantage also applies to vim mode.)
3. [Diff Views](https://obsidian.md/plugins?id=obsidian-version-history-diff) (i.e. comparing the current version of your writing with older versions) become much more usable, since now changes in sentences and not whole paragraphs are indicated.

[You can read more on Semantic Line Breaks here.](https://sembr.org/)

## What does this plugin do?
Right now, it simply adds one command/hotkey: `Toggle Semantic Line Breaks`, which turns your prose text into "semantically-line-broken" text. When the note already has semantic line breaks, the command will turn text back into "normal-line-broken" text.

![demo semantic line breaks](/assets/demo-sembr.gif)

__The plugin ensures__
- YAML Headers are left untouched.
- [Markdown's Two-Space Rule](https://daringfireball.net/projects/markdown/syntax#p) is respected, meaning that line breaks preceded by two (or more) spaces are preserved.
- Dataview inline attributes (`key:: value`) are preserved.
- Markdown footnotes at the end of a sentence are factored in.

__Caveats & limitations__
- Code blocks are not factored in by this plugin.
- Various cases of punctuation in tables will also in a badly formatted table.

## Installation
Right now, the plugin is still in beta. It can be installed with the [BRAT Plugin](https://github.com/TfTHacker/obsidian42-brat).

When published,it will be available in Obsidian's Community Plugin Browser via: `Settings` → `Community Plugins` → `Browse` → Search for *"Semantic Line Breaker"*

## Contribute
Please use the [`.eslintrc` configuration located in the repository](.eslintrc) and run eslint before doing a pull request, and please do *not* use `prettier`. 🙂

```shell
# Run eslint fixing most common mistakes
eslint --fix *.ts
```

## About the Developer
In my day job, I am a sociologist studying the social mechanisms underlying the digital economy. For my PhD project, I investigate the governance of the app economy and how software ecosystems manage the tension between innovation and compatibility. If you are interested in this subject, feel free to get in touch!

<!-- markdown-link-check-disable -->
### Profiles
- [Academic Website](https://chris-grieser.de/)
- [ResearchGate](https://www.researchgate.net/profile/Christopher-Grieser)
- [Discord](https://discordapp.com/users/462774483044794368/)
- [GitHub](https://github.com/chrisgrieser/)
- [Twitter](https://twitter.com/pseudo_meta)
- [LinkedIn](https://www.linkedin.com/in/christopher-grieser-ba693b17a/)

### Donate
<a href='https://ko-fi.com/Y8Y86SQ91' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
<!-- markdown-link-check-enable -->
