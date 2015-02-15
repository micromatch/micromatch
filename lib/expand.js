/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var utils = require('./utils');
var Glob = require('./glob');

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

function expand(pattern, options) {
  var opts = options || {};
  var glob = new Glob(pattern, opts);

  function replace(re, str) {
    glob.repl(re, esc(str));
    pattern = glob.pattern;
  }

  // return early if the glob pattern tests `true`
  if (specialCase(pattern) && opts.safemode) {
    return new RegExp(utils.escapeRe(pattern), 'g');
  }

  if (opts.nonegate !== true) {
    opts.negated = glob.negated;
  }

  glob.repl(/\/\./g, '/\\.');

  // expand braces, e.g `{1..5}`
  glob.track('before brackets');
  glob.brackets();
  glob.track('before braces');
  glob.braces();
  glob.track('after braces');
  glob.parse();

  glob.repl('[]', '\\[\\]');
  glob.repl('(?', '__QMARK_GROUP__');

  // parse the glob pattern into tokens
  var tok = glob.tokens;
  if (tok.dotfiles) {
    opts.dot = true;
  }

  if (!tok.isGlob) {
    return {
      pattern: utils.escapePath(glob.pattern),
      tokens: tok,
      options: opts
    };
  }

  if (glob.pattern === '**' && opts.globstar !== false) {
     glob.pattern = globstar(opts);

  } else {
    if (/^\*\.\w*$/.test(glob.pattern)) {
      glob.repl('*', star(opts.dot) + '\\');
      glob.repl('__QMARK_GROUP__', '(?');
      return glob;
    }

    // /**/**/** => (?:/**){3}
    glob.repl(/(\/\*)+/g, function (match) {
      var len = match.length / 2;
      if (len === 1) { return match; }
      return '(?:\\/\*){' + len + '}';
    });

    glob.pattern = balance(glob.pattern, '[', ']');

    // use heuristics to replace common escape patterns
    glob.escape(glob.pattern);

    // if the glob is for one directory deep, we can
    // simplify the parsing and generated regex
    if (tok.dirname === '') {
      return expandFilename(glob, opts);
    }

    // windows drives
    replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2');

    // if the pattern has `**`
    if (tok.globstar) {
      glob.repl(/(^|[^\\])\*{2,}([^\\]|$)/g, '$1**$2');
      // foo/**
      replace(/(\w+)\*\*(?!\/)/g, '(?=.)$1[^/]*?');
      // **/
      replace('**/', '(.*\\/|^)');
      // **
      replace('**', globstar(opts));
    }

    // *.*
    glob.repl('*.*', '([^/]*?.[^/]*?)');
    // ends with /*
    replace(/\/\*$/g, '\\/' + stardot(opts));
    // ends with *, no slashes
    replace(/(?!\/)\*$/g, boxQ);
    // has '*'
    replace('*', stardot(opts));

    replace('?.', '?\\.');
    replace('?:', '?:');

    glob.repl(/\?+/g, function (match) {
      var len = match.length;
      if (len === 1) {
        return box;
      }
      return box + '{' + len + '}';
    });

    // escape '.abc' => '\\.abc'
    glob.repl(/\.([*\w]+)/g, '\\.$1');
    // fix '[^\\\\\/]'
    glob.repl(/\[\^[\\\/]+\]/g, box);
    // fix '/' => '\/'
    glob.repl(/\/+/g, '\\/');
    // condense extraneous backslashes slashes
    glob.repl(/\\{2,}/g, '\\');
  }

  glob.repl('__QMARK_GROUP__', '(?');
  glob.unescape(glob.pattern);
  glob.repl('__UNESC_STAR__', '*');
  glob.repl('%~', '?');
  glob.repl('%%', '*');
  return glob;
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

function expandFilename(glob, opts) {
  var tok = glob.tokens;
  switch (glob.pattern) {
    case '.':
      glob.pattern = '\\.';
      break;
    case '.*':
      glob.pattern = '\\..*';
      break;
    case '*.*':
      glob.pattern = star(opts.dot) + '\\.[^/]*?';
      break;
    case '*':
      glob.pattern = star(opts.dot);
      break;
    default:
    if (tok.basename === '*') {
      glob.pattern = star(opts.dot) + '\\' + tok.extname;
    } else {
      glob.repl(/(?!\()\?/g, '[^/]');
      if (tok.filename.charAt(0) !== '.') {
        opts.dot = true;
      }
      glob.repl('*', star(opts.dot));
    }
  }

  glob.repl('__QMARK_GROUP__', '(?');
  glob.unescape(glob.pattern);
  glob.repl('__UNESC_STAR__', '*');
  return glob;
}

/**
 * Special cases
 */

function specialCase(glob) {
  if (glob === '\\') {
    return true;
  }
  return false;
}

/**
 * Escape imbalanced braces/bracket
 */

function balance(str, a, b) {
  var aarr = str.split(a);
  var alen = aarr.join('').length;
  var blen = str.split(b).join('').length;

  if (alen !== blen) {
    str = aarr.join('\\' + a);
    return str.split(b).join('\\' + b);
  }
  return str;
}

/**
 * Escape utils
 */

function esc(str) {
  str = str.split('?').join('%~');
  str = str.split('*').join('%%');
  return str;
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
ex.dotfileGlob = '(?:^|\\/)(?:\\.{1,2})(?:$|\\/)';
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

function globstar(opts) {
  if (opts.dot) { return ex.twoStarDot; }
  return '(?:(?!(?:^|\\/)\\.).)*?';
}

function stardot(opts) {
  return dotstarbase(opts && opts.dot) + '[^/]*?';
}
