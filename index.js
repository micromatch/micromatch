/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var filenameRe = require('filename-regex');
var unixify = require('unixify');
var union = require('arr-union');
var diff = require('arr-diff');
var braces = require('braces');


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

  var doubleStar = /\*\*/.test(pattern);
  var regex = makeRe(pattern, opts);
  var len = files.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var file = files[i++];
    var fp = unixify(file);

    if (!/\//.test(fp) && doubleStar) {
      regex = baseRe(pattern, opts);
    }

    if (opts.matchBase) {
      var filename = fp.match(filenameRe())[0];
      if (regex.test(filename)) {
        res.push(fp);
      }
    } else if (regex.test(fp)) {
      res.push(fp);
    }
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
 * We only need to use the [braces] lib when
 * patterns are nested.
 *
 * @param  {String} `glob`
 * @return {String}
 */

function expand(glob, fn) {
  if (isBasicBrace(glob)) {
    return glob.replace(bracesRegex(), function(_, inner) {
      return '(' + inner.split(',').join('|') + ')';
    });
  } else {
    return braces(glob, fn).join('|');
  }
  // return braces(glob, fn).join('|');
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
  if (/\.{2}|\(/.test(str)) {
    return false;
  }

  var a = str.indexOf('{');
  str = str.slice(a + 1);
  var i = 0;

  while (a !== -1) {
    var ch = str.charAt(i++);
    if (ch === '{') {
      return false;
    }
    if (ch === '}') {
      return true;
    }
  }
  return true;
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

/**
 * Special patterns to be converted to regex
 */

var dots        = '\\.{1,2}';
var slashQ      = '[^/]%%%~';
var slashStar   = '\\.' + slashQ;
var star        = '(%~=.)\\.' + slashQ;

var dotstarbase = function(dot) {
  var re = dot ? ('(%~:^|\\/)' + dots + '(%~:$|\\/)') : '\\.';
  return '(%~!' + re + ')(%~=.)';
};

var dotstars = function (dot) {
  var re = dot ? '(%~:' + dots + ')($|\\/)': '\\.';
  return '(%~:(%~!(%~:\\/|^)' + re + ').)%%%~';
};

var stardot = function (dot) {
  return dotstarbase(dot) + slashQ;
};

/**
 * Create a regular expression for matching
 * file paths.
 *
 * @param  {String} glob
 * @param  {Object} options
 * @return {RegExp}
 */

function makeRe(glob, options) {
  var opts = options || {};

  // reset cache, recompile regex if options change
  optsCache = optsCache || opts;
  if (!equal(optsCache, opts)) {
    cache = glob;
    globRe = null;
  }

  // reset cache, recompile regex if glob changes
  cache = cache || glob;
  if (cache !== glob) {
    glob = unixify(glob);
    cache = glob;
    globRe = null;
  }

  // if `true`, then we can just return
  // the regex that was previously cached
  if (globRe instanceof RegExp) {
    return globRe;
  }

  var negate = glob.charAt(0) === '!';
  if (negate) {
    glob = glob.slice(1);
  }

  var flags = opts.flags || '';
  var i = 0;

  // expand `{1..5}` braces
  if (/\{/.test(glob) && !opts.nobraces) {
    glob = expand(glob);
  }

  glob = glob.replace(/\[/g, dotstarbase(opts.dot) + '[');
  glob = glob.replace(/^(\w):([\\\/]*)\*\*/gi, '(%~=.)$1:$2' + slashQ + slashQ);
  glob = glob.replace(/\/\*$/g, '\\/' + dotstarbase(opts.dot) + slashQ);
  glob = glob.replace(/\*\.\*/g, stardot(opts.dot) + slashStar);
  glob = glob.replace(/^\.\*/g, star);
  glob = glob.replace(/\/\.\*/g, '\\/' + star);
  glob = glob.replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + '[^/]');
  glob = glob.replace(/\?/g, '[^/]');
  glob = glob.replace(/\*\./g, stardot(opts.dot) + '\.');
  glob = glob.replace(/\//g, '\\/');
  glob = glob.replace(/\.(\w+|$)/g, '\\.$1');
  glob = glob.replace(/\*\*/g, dotstars(opts.dot));
  glob = glob.replace(/(?!\/)\*$/g, slashQ);
  glob = glob.replace(/\*/g, stardot(opts.dot));

  // clean up
  glob = glob.replace(/%~/g, '?');
  glob = glob.replace(/%%/g, '*');
  glob = glob.replace(/[\\]+\//g, '\\/');
  glob = glob.replace(/\[\^\\\/\]/g, '[^/]');

  if (opts.nocase) flags += 'i';

  // cache the regex
  globRe = new RegExp(globRegex(glob, negate), flags);
  return globRe;
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
 * Create a regular expression for matching basenames
 *
 * @param  {String} pattern
 * @param  {Object} opts
 * @return {RegExp}
 */

function baseRe(pattern, opts) {
  var re = pattern + '|' + pattern.replace(/\/?\*\*\/?/, '');
  return makeRe(re, opts);
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
 * Expose `micromatch.makeRe`
 */

module.exports.makeRe = makeRe;
