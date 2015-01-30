/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var isGlob = require('is-glob');
var braces = require('braces');
var parse = require('./parse');
var utils = require('./utils');
var chars = require('./chars');

/**
 * Expose `expand`
 */

module.exports = expand;

/**
 * Expand a glob pattern to resolve braces and
 * similar patterns before converting to regex.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

function expand(glob, opts) {
  opts = opts || {};

  function replace(re, str) {
    glob = glob.replace(re, esc(str));
  }

  if (opts.nonegate !== true) {
    var negate = glob.charCodeAt(0) === 33; /* '!' */
    if (negate) {
      opts.negated = true;
      glob = glob.slice(1);
    }
  }

  // expand braces, e.g `{1..5}`
  if (glob.indexOf('{') !== -1 && opts.nobraces !== true) {
    glob = expandBraces(glob, opts);
  }

  if (!isGlob(glob)) {
    return {glob: utils.escapePath(glob), options: opts};
  }

  // parse the glob pattern into tokens
  var tok = parse.glob(glob, opts);
  if (tok.isDotGlob) {
    opts.dot = true;
  }

  if (glob === '**' && opts.globstar !== false) {
    glob = doublestar(opts);

  } else {
    if (/^\*\.\w*$/.test(glob)) {
      glob = glob.replace(/\*/, star(opts.dot) + '\\');
      return {glob: glob, options: opts};
    }

    // use heuristics to replace common escape patterns
    glob = escape(glob);

    // if the glob is for one directory deep, we can
    // simplify the parsing and generated regex
    if (tok.dirname === '') {
      return expandFilename(glob, tok, opts);
    }

    // windows drives
    replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2');

    // has '**/'
    replace(/\*\*\//g, '.*\\/?');
    // has '**'
    replace(/\*\*/g, doublestar(opts));
    // ends with '/*'
    replace(/\/\*$/g, '\\/' + stardot(opts));
    // ends with '*', no slashes
    replace(/[^\/]\*$/g, boxQ);
    // has '*'
    replace(/\*/g, stardot(opts));

    // has '?.'
    replace(/\?\./g, '?\\.');
    // has '?:'
    replace(/\?:/g, '?:');
    // first of '????'
    replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + box);
    // rest of '????'
    replace(/\?/g, box);

    // escape '.abc' => '\\.abc'
    replace(/\.([*\w]+)/g, '\\.$1');
    // fix '[^\\\\\/]'
    replace(/\[\^[\\\/]+\]/g, box);
    // fix '/' => '\/'
    replace(/\/+/g, '\\/');
    // fix double slashes
    replace(/\\+\//g, '\\/');
    glob = unesc(glob);
  }

  glob = unescape(glob);
  return {glob: glob, tokens: tok, options: opts};
}

/**
 * Expand the filename part of the glob into a regex
 * compatible string
 *
 * @param  {String} glob
 * @param  {Object} tok Tokens
 * @param  {Options} opts
 * @return {Object}
 */

function expandFilename(glob, tok, opts) {
  switch (glob) {
    case '.':
      glob = '\\.';
      break;
    case '.*':
      glob = '\\..*';
      break;
    case '*.*':
      glob = star(opts.dot) + '\\.[^/]*?';
      break;
    case '*':
      glob = star(opts.dot);
      break;
    default:
    if (tok.basename === '*') {
      glob = star(opts.dot) + '\\' + tok.extname;
    } else {
      glob = glob.replace(/\?/g, '[^/]');
      if (/^[^.]/.test(tok.filename)) {
        opts.dot = true;
      }
      glob = glob.replace(/\*/g, star(opts.dot));
    }
  }

  glob = unescape(glob);
  return {glob: glob, options: opts};
}

/**
 * Escape utils
 */

function esc(str) {
  return str.replace(/\?/g, '%~')
    .replace(/\*/g, '%%');
}

function unesc(str) {
  return str.replace(/%%/g, '*')
    .replace(/%~/g, '?');
}

function escape(str, ch) {
  var re = ch ? chars.escapeRegex[ch] : /\\(.)/g;
  return str.replace(re, function($0, $1) {
    return chars[ch ? 'ESC_TEMP' : 'ESC'][ch ? $0 : $1];
  });
}

function unescape(str) {
  return str.replace(/__([A-Z]+)_([A-Z]+)__/g, function($0, $1) {
    return chars[$1][$0];
  });
}

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
 */


var box         = '[^/]';
var boxQ        = '[^/]*?';
var lookahead   = '(?=.)';
var nodot       = '(?!\\.)(?=.)';

var ex = {};

ex.dotfileGlob = '(?:^|\\\/)(?:\\.{1,2})(?:$|\\\/)';
ex.stardot     = '(?!' + ex.dotfileGlob + ')(?=.)[^/]*?';
ex.twoStarDot  = '(?:(?!' + ex.dotfileGlob + ').)*?';

/**
 * Create a regex for `*`. If `dot` is true,
 * or the pattern does not begin with a leading
 * star, then return the simple regex.
 */

function star(dotfile) {
  return dotfile ? boxQ : nodot + boxQ;
}

function dotstarbase(dotfile) {
  var re = dotfile ? ex.dotfileGlob : '\\.';
  return '(?!' + re + ')' + lookahead;
}

function doublestar(opts) {
  if (opts.dot) { return ex.twoStarDot; }
  return '(?:(?!(?:^|\\\/)\\.).)*?';
}

function stardot(opts) {
  return dotstarbase(opts && opts.dot) + '[^/]*?';
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

  var res = braces(glob, options);
  return res.join('|');
}
