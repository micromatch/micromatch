'use strict';

/**
 * Module dependencies
 */

var braces = require('braces');
var toRegex = require('to-regex');
var debug = require('debug')('micromatch');
var extend = require('extend-shallow');

/**
 * Local dependencies
 */

var Micromatch = require('./lib/micromatch');
var compilers = require('./lib/compilers');
var parsers = require('./lib/parsers');
var cache = require('./lib/cache');
var utils = require('./lib/utils');
var MAX_LENGTH = 1024 * 64;

/**
 * The main function takes a list of strings and one or more
 * glob patterns to use for matching.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {Array} `list`
 * @param {String|Array} `patterns` Glob patterns
 * @param {Object} `options`
 * @return {Array} Returns an array of matches
 * @api public
 */

function micromatch(list, patterns, options) {
  debug('micromatch <%s>', patterns);

  patterns = utils.arrayify(patterns);
  list = utils.arrayify(list);
  var len = patterns.length;

  if (list.length === 0 || len === 0) {
    return [];
  }

  if (len === 1) {
    return micromatch.match(list, patterns[0], options);
  }

  var negated = false;
  var omit = [];
  var keep = [];
  var idx = -1;

  while (++idx < len) {
    var pattern = patterns[idx];

    if (typeof pattern === 'string' && pattern.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, micromatch.match(list, pattern.slice(1), options));
      negated = true;
    } else {
      keep.push.apply(keep, micromatch.match(list, pattern, options));
    }
  }

  // minimatch.match parity
  if (negated && keep.length === 0) {
    keep = list.map(utils.unixify(options));
  }

  var matches = utils.diff(keep, omit);
  if (!options || options.nodupes !== false) {
    return utils.unique(matches);
  }

  return matches;
}

/**
 * Cache
 */

micromatch.cache = cache;
micromatch.clearCache = function() {
  micromatch.cache.__data__ = {};
};

/**
 * Similar to the main function, but `pattern` must be a string.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.match(['a.a', 'a.aa', 'a.b', 'a.c'], '*.a'));
 * //=> ['a.a', 'a.aa']
 * ```
 * @param {Array} `list` Array of strings to match
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of matches
 * @api public
 */

micromatch.match = function(list, pattern, options) {
  var unixify = utils.unixify(options);
  var isMatch = micromatch.matcher(pattern, options);

  list = utils.arrayify(list);
  var len = list.length;
  var idx = -1;
  var matches = [];

  while (++idx < len) {
    var ele = list[idx];

    if (ele === pattern) {
      matches.push(unixify(ele));
      continue;
    }

    var unix = unixify(ele);
    if (unix === pattern || isMatch(unix)) {
      matches.push(unix);
    }
  }

  // if no options were passed, uniquify results and return
  if (typeof options === 'undefined') {
    return utils.unique(matches);
  }

  if (matches.length === 0) {
    if (options.failglob === true) {
      throw new Error('no matches found for "' + pattern + '"');
    }
    if (options.nonull === true || options.nullglob === true) {
      return [options.unescape ? utils.unescape(pattern) : pattern];
    }
  }

  // if `opts.ignore` was defined, diff ignored list
  if (options.ignore) {
    matches = micromatch.not(matches, options.ignore, options);
  }

  return options.nodupes !== false ? utils.unique(matches) : matches;
};

/**
 * Returns true if the specified `string` matches the given glob `pattern`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.isMatch('a.a', '*.a'));
 * //=> true
 * console.log(micromatch.isMatch('a.b', '*.a'));
 * //=> false
 * ```
 * @param {String} `string` String to match
 * @param {String} `pattern` Glob pattern
 * @param {String} `options`
 * @return {Boolean} Returns true if the string matches the glob pattern.
 * @api public
 */

micromatch.isMatch = function(str, pattern, options) {
  if (pattern === str) {
    return true;
  }

  if (utils.isSimpleChar(pattern) || utils.isSlash(pattern)) {
    return str === pattern;
  }

  return micromatch.matcher(pattern, options)(str);
};

