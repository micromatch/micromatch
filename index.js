/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var unixify = require('unixify');
var union = require('arr-union');
var diff = require('arr-diff');
var braces = require('braces');


/**
 * Pass an array of files and a glob pattern as a string.
 *
 * This function is called by the main `micromatch` function
 * If you only need to pass a single pattern you might get
 * minor speed improvements using this function.
 *
 * @param  {Array} `files`
 * @param  {Array} `pattern`
 * @param  {Object} `options`
 * @return {Array}
 */

function match(files, pattern, options) {
  if (typeof files !== 'string' && !Array.isArray(files)) {
    throw new Error('micromatch.match() expects a string or array.');
  }

  files = arrayify(files);
  var regex = makeRe(pattern, options);
  var len = files.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var file = files[i++];
    var fp = unixify(file);
    // console.log(isDrive(file));
    if (regex.test(fp)) {
      res.push(fp);
    }
  }
  return res;
}

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

  files = arrayify(files);
  opts = opts || {};

  if (typeof patterns === 'string') {
    return union([], match(files, patterns, opts));
  }

  var len = patterns.length;
  var res = [];
  var i = 0;

  while (len--) {
    var glob = patterns[i++];
    var concat = union;

    if (glob.charAt(0) === '!') {
      glob = glob.slice(1);
      concat = diff;
    }

    res = concat(res, match(files, glob, opts));
  }
  return res;
}

/**
 * Expand braces in the given glob pattern.
 *
 * @param  {String} `glob`
 * @return {String}
 */

function expand(glob, fn) {
  // if (!isBasicBrace(glob)) {
  //   // avoid sending the glob to the `braces` lib if not necessary
  //   return glob.replace(bracesRegex(), function(_, inner) {
  //     return '(' + inner.split(',').join('|') + ')';
  //   });
  // } else {
  //   // if it's nested, we'll use `braces`
  //   return braces(glob, fn).join('|');
  // }
  return braces(glob, fn).join('|');
}

/**
 * Return `true` if the path contains nested
 * braces. If so, then the [braces] lib is used
 * for expansion. if not, we convert the braces
 * to a regex.
 *
 * @param  {String} str
 * @return {Boolean}
 */

function isBasicBrace(str) {
  if (/\.{2}/.test(str)) {
    return true;
  }

  var a = str.indexOf('{');
  str = str.slice(a + 1);
  var i = 0;

  while (a !== -1) {
    var ch = str.charAt(i++);
    if (ch === '{') {
      return true;
    }
    if (ch === '}') {
      return false;
    }
  }
  return false;
}

/**
 * Return true if object A is equal (enough)
 * to object B. Used for options caching.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Boolean}
 */

function equal(a, b) {
  if (!b) return false;
  for (var prop in b) {
    if (!a.hasOwnProperty(prop)) {
      return false;
    }
    if (a[prop] !== b[prop]) {
      return false;
    }
  }
  return true;
}

/**
 * Regex for matching single-level braces
 */

function bracesRegex() {
  return /\{([^{]+)\}/g;
}

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
}

function unixify(fp) {
  if (process.platform === 'win32' || path.sep === '\\') {
    return fp.replace(/^[A-Z]:\\?|[\\\/]+/gi, '/');
  }
  return fp;
}

function isDrive(fp) {
  if (fp.charAt(1) !== ':') {
    var first = fp.charCodeAt(0);
    if (first >= 65 && first <= 122) {
      return true;
    }
  }
  return false;
}

/**
 * Special patterns
 */

var a = '(?!\\.)(?=.)[^/]*?';
var d = '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))(?=.)[^/]*?';

var b = '(?:(?!(?:\\/|^)\\.).)*?';
var e = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';


var slashQ    = '[^/]%%%~';
var slashStar = '\\.' + slashQ;
var star      = '(%~=.)\\.' + slashQ;
var dotstarbase = '(%~!(%~:^|\\/)\\.{1,2}(%~:$|\\/))(%~=.)';
var dotstar   = dotstarbase + slashQ;
var stardot   = dotstar;

var stars     = '(%~:(%~!(%~:\\/|^)\\.).)%%%~';
// var dotstars  = '(%~:(%~!(%~:\\/|^)(%~:\\.{1,2})($|\\/)).)%%%~';

var dotstars = function (dot) {
  return '(%~:(%~!(%~:\\/|^)' + + ').)%%%~';
}
// var dotfile =   '(?!\\.)(?=.)[^/]%%?\\.[^/]%%?';
// var dotfile   = '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))(?=.)[^/]%%?\\.[^/]%%?';

function makeRe(glob, options, isBase) {
  if (typeof options === 'boolean') {
    isBase = options;
    options = {};
  }

  var opts = options || {};
  var flags = opts.flags || '';
  var negate = /^!/.test(glob);
  var i = 0;

  if (negate) {
    glob = glob.slice(1);
  }

  // reset cache, recompile regex if options change
  optsCache = optsCache || opts;
  if (!equal(optsCache, opts)) {
    cache = glob;
    regex = null;
  }

  // reset cache, recompile regex if glob changes
  cache = cache || glob;
  if (cache !== glob) {
    glob = unixify(glob);
    cache = glob;
    regex = null;
  }

  // if `true`, then we can just return
  // the regex that was previously cached
  if (regex instanceof RegExp) {
    return regex;
  }

  // expand `{1..5}` braces
  if (/\{/.test(glob)) {
    glob = expand(glob);
  }

  glob = glob.replace(/\[/g, dotstarbase + '[');
  glob = glob.replace(/\*\.\*/g, stardot + slashStar);
  glob = glob.replace(/^\.\*/g, star);
  glob = glob.replace(/\/\.\*/g, '\\/' + star);
  glob = glob.replace(/[^?]\?/g, '\\/'+ dotstarbase + '[^/]');
  glob = glob.replace(/(\?)/g, function(match, $1) {
    return '[^/]';
  });

  if (opts.dot) {
    glob = glob.replace(/\*\./g, stardot + '\.');
  } else {
    glob = glob.replace(/\*\./g, stardot);
  }

  glob = glob.replace(/\//g, '\\/');
  glob = glob.replace(/\.(\w+|$)/g, '\\.$1');

  if (opts.dot) {
    glob = glob.replace(/\*\*/g, dotstars);
    glob = glob.replace(/\*/g, dotstar);
  } else {
    glob = glob.replace(/\*\*/g, stars);
    glob = glob.replace(/\*/g, star);
  }

  glob = glob.replace(/%~/g, '?');
  glob = glob.replace(/%%/g, '*');
  glob = glob.replace(/\\+\//g, '\\/');
  glob = glob.replace(/\[\^\\\/\]/g, '[^/]');

  if (opts.nocase) flags += 'i';

  // cache the regex
  regex = new RegExp(globRegex(glob, negate), flags);
  return regex;
}

/**
 * Create the regex to do the matching. If
 * the leading character in the `glob` is `!`
 * a negation regex is returned.
 *
 * @param {String} `glob`
 * @param {String} `flags`
 */

function globRegex(glob, negate) {
  glob = ('(?:' + glob + ')$');
  glob = negate
    ? ('(?!' + glob + ').*$')
    : glob;
  return '^' + glob;
}

/**
 * Results cache
 */

var regex;
var cache;
var optsCache;

/**
 * Expose `micromatch`
 */

module.exports = micromatch;

/**
 * Expose `micromatch.match`
 */

module.exports.match = match;

/**
 * Expose `micromatch.makeRe`
 */

module.exports.makeRe = makeRe;
