# micromatch vs. minimatch

> Can micromatch be used as a drop-in replacement for minimatch?

For mainstream features, I tried to keep as much parity as possible between micromatch and minimatch. But there are some differences.

## Key differences

- the main minimatch function, `minimatch()`, works like `micromatch.isMatch()`
- the main micromatch function, `micromatch()`, works like [multimatch](https://github.com/sindresorhus/multimatch), with support for multiple patterns.
- micromatch optimizes patterns to generate the leanest possible regex to use for matching without sacrificing accuracy. 

## Caching

Micromatch uses multiple levels of caching, each basic and specifically designed for where it's being used. Glob patterns are parsed into tokens, which are then used to generate the regex to be used for matching. Like Minimatch, these patterns, tokens and resulting regex are cached to avoid repeatedly parsing the same pattern and options. 

It's worth noting that in the past minimatch used caching as well, but using a different strategy that offered little advantage. 

## Tokenization strategy

Key points:

- **faster regex**: spend more time tokenizing the glob pattern since the time to parse and compile to regex is a fraction of the time it takes to do the actual matching against large sets. In other words, the "easy" way is to use a small set of replacement patterns for a given set of glob characters, but the end result is a huge un-optimized regex that takes much longer to do the actual matching. We want fast regex matching.
- **avoid parsing entirely**: use [is-glob] and similar checks to avoid completely parsing the pattern when it's not necessary 
- **specialized functions**: for brace expansiona and range expansion, dedication libraries were created along with extensive unit tests and granular benchmarks. In some of these benchmarks, micromatch is more than 100x faster than minimatch.


## Optimized regular expressions

Micromatch's optimizations are achieved in a number of different ways.

**Brace expansion**

It's not uncommon to do this in a gulp or Grunt task:

```js
src('*.{yml,json}');
```


## Features

| **feature** | **micromatch** | **minimatch** | **notes** |
| --- | --- | --- | --- |
| multiple patterns | yes | no | ex: `['*.js', '!foo']` |
| `#` comments in file paths | no | yes |  |
| [brace expansion] | yes | yes | ex: `*.{txt,md}` |
| regex character classes | yes | sort of | ex: `[a-c]*.js`, match file names starting with `a` through `c` |
| [extglobs] | yes | yes | ex: `+(foo|bar)` |
| POSIX [bracket expressions] | yes | no | (character classes) ex: `[[:alpha:][:lower:]]` |
| regex or string | yes | no | Micromatch will take a regex or a glob pattern to use for matching. |


### multiple pattern support

Support for matching against multiple patterns, like `['*.js', '!foo']`:

- Minimatch: **no**
- Micromatch: **yes**

Because of this, there is also a [_key difference_](#main-export-key-differences) in how the main exported function from each library is used.

**Key difference**

- `micromatch()`: the main `micromatch()` function works like [multimatch](https://github.com/sindresorhus/multimatch), and supports matching with multiple patterns (e.g. `['*.js', '!foo']`). 
- `minimatch()`: the main `minimatch()` function works like `micromatch.isMatch()`, returning true if a single path matches the given pattern.


## API

### Methods

| **method** | **micromatch** | **minimatch** | **notes** |
| --- | --- | --- | --- |
| `matchOne` | no | yes | like match, but only the first file |
| `makeRe` | yes | yes | create a regular expression from the pattern. |
| `match` | yes | yes | return an array of matches from a single pattern |
| `filter` | yes | yes | like match but returns a function that can be passed to `Array.filter` |
| `contains` | yes | no | like match, but matches any part of a path, not just the entire path |
| `expand` | yes | no | returns an [object of tokens][expand], which are passed to `.makeRe()` |
| `matcher` | yes | no | returns a function to use for matching |
| `isMatch` | yes | no | returns true if a path matches the given pattern. Works like `minimatch()` |
| `matchKeys` | yes | no | match the keys in an object |


## Options

| option | micromatch | minimatch | description |
| --- | --- | --- | --- |
| `flipNegate` | no | yes | |
| `failglob` | yes | no | throw when no matches are found (bash parity) |
| `ignore` | yes | no | string or array of patterns to ignore. like negate, but passed on options. |
| `nocase` | yes | yes | ... |
| `nonull` | yes | yes | ... |
| `nullglob` | yes | yes | ... |
| `nonegate` | yes | yes | ... |



## Other differences

**benchmarks**

micromatch is faster in every benchmark by a significant margin. One significant case that stands out is matching on arrays with thousands of items (like filepaths in a project). Here are the results from the benchmarks for matching against an array of ~7-8k items:

```js
micromatch.js x 773 ops/sec ±0.62% (98 runs sampled)
minimatch.js x 27.52 ops/sec ±0.66% (49 runs sampled)
```

**Bash 4.3**

micromatch has better Bash 4.3 coverage along with extensive, organized unit tests 

**micromatch isn't a constructor**

However, if you're using `new Minimatch()` because you need to do some kind of customization to the pre-regex pattern or whatever, then you should be able to achieve the same or similar results with micromatch.

In particular, `micromatch.expand()` parses the glob pattern and [returns an object][expand]. You can then pass that to the `.makeRe()` method to generate the regex for matching.


## Notes

_(nothing yet)_


[expand]: https://github.com/jonschlinkert/micromatch#expand
[brace expansion]: https://github.com/jonschlinkert/braces
[extglobs]: https://github.com/jonschlinkert/extglob
[bracket expressions]: https://github.com/jonschlinkert/expand-brackets
