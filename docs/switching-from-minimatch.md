# Switching from minimatch

> Use `mm.isMatch()` instead of `minimatch()`

**Minimatch**

The main `minimatch()` function returns true/false for a single file path and pattern:

```js
var minimatch = require('minimatch');
minimatch('foo.js', '*.js');
//=> 'true'
```

**Micromatch**

With micromatch, `.isMatch()` to get the same result:

```js
var mm = require('micromatch');
mm.isMatch('foo.js', '*.js');
//=> 'true'
```

This implementation difference is necessary since the main `micromatch()` method supports matching on multiple globs, with behavior similar to [multimatch][].

[multimatch]: https://github.com/sindresorhus/multimatch
[minimatch]: https://github.com/isaacs/minimatch
