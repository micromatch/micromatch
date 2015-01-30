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

  function unescape() {
    glob = unesc(glob);
  }

  if (opts.nonegate !== true) {
    var negate = glob.charCodeAt(0) === 33; /* '!' */
    if (negate) {
      opts.negated = true;
      glob = glob.slice(1);
    }
  }

  if (!isGlob(glob)) {
    return {glob: utils.escapePath(glob), options: opts};
  }

  if (glob === '**' && opts.globstar !== false) {
    glob = doublestar(opts.dot);

  } else {

    var tok = parse.glob(glob, opts);
    if (tok.isDotfile) {
      opts.dot = true;
    }

    if (tok.dirname === '') {
        console.log()
        console.log(glob)
        console.log(tok)
        if (tok.extname && tok.extname && tok.extname.slice(-1) === '}') {
          tok.extname = expandBraces(tok.extname, opts);
        }
      if (glob === '.*') {
        glob = '\\..*';

      } else if (glob === '*.*') {
        glob = star(opts.dot) + '\\.[^/]*?';

      } else if (glob === '*') {
        glob = star(opts.dot);

      } else if (tok.basename === '*') {
        glob = star(opts.dot) + '\\' + tok.extname;

      } else {
        // if the pattern begins with a letter, we can simplify
        // the regex by enabling `dot: true`, since it won't match
        // dotfiles anyway
        if (/^\w/.test(tok.filename)) {
          opts.dot = true;
        }

        glob = glob.replace(/\*/g, star(opts.dot));
      }

      return {glob: glob, options: opts};
    }

    // expandBraces `{1..5}` braces
    if (glob.indexOf('{') !== -1 && opts.nobraces !== true) {
      glob = expandBraces(glob, opts);
    }

    // if (tok.dirname === '**/') {
      // console.log();
      // console.log('dirname:', tok.dirname);
      // console.log('filename:', tok.filename);
      // console.log('basename:', tok.basename);
      // console.log('extname:', tok.extname);
    // }

    // escaped stars
    replace(/\\\*/g, '\\*');

    // windows drives
    replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2');
    replace(/\[/g, dotstarbase(opts.dot) + '[');

    // glob stars
    if (glob.indexOf('**') !== -1) {
      replace(/\*\*\//g, '.*\\/?');
      replace(/\*\*/g, '.*');
    }

    // question marks
    replace(/\?\./g, '?\\.');
    replace(/\?:/g, '?:');

    // consecutive `?` chars
    replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + box);
    // replace(/[^?]\?/g, '\\/.%%' + box)
    replace(/\?/g, box);

    // replace(/\?/g, '.');
    replace(/\/+/g, '\\/');

    if (glob.indexOf('*') !== -1) {
      // last chars are '/*'
      replace(/\/\*$/g, '\\/' + stardot(opts.dot));
      // last char is '*', no slashes
      replace(/(?!\/)\*$/g, boxQ);
      //=> '^.*'
      replace(/\*/g, stardot(opts.dot));
    }

    replace(/\.([*\w]+)/g, '\\.$1');
    replace(/\[\^\\\/\]/g, box);
    replace(/\\+\//g, '\\/');
    unescape();
  }

  glob = glob.replace(/(?:^|([^\w]))\.\[/g, '$1\\.[');

  var lt = glob.match(/(\(|\[)/g);
  var rt = glob.match(/(\)|\])/g);
  if (lt && rt) {
    if (lt.length !== rt.length) {
      glob = glob + ')';
    }
  }

  if (opts.dot === true) {
    glob = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?' + glob;
  }

  return {glob: glob, tokens: tok, options: opts};
}

/**
 * Special patterns to be converted to regex.
 * Heuristics are used to simplify patterns
 * and speed up processing.
 */

var box         = '[^/]';
var boxQ        = '[^/]*?';
var lookahead   = '(?=.)';
var dot         = '\\.';
var dots        = '\\.{1,2}';
var start       = '(?:^|\\\/)';
var end         = '(?:$|\\\/)';
var nodot       = '(?!\\.)(?=.)';

var ex = {};

function esc(str) {
  return str.replace(/\?/g, '%~')
    .replace(/\*/g, '%%');
}

function unesc(str) {
  return str.replace(/%%/g, '*')
    .replace(/%~/g, '?');
}

/**
 * Create a regex for `*`. If `dot` is true,
 * or the pattern does not begin with a leading
 * star, then return the simple regex.
 */

function star(dotfile, leadingStar) {
  return dotfile ? boxQ : nodot + boxQ;
}

function dotstarbase(dotfile) {
  var re = dotfile
    ? ('(?:^|\\\/)\\.{1,2}(?:$|\\\/)')
    : '\\.';
  return '(?!' + re + ')' + lookahead;
}

function doublestar(dotfile) {
  if (dotfile) { return twoStarDot(); }
  return '(?:(?!(?:^|\\\/)\\.).)*?';
}

ex.stardot = '?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))(?=.)[^/]*?';
function stardot(dotfile) {
  return dotstarbase(dotfile) + '[^/]*?';
}

function twoStarDot(opts) {
  return '(?:(?!(?:^|\\\/)(?:\\.{1,2})($|\\\/)).)*?';
}

function dotfileGlob(glob, dotfile, opts) {
  // var hasDot = /(?:^|\/)\./.test(glob);
  glob = dotfile ? ''
    : opts.dot
      ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
      : '(?!\\.)';
  return '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))';
}

function escapeRe(re) {
  return re.replace(/[*+?.^$#\s[|\]{,}(-)\\]/g, '\\$&');
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