/**
 * Returns a list of strings that do _not_ match any of the given `patterns`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String} `pattern` One or more glob patterns.
 * @param {Object} `options`
 * @return {Array} Returns an array of strings that do not match the given patterns.
 * @api public
 */

micromatch.not = function(list, patterns, options) {
  var opts = extend({}, options);
  var ignore = opts.ignore;
  delete opts.ignore;

  var unixify = utils.unixify(opts);
  var unixified = list.map(function(fp) {
    return unixify(fp, opts);
  });

  var matches = utils.diff(unixified, micromatch(unixified, patterns, opts));
  if (ignore) {
    matches = utils.diff(matches, micromatch(unixified, ignore));
  }

  return opts.nodupes !== false ? utils.unique(matches) : matches;
};

/**
 * Returns true if the given `string` matches any of the given glob `patterns`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.any('a.a', ['b.*', '*.a']));
 * //=> true
 * console.log(micromatch.any('a.a', 'b.*'));
 * //=> false
 * ```
 * @param  {String} `str` The string to test.
 * @param  {String|Array} `patterns` Glob patterns to use.
 * @param  {Object} `options` Options to pass to the `matcher()` function.
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

micromatch.any = function(str, patterns, options) {
  var unixify = utils.unixify(options);
  str = unixify(str);

  patterns = utils.arrayify(patterns);
  for (var i = 0; i < patterns.length; i++) {
    if (micromatch.isMatch(str, patterns[i], options)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns true if the given `string` contains the given pattern. Similar to `.isMatch` but
 * the pattern can match any part of the string.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(micromatch.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String} `pattern` Glob pattern to use for matching.
 * @param {Object} `options`
 * @return {Boolean} Returns true if the patter matches any part of `str`.
 * @api public
 */

micromatch.contains = function(str, pattern, options) {
  if (pattern === str) {
    return true;
  }

  if (utils.isSimpleChar(pattern)) {
    return str === pattern;
  }

  var opts = extend({}, options, {contains: true});
  opts.strictClose = false;
  opts.strictOpen = false;

  return micromatch(str, pattern, opts).length > 0;
};

/**
 * Returns true if the given pattern and options should enable
 * the `matchBase` option.
 * @return {Boolean}
 */

micromatch.matchBase = function(pattern, options) {
  if (pattern && pattern.indexOf('/') !== -1 || !options) return false;
  return options.basename === true || options.matchBase === true;
};

/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * var micromatch = require('micromatch');
 * var obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(micromatch.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param  {Object} `object`
 * @param  {Array|String} `patterns` One or more glob patterns.
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */

micromatch.matchKeys = function(obj, patterns, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError('expected the first argument to be an object');
  }
  var keys = micromatch(Object.keys(obj), patterns, options);
  return utils.pick(obj, keys);
};

/**
 * Creates a matcher function from the given glob `pattern` and `options`. The returned
 * function takes a string to match as its only argument.
 *
 * ```js
 * var micromatch = require('micromatch');
 * var isMatch = micromatch.matcher('*.!(*a)');
 *
 * console.log(isMatch('a.a'));
 * //=> false
 * console.log(isMatch('a.b'));
 * //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {String} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */

micromatch.matcher = function(pattern, options) {
  function matcher() {
    var unixify = utils.unixify(options);

    // if pattern is a regex
    if (pattern instanceof RegExp) {
      return function(str) {
        return pattern.test(str) || pattern.test(unixify(str));
      };
    }

    // if pattern is invalid
    if (!utils.isString(pattern)) {
      throw new TypeError('expected pattern to be a string or regex');
    }

    // if pattern is a non-glob string
    if (!utils.hasSpecialChars(pattern)) {
      if (options && options.nocase === true) {
        pattern = pattern.toLowerCase();
      }
      return utils.matchPath(pattern, options);
    }

    // if pattern is a glob string
    var re = micromatch.makeRe(pattern, options);

    // if `options.matchBase` or `options.basename` is defined
    if (micromatch.matchBase(pattern, options)) {
      return utils.matchBasename(re, options);
    }

    // everything else...
    return function(str) {
      return re.test(str) || re.test(unixify(str));
    };
  }

  return memoize('matcher', pattern, options, matcher);
};

