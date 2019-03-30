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

### [4.0.0] - 2019-03-20

**Removed**

- Removed support for passing an array of brace patterns to `micromatch.braces()`.
- To strictly enforce closing brackets (for `{`, `[`, and `(`), you must now use `strictBrackets=true` instead of `strictErrors`.   

### [3.0.0] - 2017-04-11

TODO. There should be no breaking changes. Please report any regressions. I will [reformat these release notes](https://github.com/micromatch/micromatch/pull/76) and add them to the changelog as soon as I have a chance. 

### [1.0.1] - 2016-12-12

**Added**

- Support for windows path edge cases where backslashes are used in brackets or other unusual combinations.

### [1.0.0] - 2016-12-12

Stable release.

### [0.1.0] - 2016-10-08

First release.


[Unreleased]: https://github.com/jonschlinkert/micromatch/compare/0.1.0...HEAD
[0.2.0]: https://github.com/jonschlinkert/micromatch/compare/0.1.0...0.2.0

[keep-a-changelog]: https://github.com/olivierlacan/keep-a-changelog

