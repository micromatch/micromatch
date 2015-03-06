# Comparison: micromatch vs. minimatch

> This document is based on the readme from [minimatch], with additions to show how the two libraries, minimatch and micromatch, compare to one another.

**Matching with RegExp**

Both libraries work by converting glob expressions into JavaScript `RegExp` objects. However, there are key differences in approach.

**Parse > Tokenize > Convert to regex**

For the most part, both libraries follow this formula. 

- glob pattern is parsed into tokens
- if applicable, pattern is expanded to multiple patterns, as with brace patterns (`/{a,b}/*.js`)


**Major implementation differences**

Micromatch's huge speed advantage comes from a few different areas:

- basic caching
- tokenization strategy
- regex optimizations
- single responsibility functions


**Example compiled regex**

```js
micro.makeRe('*.{yml,json}');
//=> /^(?:(?!\.)(?=.)[^/]*?\.(yml|json))$/

mini.makeRe('*.{yml,json}');
//=> /^(?:(?!\.)(?=.)[^/]*?\.yml|(?!\.)(?=.)[^/]*?\.json)$/ 
```


## Usage

```js
var minimatch = require("minimatch");
var micromatch = require('micromatch');
```

**Minimatch**

Match the path on the left against the pattern on the right:

```js
minimatch("foo.js", "*.js"); // true!
```

**Micromatch**

The micromatch equivalent is `micromatch.isMatch()`


```js
minimatch.isMatch('foo.js', '*.js'); // true!
```


## Features

Both libraries support these glob features:

* Brace Expansion
* Extended glob matching
* "Globstar" `**` matching


## Constructor

**Minimatch Class**

Create a minimatch object by instanting the `minimatch.Minimatch` class.

```js
var Minimatch = require("minimatch").Minimatch;
var mm = new Minimatch(pattern, options);
```

**Micromatch**

No support. If you need access to tokens as they are generated (to avoid parsing the glob more than once), you can use `micromatch.expand()`.


## Functions

### minimatch(path, pattern, options)

Main export.  Tests a path against the pattern using the options.

```js
var isJS = minimatch(file, "*.js", { matchBase: true })
```

### minimatch.filter(pattern, options)

Returns a function that tests its
supplied argument, suitable for use with `Array.filter`.  Example:

```js
var javascripts = fileList.filter(minimatch.filter("*.js", {matchBase: true}))
```

### minimatch.match(list, pattern, options)

Match against the list of
files, in the style of fnmatch or glob.  If nothing is matched, and
options.nonull is set, then return a list containing the pattern itself.

```js
var javascripts = minimatch.match(fileList, "*.js", {matchBase: true}))
```

### minimatch.makeRe(pattern, options)

Make a regular expression object from the pattern.

## Options

All options are `false` by default.

### debug

Dump a ton of stuff to stderr.

### nobrace

Do not expand `{a,b}` and `{1..3}` brace sets.

### noglobstar

Disable `**` matching against multiple folder names.

### dot

Allow patterns to match filenames starting with a period, even if
the pattern does not explicitly have a period in that spot.

Note that by default, `a/**/b` will **not** match `a/.d/b`, unless `dot`
is set.

### noext

Disable "extglob" style patterns like `+(a|b)`.

### nocase

Perform a case-insensitive match.

### nonull

When a match is not found by `minimatch.match`, return a list containing
the pattern itself if this option is set.  When not set, an empty list
is returned if there are no matches.

### matchBase

If set, then patterns without slashes will be matched
against the basename of the path if it contains slashes.  For example,
`a?b` would match the path `/xyz/123/acb`, but not `/xyz/acb/123`.

### nocomment

Suppress the behavior of treating `#` at the start of a pattern as a
comment.

### nonegate

Suppress the behavior of treating a leading `!` character as negation.

### flipNegate

Returns from negate expressions the same as if they were not negated.
(Ie, true on a hit, false on a miss.)


## Comparisons to other fnmatch/glob implementations

While strict compliance with the existing standards is a worthwhile
goal, some discrepancies exist between minimatch and other
implementations, and are intentional.

If the pattern starts with a `!` character, then it is negated.  Set the
`nonegate` flag to suppress this behavior, and treat leading `!`
characters normally.  This is perhaps relevant if you wish to start the
pattern with a negative extglob pattern like `!(a|B)`.  Multiple `!`
characters at the start of a pattern will negate the pattern multiple
times.

If a pattern starts with `#`, then it is treated as a comment, and
will not match anything.  Use `\#` to match a literal `#` at the
start of a line, or set the `nocomment` flag to suppress this behavior.

The double-star character `**` is supported by default, unless the
`noglobstar` flag is set.  This is supported in the manner of bsdglob
and bash 4.1, where `**` only has special significance if it is the only
thing in a path part.  That is, `a/**/b` will match `a/x/y/b`, but
`a/**b` will not.

If an escaped pattern has no matches, and the `nonull` flag is set,
then minimatch.match returns the pattern as-provided, rather than
interpreting the character escapes.  For example,
`minimatch.match([], "\\*a\\?")` will return `"\\*a\\?"` rather than
`"*a?"`.  This is akin to setting the `nullglob` option in bash, except
that it does not resolve escaped pattern characters.

If brace expansion is not disabled, then it is performed before any
other interpretation of the glob pattern.  Thus, a pattern like
`+(a|{b),c)}`, which would not be valid in bash or zsh, is expanded
**first** into the set of `+(a|b)` and `+(a|c)`, and those patterns are
checked for validity.  Since those two are valid, matching proceeds.
