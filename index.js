/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var filenameRe = require('filename-regex');
var diff = require('arr-diff');
var braces = require('braces');
var win32 = process.platform === 'win32';

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
    return match(files, patterns, opts);
  }

  var len = patterns.length;
  var neg = [], res = [];
  var i = 0;

  while (len--) {
    var glob = patterns[i++];
    if (glob.charCodeAt(0) === 33) {
      neg.push.apply(neg, match(files, glob.slice(1), opts));
    } else {
      res.push.apply(res, match(files, glob, opts));
    }
  }

  return diff(res, neg);
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

function match(files, pattern, options) {
  if (typeof files !== 'string' && !Array.isArray(files)) {
    throw new Error('micromatch.match() expects a string or array.');
  }

  var opts = options || {};
  files = arrayify(files);

  var negate = opts.negate || pattern.charAt(0) === '!';
  if (negate) {
    pattern = pattern.slice(1);
  }

  opts.hasGlobstar = /\*\*/.test(pattern);
  var regex = makeRe(pattern, opts);

  var len = files.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var file = files[i++];
    var fp = unixify(file, opts);

    if (!isMatch(fp, regex, opts)) {
      continue;
    }
    res.push(fp);
  }

  if (negate) {
    return diff(files, res);
  }

  if (opts.nonull && !res.length) {
    return pattern;
  }
  return res;
}

/**
 * Returns true if the filepath matches the given
 * pattern.
 */

function isMatch(fp, pattern, opts) {
  if (!(pattern instanceof RegExp)) {
    return makeRe(pattern).test(fp);
  }

  if (opts.matchBase) {
    var matches = filenameRe().exec(fp);
    if (pattern.test(matches[0])) {
      return true;
    }
  }

  return pattern.test(fp);
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
  var re = !(pattern instanceof RegExp)
    ? makeRe(pattern, opts)
    : pattern;

  return function (files) {
    if (typeof files === 'string') {
      return isMatch(files, pattern, opts);
    }

    var res = files.slice();
    var len = files.length;

    while (len--) {
      if (!isMatch(files[len], pattern, opts)) {
        res.splice(len, 1);
      }
    }
    return res;
  };
}

/**
 * Filter files with the given pattern.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

function expand(pattern, opts) {
  var res = files.slice();
  var len = files.length;

  while (len--) {
    if (!isMatch(files[len], pattern, opts)) {
      res.splice(len, 1);
    }
  }
  return res;
}

/**
 * Convert a file path to a unix path.
 */

function unixify(fp, opts) {
  if (opts && opts.normalize || win32 || path.sep === '\\') {
    return fp.replace(/[\\\/]+/g, '/');
  }
  return fp;
}

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
 */

function esc(str) {
  return str
    .replace(/\?/g, '%~')
    .replace(/\*/g, '%%');
}

var dot         = '\\.';
var box         = '[^/]';
var dots        = dot + '{1,2}';
var slashQ      = esc(box + '*?');
var lookahead   = esc('(?=.)');
var start       = '(?:^|\\/)';
var end         = '(?:\\/|$)';


function unesc(str) {
  return str.replace(/%~/g, '?')
    .replace(/%%/g, '*');
}

function dotstarbase(dotfile) {
  var re = dotfile ? (start + '(?:' + dots + ')' + end) : dot;
  return esc('(?!' + re + ')' + lookahead);
}

function doublestar() {
  return '(?:(?!' + start + dot + ').)*?';
}

function stardot(dotfile) {
  return dotstarbase(dotfile) + slashQ;
}

/**
 * Create a regular expression for matching
 * file paths.
 *
 * @param  {String} glob
 * @param  {Object} options
 * @return {RegExp}
 */

