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
 + Globstar matching (`**/*`, `a/b/*.js`, etc)
 + Logical `OR` (`foo/bar/(abc|xyz).js`)
 + Regex character classes (`foo/bar/baz-[1-5].js`)

You can combine these features to achieve whatever matching patterns you need.

**Does not support**

 + [Extended glob matching][extended]. This might be supported in the future, either in core or as an extension, but it's hard to justify the cost in terms of speed and complexity for features that are rarely used.


## Install with [npm](npmjs.org)

```bash
npm i micromatch --save
```


## Usage

Works exactly the same as [minimatch].

```js
var micromatch = require('micromatch');

micromatch(['a.js', 'b.md', 'c.txt'], '*.{js,txt}');
//=> ['a.js', 'c.txt']
```

**Negation patterns:**

```js
micromatch(['a.js', 'b.md', 'c.txt'], '!*.{js,txt}');
//=> ['b.md']

micromatch(['a.md', 'b.js', 'c.txt', 'd.json'], ['*.*', '!*.{js,txt}']);
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


## .matchRe

Generate a regular expression for matching file paths based on the given pattern:

```js
micromatch.makeRe('a/?/c.md');
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
micromatch(['a/b.js', 'a/c.md'], '*.js');
//=> []

micromatch(['a/b.js', 'a/c.md'], '*.js', {matchBase: true});
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


## Benchmarks

Run the benchmarks

```bash
node benchmark/
```

![image](https://cloud.githubusercontent.com/assets/383994/5535193/1c28a4a2-8a45-11e4-813a-0236586aa990.png)


## Run tests

Install dev dependencies

```bash
npm i -d && mocha
```


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/micromatch/issues)

Please be sure to run the benchmarks before/after any code changes to judge the impact before you do a PR. thanks!

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on December 28, 2014._

[extended]: http://mywiki.wooledge.org/BashGuide/Patterns#Extended_Globs
[braces]: https://github.com/jonschlinkert/braces
[character-classes]: http://www.regular-expressions.info/charclass.html