/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` The pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

micromatch.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) {
    return pattern;
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('expected pattern to be a string');
  }

  if (pattern.length > MAX_LENGTH) {
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');
  }

  function makeRe() {
    var opts = extend({strictErrors: false}, options);
    if (opts.strictErrors === true) opts.strict = true;

    var patterns = micromatch.create(pattern, opts).map(function(obj) {
      return obj.output;
    });
    return toRegex(patterns.join('|'), opts);
  }

  var regex = memoize('makeRe', pattern, options, makeRe);
  if (regex.source.length > MAX_LENGTH) {
    throw new SyntaxError('potentially malicious regex detected');
  }

  return regex;
};

/**
 * Expand the given brace `pattern`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.braces('foo/{a,b}/bar'));
 * //=> ['foo/(a|b)/bar']
 *
 * console.log(micromatch.braces('foo/{a,b}/bar', {expand: true}));
 * //=> ['foo/(a|b)/bar']
 * ```
 * @param {String} pattern
 * @param {Object} options
 * @return {Array}
 * @api public
 */

micromatch.braces = function(pattern, options) {
  return memoize('braces', pattern, options, function() {
    if (options && options.nobrace === true) {
      return [pattern];
    }
    if (!/\{.*\}/.test(pattern)) {
      return [pattern];
    }
    return braces(pattern, options);
  });
};

/**
 * Parses the given glob `pattern` and returns an object with the compiled `output`
 * and optional source `map`.
 *
 * ```js
 * var micromatch = require('micromatch');
 * console.log(micromatch.create('abc/*.js'));
 * // { options: { source: 'string', sourcemap: true },
 * //   state: {},
 * //   compilers:
 * //    { ... },
 * //   output: '(\\.[\\\\\\/])?abc\\/(?!\\.)(?=.)[^\\/]*?\\.js',
 * //   ast:
 * //    { type: 'root',
 * //      errors: [],
 * //      nodes:
 * //       [ ... ],
 * //      dot: false,
 * //      input: 'abc/*.js' },
 * //   parsingErrors: [],
 * //   map:
 * //    { version: 3,
 * //      sources: [ 'string' ],
 * //      names: [],
 * //      mappings: 'AAAA,GAAG,EAAC,kBAAC,EAAC,EAAE',
 * //      sourcesContent: [ 'abc/*.js' ] },
 * //   position: { line: 1, column: 28 },
 * //   content: {},
 * //   files: {},
 * //   idx: 6 }
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Object} Returns an object with the parsed AST, compiled string and optional source map.
 * @api public
 */

micromatch.create = function(pattern, options) {
  return memoize('create', pattern, options, function() {
    function compile(str, opts) {
      var mm = new Micromatch(opts);
      var ast = mm.parse(str, opts);
      return mm.compile(ast, opts);
    }

    if (pattern.slice(0, 2) === './') {
      pattern = pattern.slice(2);
    }

    pattern = utils.combineDuplicates(pattern, '\\*\\*\\/|\\/\\*\\*');
    pattern = micromatch.braces(pattern, options);

    if (Array.isArray(pattern)) {
      var len = pattern.length;
      var idx = -1;
      var res = [];

      while (++idx < len) {
        res.push(compile(pattern[idx], options));
      }
      return res;
    }

    return compile(pattern, options);
  });
};

/**
 * Memoize a generated regex or function
 */

function memoize(type, pattern, options, fn) {
  var key = utils.createKey(type + pattern, options);

  if (cache.has(type, key)) {
    return cache.get(type, key);
  }

  var val = fn(pattern, options);
  if (options && options.cache === false) {
    return val;
  }

  cache.set(type, key, val);
  return val;
}

/**
 * Expose parser, compiler and constructor on `micromatch`
 */

micromatch.compilers = compilers;
micromatch.parsers = parsers;

/**
 * Expose `micromatch`
 * @type {Function}
 */

module.exports = micromatch;
