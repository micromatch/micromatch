# Release history

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<details>
  <summary><strong>Guiding Principles</strong></summary>

- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each versions is displayed.
- Mention whether you follow Semantic Versioning.

</details>

<details>
  <summary><strong>Types of changes</strong></summary>

Changelog entries are classified using the following labels _(from [keep-a-changelog](http://keepachangelog.com/)_):

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

</details>

## [4.0.8] - 2024-08-22

- backported CVE-2024-4067 fix (from v4.0.6) over to 4.x branch

## [4.0.7] - 2024-05-22

- this is basically v4.0.5, with some README updates
- **it is vulnerable to CVE-2024-4067**
- Updated braces to v3.0.3 to avoid CVE-2024-4068
- does NOT break API compatibility

## [4.0.6] - 2024-05-21

- Added `hasBraces` to check if a pattern contains braces.
- Fixes CVE-2024-4067
- **BREAKS API COMPATIBILITY**
- Should be labeled as a major release, but it's not.

## [4.0.1 - 4.0.5]

## [4.0.0] - 2019-03-20

### Added

- Adds support for `options.onMatch`. See the readme for details
- Adds support for `options.onIgnore`. See the readme for details
- Adds support for `options.onResult`. See the readme for details

### Breaking changes

- Require Node.js >= 8.6
- Removed support for passing an array of brace patterns to `micromatch.braces()`.
- To strictly enforce closing brackets (for `{`, `[`, and `(`), you must now use `strictBrackets=true` instead of `strictErrors`.
- `cache` - caching and all related options and methods have been removed
- `options.unixify` was renamed to `options.windows`
- `options.nodupes` Was removed. Duplicates are always removed by default. You can override this with custom behavior by using the `onMatch`, `onResult` and `onIgnore` functions.
- `options.snapdragon` was removed, as snapdragon is no longer used.
- `options.sourcemap` was removed, as snapdragon is no longer used, which provided sourcemap support.

## [3.0.0] - 2017-04-11

Complete overhaul, with 36,000+ new unit tests validated against actual output generated by Bash and minimatch. More specifically, 35,000+ of the tests:

- micromatch results are directly compared to bash results
- in rare cases, when micromatch and bash disagree, micromatch's results are compared to minimatch's results
- micromatch is much more accurate than minimatch, so there were cases where I had to make assumptions. I'll try to document these.

This refactor introduces a parser and compiler that are supersets of more granular parsers and compilers from other sub-modules. Each of these sub-modules has a singular responsibility and focuses on a certain type of matching that aligns with a specific part of the Bash "expansion" API.

These sub-modules work like plugins to seamlessly create the micromatch parser/compiler, so that strings are parsed in one pass, an [AST is created](https://gist.github.com/jonschlinkert/099c8914f56529f75bc757cc9e5e8e2a), then a new string is generated by the compiler.

Here are those sub-modules with links to related prs on those modules if you want to see how they contribute to this code:

[nanomatch](https://github.com/jonschlinkert/nanomatch) (new library) - glob expansion (`*`, `**`, `?` and `[...]`))
[braces](https://github.com/jonschlinkert/braces/pull/10) - brace expansion (`{1..10}`, `{a,b,c}`, etc)
[extglob](https://github.com/jonschlinkert/extglob/pull/5) - extended globs (`!(a|b)`, `@(!(foo|bar))`, etc)
[expand-brackets](https://github.com/jonschlinkert/expand-brackets/pull/5) - POSIX character classes `[[:alpha:][:digit:]]`

**Added**

- source map support (optionally created when using parse or compile - I have no idea what the use case is yet, but they come for free) (note that source maps are not generated for brace expansion at present, since the braces compiler uses a different strategy. I'll update if/when this changes).
- parser is exposed, so that implementors can customize or override specific micromatch parsers if necessary
- compiler is exposed, so that implementors can customize or override specific micromatch compilers if necessary

**Fixed**

- more accurate matching (passes 100% of Bash 4.3 of the brace expansion and extglob unit tests, as well as all Bash glob tests that are relevant to node.js usage, all minimatch tests, all brace-expansion tests, and also passes a couple of tests that bash fails)
- even safer - micromatch has always generated optimized patterns so it's not subject to DoS exploits like minimatch (completely different than the regex DoS issue, minimatch and multimatch are still openly exposed to being used for DoS attacks), but more safeguards were built into this refactor

**Changed**

- the public API of this library did not change in this version and should be safe to upgrade without changing implentor code. However, we have released this as a major version for the following reasons:
  - out of an abundance of caution due to the large amount of code changed in this release
  - we have improved parser accuracy to such a degree that some implementors using invalid globs have noted change in behavior. If this is the case for you, please check that you are using a valid glob expression before logging a bug with this library

## [1.0.1] - 2016-12-12

**Added**

- Support for windows path edge cases where backslashes are used in brackets or other unusual combinations.

## [1.0.0] - 2016-12-12

Stable release.

## [0.1.0] - 2016-10-08

First release.

[Unreleased]: https://github.com/jonschlinkert/micromatch/compare/0.1.0...HEAD
[0.2.0]: https://github.com/jonschlinkert/micromatch/compare/0.1.0...0.2.0
[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog
