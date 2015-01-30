# micromatch [![NPM version](https://badge.fury.io/js/micromatch.svg)](http://badge.fury.io/js/micromatch)

> Glob matching for javascript/node.js. A faster alternative to minimatch (10-20x faster on avg), with all the features you're used to using in your Grunt and gulp tasks.

 - 10-20x faster than [minimatch] on average ([see benchmarks](#benchmarks))
 - Focus on core Bash 4.3 specification features that are actually used (or can be used) in node.js
 - Supports passing glob patterns as a string or array
 - Extensive unit tests

## Features

**Supports**

All the mainstream glob features you're used to using in your gulp and Grunt tasks:

 + [Brace Expansion][braces] (`foo/bar-{1..5}.md`, `one/{two,three}/four.md`)
 + Typical glob patterns (`**/*`, `a/b/*.js`, etc)
 + Logical `OR` (`foo/bar/(abc|xyz).js`)
 + Regex character classes (`foo/bar/baz-[1-5].js`)

You can combine these to create whatever matching patterns you need.


## Install with [npm](npmjs.org)

```bash
npm i micromatch --save
```


## Usage

```js
var mm = require('micromatch');

mm(['a.js', 'b.md', 'c.txt'], '*.{js,txt}');
//=> ['a.js', 'c.txt']
```

**Multiple patterns**

Multiple patterns can also be passed:

```js
mm(['a.md', 'b.js', 'c.txt', 'd.json'], ['*.md', '*.txt']);
//=> ['a.md', 'c.txt']
```

**Negation patterns:**

```js
mm(['a.js', 'b.md', 'c.txt'], '!*.{js,txt}');
//=> ['b.md']

mm(['a.md', 'b.js', 'c.txt', 'd.json'], ['*.*', '!*.{js,txt}']);
//=> ['a.md', 'd.json']
```

## Special characters

> With the exception of brace expansion (`{a,b}`, `{1..5}`, etc), most of the special characters convert directly to regex, so you can expect them to follow the same rules and produce the same results as regex.

**Square brackets**

Given `['a.js', 'b.js', 'c.js', 'd.js', 'E.js']`:

 - `[ac].js`: matches both `a` and `c`, returning `['a.js', 'c.js']`
 - `[b-d].js`: matches from `b` to `d`, returning `['b.js', 'c.js', 'd.js']`
 - `[b-d].js`: matches from `b` to `d`, returning `['b.js', 'c.js', 'd.js']`
 - `a/[A-Z].js`: matches and uppercase letter, returning `['a/E.md']`

Learn about [regex character classes][character-classes].


**Parentheses**

Given `['a.js', 'b.js', 'c.js', 'd.js', 'E.js']`:

 - `(a|c).js`: would match either `a` or `c`, returning `['a.js', 'c.js']`
 - `(b|d).js`: would match either `b` or `d`, returning `['b.js', 'd.js']`
 - `(b|[A-Z]).js`: would match either `b` or an uppercase letter, returning `['b.js', 'E.js']`

As with regex, parenthese can be nested, so patterns like `((a|b)|c)/b` will work. But it might be easier to achieve your goal using brace expansion.

**Brace Expansion**

In simple cases, brace expansion appears to work the same way as the logical `OR` operator. For example, `(a|b)` will achieve the same result as `{a,b}`.

Here are some powerful features unique to brace expansion (versus character classes):

 - range expansion: `a{1..3}b/*.js` expands to: `['a1b/*.js', 'a2b/*.js', 'a3b/*.js']`
 - nesting: `a{c,{d,e}}b/*.js` expands to: `['acb/*.js', 'adb/*.js', 'aeb/*.js']`


Learn about [brace expansion][braces], or visit [braces][braces] to ask questions and create an issue related to brace-expansion, or to see the full range of features and options related to brace expansion.

## Methods

```js
var mm = require('micromatch');
```

### .isMatch

Returns true if a file path matches the given glob pattern.

**Example**

```js
mm.isMatch('.verb.md', '*.md');
//=> false

mm.isMatch('.verb.md', '*.md', {dot: true});
//=> true
```

### .filter

Returns a function for filtering files with the given pattern.

**Example**

```js
var fn = mm.filter('*.md', {dot: true});
['a.js', 'b.txt', 'c.md', '.verb.md'].filter(fn);
//=> ['c.md', '.verb.md']
```

### .expand

Returns an object with a regex-compatible string and tokens.

```js
mm.makeRe('*.js');
// results in:
// { glob: '(?!\\.)(?=.)[^/]*?\\.js',
//   tokens:
//    { pattern: '*.js',
//      dirname: '',
//      filename: '*.js',
//      basename: '*',
//      extname: '.js',
//      isDotGlob: false },
//   options: {} }
```

### .makeRe

Create a regular expression for matching file paths based on the given pattern:

```js
mm.makeRe('*.js');
//=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
```

## Options

All options should work the same way as [minimatch].

### options.dot

Match dotfiles.

Type: `{Boolean}`

Default: `false`


### options.matchBase

Allow glob patterns without slashes to match a file path based on its basename.

Type: `{Boolean}`

Default: `false`

**Example**

```js
mm(['a/b.js', 'a/c.md'], '*.js');
//=> []

mm(['a/b.js', 'a/c.md'], '*.js', {matchBase: true});
//=> ['a/b.js']
```

### options.nobraces

Don't expand braces in glob patterns.

Type: `{Boolean}`

Default: `false`


### options.nocase

Use a case-insensitive regex for matching files.

Type: `{Boolean}`

Default: `false`


### options.nonull

If `true`, when no matches are found the actual (array-ified) glob pattern is returned instead of an empty array.

Type: `{Boolean}`

Default: `false`


### options.cache

Cache the platform (e.g. `win32`) to prevent this from being looked up for every fil.

Type: `{Boolean}`

Default: `true`


## Benchmarks

Run the [benchmarks](./benchmark):

```bash
npm run benchmark
```

As of January 30, 2015:

```bash
#1: basename-braces.js
  micromatch.js x 25,776 ops/sec ±0.68% (98 runs sampled)
  minimatch.js x 3,335 ops/sec ±1.09% (98 runs sampled)

#2: basename.js
  micromatch.js x 24,676 ops/sec ±0.56% (95 runs sampled)
  minimatch.js x 4,908 ops/sec ±0.95% (97 runs sampled)

#3: braces-no-glob.js
  micromatch.js x 473,492 ops/sec ±0.64% (96 runs sampled)
  minimatch.js x 27,705 ops/sec ±1.78% (91 runs sampled)

#4: braces.js
  micromatch.js x 42,522 ops/sec ±0.63% (97 runs sampled)
  minimatch.js x 3,995 ops/sec ±1.36% (95 runs sampled)

#5: immediate.js
  micromatch.js x 24,048 ops/sec ±0.72% (95 runs sampled)
  minimatch.js x 4,786 ops/sec ±1.40% (95 runs sampled)

#6: large.js
  micromatch.js x 773 ops/sec ±0.62% (98 runs sampled)
  minimatch.js x 27.52 ops/sec ±0.66% (49 runs sampled)

#7: long.js
  micromatch.js x 7,388 ops/sec ±0.64% (99 runs sampled)
  minimatch.js x 608 ops/sec ±0.95% (95 runs sampled)

#8: mid.js
  micromatch.js x 41,193 ops/sec ±0.74% (99 runs sampled)
  minimatch.js x 2,724 ops/sec ±1.09% (97 runs sampled)

#9: multi-patterns.js
  micromatch.js x 12,909 ops/sec ±0.71% (93 runs sampled)
  minimatch.js x 2,798 ops/sec ±1.45% (95 runs sampled)

#10: no-glob.js
  micromatch.js x 430,787 ops/sec ±0.66% (98 runs sampled)
  minimatch.js x 47,222 ops/sec ±2.19% (86 runs sampled)

#11: range.js
  micromatch.js x 474,561 ops/sec ±0.69% (97 runs sampled)
  minimatch.js x 10,819 ops/sec ±2.20% (88 runs sampled)

#12: shallow.js
  micromatch.js x 239,098 ops/sec ±0.67% (96 runs sampled)
  minimatch.js x 27,782 ops/sec ±2.12% (92 runs sampled)

#13: short.js
  micromatch.js x 707,905 ops/sec ±0.97% (97 runs sampled)
  minimatch.js x 52,171 ops/sec ±2.45% (84 runs sampled)
```

## Run tests

Install dev dependencies

```bash
npm i -d && npm test
```


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/micromatch/issues)

Please be sure to run the benchmarks before/after any code changes to judge the impact before you do a PR. thanks!

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014-2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on January 30, 2015._

[extended]: http://mywiki.wooledge.org/BashGuide/Patterns#Extended_Globs
[braces]: https://github.com/jonschlinkert/braces
[character-classes]: http://www.regular-expressions.info/charclass.html

[arr-diff]: https://github.com/jonschlinkert/arr-diff
[arr-filter]: https://github.com/jonschlinkert/arr-filter
[array-slice]: https://github.com/jonschlinkert/array-slice
[braces]: https://github.com/jonschlinkert/braces
[expand-range]: https://github.com/jonschlinkert/expand-range
[filename-regex]: https://github.com/regexps/filename-regex
[fill-range]: https://github.com/jonschlinkert/fill-range
[for-in]: https://github.com/jonschlinkert/for-in
[for-own]: https://github.com/jonschlinkert/for-own
[glob-path-regex]: https://github.com/regexps/glob-path-regex
[is-glob]: https://github.com/jonschlinkert/is-glob
[is-number]: https://github.com/jonschlinkert/is-number
[isobject]: https://github.com/jonschlinkert/isobject
[kind-of]: https://github.com/jonschlinkert/kind-of
[make-iterator]: https://github.com/jonschlinkert/make-iterator
[preserve]: https://github.com/jonschlinkert/preserve
[randomatic]: https://github.com/jonschlinkert/randomatic
[repeat-element]: https://github.com/jonschlinkert/repeat-element
[repeat-string]: https://github.com/jonschlinkert/repeat-string


<!-- deps: helper-reflinks -->