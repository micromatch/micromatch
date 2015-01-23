/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var filenameRe = require('filename-regex');
var union = require('arr-union');
var diff = require('arr-diff');
var braces = require('braces');
var win32 = process.platform === 'win32';
// var toRegex = require('./to-regex');

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
  // opts.hasGlobstar = pattern.indexOf('**') !== -1;
  // opts.hasDotfile = /(?:\/|^)\./.test(pattern);
  opts.regex = makeRe(pattern, opts);
  var len = files.length;
  var res = [];
  var i = 0;

  while (i < len) {
    var file = files[i++];
    var fp = unixify(file);

    // opts.isDotfile = fp.charCodeAt(0) === 46 || file.charCodeAt(0) === 46 || fp.indexOf('/.');
    if (!isMatch(fp, pattern, opts)) {
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

function isMatch(fp, pattern, opts) {
  // console.log(opts)
  // var hasDot = isDotfile(fp);
  // var hasDot = /(?:\/|^)\.[^\/]*$/.test(fp);

  var dot = opts.dot;
  var res = false;

  // if (!/\//.test(fp) && opts.hasGlobstar) {
  //   opts.regex = baseRegex(pattern, opts);
  // }

  // if (opts.matchBase) {
  //   var matches = filenameRe().exec(fp);
  //   if (opts.regex.test(matches[0])) {
  //     return true;
  //   }
  // }

  // console.log(opts)
  // console.log(opts.regex)
  // console.log(opts.regex.test(fp))

  // if (dot === undefined || dot === false) {
  //   if (opts.isDotfile) {
  //     return false;
  //   }
  // } else if (opts.regex.test(fp)) {
  //   return true;
  // }

  return opts.regex.test(fp);
}

function unixify(fp, normalize) {
  if (win32 || path.sep === '\\') {
    fp = fp.replace(/\\/g, '/');
  }
  return fp;
}

// function isMatch(fp, pattern) {
//   return makeRe(pattern).test(fp);
// }

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
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

// var dotstarbase = function(dot) {
//   return '(%~!(%~:^|\\/)\\.{1,2}(%~:$|\\/))(%~=.)';
// };

// var dotstars = function (dot) {
//   return '(%~:(%~!(%~:\\/|^)(%~:\\.{1,2})($|\\/)).)%%%~';
// };

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

  if (glob === '**') {
    globRe = /.*/;
    return globRe;
  }

  var negate = glob.charAt(0) === '!';
  if (negate) {
    glob = glob.slice(1);
  }

  var flags = opts.flags || '';
  var i = 0;

  // expandBraces `{1..5}` braces
  if (glob.indexOf('{') !== -1 && !opts.nobraces) {
    glob = expandBraces(glob, options);
  }

  glob = glob
    .replace(/\?:/g, '_QMARK_:')
    .replace(/\[/g, dotstarbase(opts.dot) + '[')

    // glob stars
    .replace(/^(\w):([\\\/]+?)/gi, '(%~=.)$1:$2')
    .replace(/\/\*$/g, '\\/' + dotstarbase(opts.dot) + slashQ)
    .replace(/\*\.\*/g, stardot(opts.dot) + slashStar)
    .replace(/^\.\*/g, star)
    .replace(/\/\.\*/g, '\\/' + star)
    .replace(/\*\./g, stardot(opts.dot) + '\.')
    // .replace(/\*\*/g, dotstars(opts.dot))
    .replace(/\*\*/g, '.%%')

    // consecutive `?` chars
    .replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + '[^/]')
    // .replace(/[^?]\?/g, '\\/.%%[^/]')
    .replace(/\?/g, '[^/]')
    .replace(/\//g, '\\/')

    .replace(/\.(\w+|$)/g, '\\.$1')
    .replace(/(?!\/)\*$/g, slashQ)
    .replace(/\*/g, stardot(opts.dot))

    // clean up
    .replace(/%~/g, '?')
    .replace(/%%/g, '*')
    .replace(/\?\./g, '?\\.')
    .replace(/_QMARK_:/g, '?:')
    .replace(/[\\]+\//g, '\\/')
    .replace(/~\^/g, '[')
    .replace(/\^~/g, ']')
    .replace(/\[\^\\\/\]/g, '[^/]');

  if (opts.nocase) flags += 'i';

  // cache the regex
  globRe = new RegExp(globRegex(glob, negate), flags);
  return globRe;
}

/**
 * Create a regular expression for matching
 * file paths.
 *
 * @param  {String} glob
 * @param  {Object} options
 * @return {RegExp}
 */

// function makeRe(glob, options) {
//   var opts = options || {};

//   // reset cache, recompile regex if options change
//   optsCache = optsCache || opts;
//   if (!equal(optsCache, opts)) {
//     cache = glob;
//     globRe = null;
//   }

//   // reset cache, recompile regex if glob changes
//   cache = cache || glob;
//   if (cache !== glob) {
//     glob = unixify(glob);
//     cache = glob;
//     globRe = null;
//   }

//   // if `true`, then we can just return the regex that
//   // was previously cached
//   if (globRe != null) {
//     return globRe;
//   }

//   // is the glob a negation pattern?
//   var negate = glob.charAt(0) === '!';
//   if (negate) {
//     glob = glob.slice(1);
//   }

//   glob = toRegex(glob, opts);
//   var flags = '';

//   if (opts.nocase) flags += 'i';

//   // cache the regex
//   globRe = new RegExp(globRegex(glob, negate), flags);
//   return globRe;
// }

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
 * Create a regular expression for optionally
 * matching basenames or full file paths.
 *
 * @param  {String} pattern
 * @param  {Object} opts
 * @return {RegExp}
 */

function baseRegex(pattern, opts) {
  var re = pattern + '|' + pattern
    .replace(/\/\*\*|\*\*\//g, '');
  return makeRe(re, opts);
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
 * Regex for matching single-level braces
 */

function bracesRegex() {
  return /\{(.*),(.*)\}/g;
}

/**
 * Regex for matching single-level braces
 */

function rangeRegex() {
  return /\{(.{1,2})(\.{2})(.{1,2})\}/g;
}

/**
 * Return `false` if the path contains nested braces
 * or a range (`..`). If so, then the [braces] lib
 * is used for expansion. if not, we convert the
 * braces to a regex.
 *
 * @param  {String} str
 * @return {Boolean}
 */

function isBasicBrace(str) {
  if (/\(|\{[^}]*\{/.test(str)) {
    return false;
  }
  return true;
}

/**
 * Return true if a brace contains a basic range.
 * A basic range only has two arguments.
 *
 * @param  {String} str
 * @return {Boolean}
 */

function isBasicRange(str) {
  var match = str.match(/\.\./g);
  if (!match || (match && match.length === 2)) {
    return false;
  }
  return true;
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
 * Expose `micromatch.makeRe`
 */

module.exports.makeRe = makeRe;

/**
 * Expose `micromatch.braces`
 */

module.exports.braces = braces;
