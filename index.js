/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var diff = require('arr-diff');
var typeOf = require('kind-of');
var cache = require('regex-cache');
var isGlob = require('is-glob');
var expand = require('./lib/expand');
var utils = require('./lib/utils');

/**
 * The main function. Pass an array of filepaths,
 * and a string or array of glob patterns
 *
 * @param  {Array|String} `files`
 * @param  {Array|String} `patterns`
 * @param  {Object} `opts`
 * @return {Array} Array of matches
 */

function micromatch(files, patterns, opts) {
  if (!files || !patterns) {
    return [];
  }

  files = utils.arrayify(files);
  opts = opts || {};

  if (typeof opts.cache === 'undefined') {
    opts.cache = true;
  }

  if (typeof patterns === 'string') {
    return match(files, patterns, opts);
  }

  var len = patterns.length;
  var omit = [], keep = [];
  var i = 0;

  while (len--) {
    var glob = patterns[i++];
    if (glob.charCodeAt(0) === 33 /* ! */) {
      omit.push.apply(omit, match(files, glob.slice(1), opts));
    } else {
      keep.push.apply(keep, match(files, glob, opts));
    }
  }

  return diff(keep, omit);
}

/**
 * Pass an array of files and a glob pattern as a string.
 *
 * This function is called by the main `micromatch` function
 * If you only need to pass a single pattern you might get
 * very minor speed improvements using this function.
 *
 * @param  {Array} `files`
 * @param  {Array} `pattern`
 * @param  {Object} `options`
 * @return {Array}
 */

function match(files, pattern, opts) {
  if (typeof files !== 'string' && !Array.isArray(files)) {
    throw new Error('micromatch.match() expects a string or array.');
  }

  files = utils.arrayify(files);
  opts = opts || {};

  var negate = opts.negate || false;
  var orig = pattern;

  if (typeof pattern === 'string' && opts.nonegate !== true) {
    negate = pattern.charAt(0) === '!';
    if (negate) {
      pattern = pattern.slice(1);
    }
  }

  var isMatch = matcher(pattern, opts);
  var len = files.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var file = files[i++];
    var fp = utils.unixify(file, opts);

    if (!isMatch(fp)) { continue; }
    res.push(fp);
  }

  if (res.length === 0) {
    if (opts.failglob === true) {
      throw new Error('micromatch found no matches for: "' + orig + '".');
    }

    if (opts.nonull || opts.nullglob) {
      res.push(utils.unescapeGlob(orig));
    }
  }

  // if `negate` was diffined, diff negated files
  if (negate) { res = diff(files, res); }

  // if `ignore` was defined, diff ignored filed
  if (opts.ignore && opts.ignore.length) {
    pattern = opts.ignore;
    delete opts.ignore;
    return diff(res, micromatch(res, pattern, opts));
  }
  return res;
}

/**
 * Return a function for matching based on the
 * given `pattern` and `options`.
 *
 * @param  {String} `pattern`
 * @param  {Object} `options`
 * @return {Function}
 */

function matcher(pattern, opts) {
  // pattern is a function
  if (typeof pattern === 'function') {
    return pattern;
  }
  // pattern is a string
  if (!(pattern instanceof RegExp)) {
    if (!isGlob(pattern)) {
      return utils.matchPath(pattern, opts);
    }
    var re = makeRe(pattern, opts);
    if (opts && opts.matchBase) {
      return utils.hasFilename(re, opts);
    }
    return function (fp) {
      return re.test(fp);
    };
  }
  // pattern is already a regex
  return function (fp) {
    return pattern.test(fp);
  };
}

/**
 * Returns true if the filepath contains the given
 * pattern. Can also return a function for matching.
 *
 * ```js
 * isMatch('foo.md', '*.md', {});
 * //=> true
 *
 * isMatch('*.md', {})('foo.md')
 * //=> true
 * ```
 *
 * @param  {String} `fp`
 * @param  {String} `pattern`
 * @param  {Object} `opts`
 * @return {Boolean}
 */

function isMatch(fp, pattern, opts) {
  if (typeOf(pattern) === 'object') {
    return matcher(fp, pattern);
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Returns true if the filepath matches the
 * given pattern.
 */

function contains(fp, pattern, opts) {
  opts = opts || {};
  opts.contains = (pattern !== '');
  if (opts.contains && !isGlob(pattern)) {
    return fp.indexOf(pattern) !== -1;
  }
  return matcher(pattern, opts)(fp);
}

/**
 * Filter the keys in an object.
 *
 * @param  {*} val
 * @return {Array}
 */

function matchKeys(pattern, obj, options) {
  var re = !(pattern instanceof RegExp)
    ? makeRe(pattern, options)
    : pattern;

  var res = {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (re.test(key)) {
        res[key] = obj[key];
      }
    }
  }
  return res;
}

/**
 * Filter files with the given pattern.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

function filter(pattern, opts) {
  opts = opts || {};

  pattern = !(pattern instanceof RegExp)
    ? makeRe(pattern, opts)
    : pattern;

  return function (files) {
    if (typeof files === 'string') {
      return isMatch(files, pattern, opts);
    }

    var res = files.slice();
    var len = files.length;

    while (len--) {
      var match = isMatch(files[len], pattern, opts);
      if (match) {
        continue;
      }
      res.splice(len, 1);
    }
    return res;
  };
}

/**
 * Create and cache a regular expression for matching
 * file paths.
 *
 * If the leading character in the `glob` is `!` a negation
 * regex is returned.
 *
 * @param  {String} glob
 * @param  {Object} options
 * @return {RegExp}
 */

function toRegex(glob, options) {
  // clone options to prevent mutating upstream variables
  var opts = Object.create(options || {});

  var flags = opts.flags || '';
  if (opts.nocase && !/i/.test(flags)) {
    flags += 'i';
  }

  // pass in tokens to avoid parsing more than once
  var parsed = expand(glob, opts);
  opts.negated = opts.negated || parsed.negated;
  opts.negate = opts.negated;
  glob = wrapGlob(parsed.pattern, opts);

  try {
    return new RegExp(glob, flags);
  } catch (err) {}
  return /^$/;
}

/**
 * Wrap `toRegex` to memoize the generated regex
 * the string and options don't change
 */

function makeRe(glob, opts) {
  return cache(toRegex, glob, opts);
}

/**
 * Create the regex to do the matching. If
 * the leading character in the `glob` is `!`
 * a negation regex is returned.
 *
 * @param {String} `glob`
 * @param {Boolean} `negate`
 */

function wrapGlob(glob, opts) {
  var prefix = (opts && !opts.contains) ? '^' : '';
  var after = (opts && !opts.contains) ? '$' : '';
  glob = ('(?:' + glob + ')' + after);
  if (opts && opts.negate) {
    return prefix + ('(?!^' + glob + ').*$');
  }
  return prefix + glob;
}

/**
 * Public methods
 */

micromatch.braces    = micromatch.braceExpand = require('braces');
micromatch.expand    = expand;
micromatch.filter    = filter;
micromatch.isMatch   = isMatch;
micromatch.contains  = contains;
micromatch.makeRe    = makeRe;
micromatch.match     = match;
micromatch.matchKeys = matchKeys;

/**
 * Expose `micromatch`
 */

module.exports = micromatch;