function makeGlob(glob, options) {
  var opts = options || {};

  // reset cache, recompile regex if options change
  optsCache = typeof optsCache !== 'undefined'
    ? optsCache
    : opts;

  if (!equal(optsCache, opts)) {
    cache = glob;
    globRe = null;
  }

  // reset cache, recompile regex if glob changes
  cache = typeof cache !== 'undefined'
    ? cache
    : glob;

  if (cache !== glob) {
    glob = unixify(glob, opts);
    cache = glob;
    globRe = null;
  }

  // if `true`, then we can just return
  // the regex that was previously cached
  if (globRe instanceof RegExp) {
    return globRe;
  }

  function replace(re, str) {
    glob = glob.replace(re, str);
  }

  function unescape() {
    glob = unesc(glob);
  }

  var negate = glob.charCodeAt(0) === 33; /* '!' */
  if (negate) {
    glob = glob.slice(1);
  }

  var parens = glob.indexOf('(');
  var square = glob.indexOf('[');

  if (parens !== -1) {
    glob = extglob(glob, opts);
  }

  // see if there is at least one star
  var twoStars = glob.indexOf('**');
  var flags = opts.flags || '';

  if (twoStars === 0 && glob.length === 2 && !opts.dot) {
    glob = doublestar();
  } else {

    var oneStar = glob.indexOf('*');

    // expandBraces `{1..5}` braces
    if (glob.indexOf('{') !== -1 && !opts.nobraces) {
      glob = expandBraces(glob, options);
    }

    // escaped stars
    replace(/\\\*/g, esc('\\*'));

    // windows drives
    replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2');
    replace(/\[/g, dotstarbase(opts.dot) + '[');

    // glob stars
    if (twoStars !== -1) {
      replace(/\*\*\//g, esc('.*\\/?'));
      replace(/\*\*/g, esc('.*'));
    }

    // question marks
    replace(/\?\./g, esc('?\\.'));
    replace(/\?:/g, esc('?:'));

    // consecutive `?` chars
    replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + box)
    // .replace(/[^?]\?/g, '\\/.%%' + box)
    // replace(/\?/g, box)
    replace(/\?/g, '.');

    replace(/\//g, '\\/');

    if (oneStar !== -1) {
      // last chars are '/*'
      replace(/\/\*$/g, '\\/' + stardot(opts.dot));
      // last char is '*', no slashes
      replace(/(?!\/)\*$/g, slashQ);
      //=> '^.*'
      replace(/\*/g, stardot(opts.dot));
    }

    replace(/\.(\w+|$)/g, '\\.$1');
    replace(/\[\^\\\/\]/g, box);
    replace(/[\\]+\//g, '\\/');
    unescape();
  }

  if (opts.nocase) flags += 'i';

  // cache regex
  globRe = new RegExp(globRegex(glob, negate), flags);
  // console.log(globRe)
  return globRe;
}

function makeRe(glob, options) {
  return makeGlob(glob, options);
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
    ? ('(?!^' + glob + ').*$')
    : glob;
  return '^' + glob;
}


/**
 * Match exglob patterns:
 *  - `?(...)` match zero or one of the given patterns.
 *  - `*(...)` match zero or more of the given patterns.
 *  - `+(...)` match one or more of the given patterns.
 *  - `@(...)` match one of the given patterns.
 *  - `!(...)` match anything except one of the given patterns.
 */

/**
 * Create the regex to do the matching. If
 * the leading character in the `glob` is `!`
 * a negation regex is returned.
 *
 * @param {String} `glob`
 * @param {String} `flags`
 */

function extglob(glob, opts) {
  return glob.replace(/(\.)?([?*+@!])(\(([^)]*)\))/, function (match, $1, $2, $3, $4) {
    if (!$2 || !$3 || !$4 || $4.indexOf('{') !== -1) {
      return match;
    }
    var res;

    if ($2 === '?') {
      res = '(?:' + $4 + ')?';
    }

    if ($2 === '*' || $2 === '+') {
      res = ($1 ? esc('\\.(?:') : esc('(?:')) + $4 + ')';
    }

    if ($2 === '!') {
    console.log(arguments)
      res = ($1 ? esc('\\.(?:(?!') : esc('((?!')) + $4 + esc(').*?)');
    }

    return res || match;
  });
}

/**
 * Expand braces in the given glob pattern.
 *
 * We only need to use the [braces] lib when
 * patterns are nested.
 *
 * @param  {String} `glob`
 * @return {String}
 */

function expandBraces(glob, options) {
  options = options || {};
  options.makeRe = options.makeRe || true;
  var a = glob.match(/[\{\(\[]/g);
  var b = glob.match(/[\}\)\]]/g);
  if (a && b && (a.length !== b.length)) {
    options.makeRe = false;
  }
  return braces(glob, options).join('|');
}

/**
 * Return true if object A is equal (enough)
 * to object B. Used for options caching. All
 * we need to know is if the object has changed
 * in any way.
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

/**
 * Results cache
 */

var globRe;
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
 * Expose `micromatch.isMatch`
 */

module.exports.isMatch = isMatch;

/**
 * Expose `micromatch.makeRe`
 */

module.exports.makeRe = makeRe;

/**
 * Expose `micromatch.braces`
 */

module.exports.braces = braces;

/**
 * Expose `micromatch.filter`
 */

module.exports.filter = filter;
