/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var globRegex = require('glob-path-regex');
var tokens = require('preserve');
var braces = require('braces');
var win32 = process.platform === 'win32';


/**
 * Parse a glob pattern into sections
 */

function parseGlob(glob, opts) {
  var m = glob.match(globRegex());
  var tok = null;

  if (m) {
    tok = {};

    tok.path = m[0];
    tok.dirname = m[1];

    tok.filename = m[2];
    tok.basename = m[3];

    tok.extensions = m[4];
    tok.extname = m[5];
    tok.ext = m[6];

    if (m[2].charAt(0) === '.') {
      tok.isDotfile = true;
    }
  }
  return tok;
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

var ex = {};

function esc(str) {
  return str.replace(/\?/g, '%~')
    .replace(/\*/g, '%%');
}

function unesc(str) {
  return str.replace(/%%/g, '*')
    .replace(/%~/g, '?');
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

function dotfileGlob(dotfile, opts) {
  // var hasDot = /(?:^|\/)\./.test(glob);
  glob = dotfile ? ''
    : opts.dot
      ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
      : '(?!\\.)';
  return '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))';
}

/**
 * Expand a glob pattern to resolve braces and
 * similar patterns before converting to regex.
 *
 * @param  {String|Array} `pattern`
 * @param  {Array} `files`
 * @param  {Options} `opts`
 * @return {Array}
 */

module.exports = function expand(glob, opts) {
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

      // double escaping. seems like overhead, this
      // might be removed.
      if (glob.charCodeAt(0) === 3) {
        glob = glob.slice(1);
        opts.negated = false;
      }
    }
  }

  // see if there is at least one star
  var twoStars = glob.indexOf('**');

  var tok = parseGlob(glob, opts);
  if (tok.isDotfile) {
    opts.dot = true;
  }

  if (glob === '**' && opts.globstar !== false) {
    glob = doublestar(opts.dot);

  } else if (glob === '*') {
    glob = opts.dot ? '[^\/]*?' : '(?!\\.)(?=.)[^\/]*?';

  } else if (/^\*\.\w*$/.test(glob)) {
    glob = '(?!\\.)(?=.)[^/]*?\\.' + tok.ext;

  } else {
    // expandBraces `{1..5}` braces
    if (glob.indexOf('{') !== -1 && opts.nobraces !== true) {
      glob = expandBraces(glob, opts);
    }

    // escaped stars
    replace(/\\\*/g, '\\*');

    // windows drives
    replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2');
    replace(/\[/g, dotstarbase(opts.dot) + '[');

    // glob stars
    if (twoStars !== -1) {
      replace(/\*\*\//g, '.*\\/?');
      replace(/\*\*/g, '.*');
    }

    // question marks
    replace(/\?\./g, '?\\.');
    replace(/\?:/g, '?:');

    // consecutive `?` chars
    replace(/[^?]\?/g, '\\/'+ dotstarbase(opts.dot) + box);
    // replace(/[^?]\?/g, '\\/.%%' + box)
    replace(/\?/g, box)

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
    if (lt.length != rt.length) {
      glob = glob + ')'
    }
  }

  if (opts.dot === true) {
    glob = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?' + glob;
  }

  return {glob: glob, tokens: tok, options: opts};
};

function escapeRe(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


/**
 * Create the regex to do the matching. If the leading
 * character in the `glob` is `!` a negation regex is
 * returned.
 *
 * Match exglob patterns:
 *  - `?(...)` match zero or one of the given patterns.
 *  - `*(...)` match zero or more of the given patterns.
 *  - `+(...)` match one or more of the given patterns.
 *  - `@(...)` match one of the given patterns.
 *  - `!(...)` match anything except one of the given patterns.
 *
 * @param {String} `glob`
 * @param {String} `flags`
 */

function extglob(glob, type) {
  // console.log('before:', glob)
  // var re = /([^?*+@!]*)([?*+@!]{1})(\(([^)]+)\))/;
  // var match = re.exec(glob);

  // if (match) {
  //   var prefix = match[2];
  //   var inner = match[4];
  //   if (inner.indexOf('{') !== -1) {
  //     return glob;
  //   }

  //   // inner = esc(inner.replace(/\*/g, '.*'));
  //   console.log(match)
  //   // var res = esc('[^/]*?');
  //   var res = '';
  //   switch(prefix) {
  //     case '?':
  //       res += esc('(?:' + inner + ')?');
  //       break;
  //     case '*':
  //     case '+':
  //       res += esc('(?:') + inner + ')';
  //       break;
  //     case '!':
  //       // res += esc('(?:' + inner + ')?')
  //       res += esc('((?!') + inner + esc(').*?)');
  //       break;
  //     case '@':
  //       break;
  //     default:
  //       return glob;
  //       break;
  //   }
  //   glob = glob.replace(match[0], res);

  //   console.log('after:', unesc(glob));
  //   return glob;
  //   // glob = glob.replace(match[0], '(' + inner + ')' + prefix);

  // }

  return glob.replace(/(\.)?([?*+@!]{1})(\(([^)]+)\))/, function (match, $1, prefix, $3, $4) {
    // console.log('args:', [].slice.call(arguments))
    if (!prefix || !$3 || !$4 || $4.indexOf('{') !== -1) {
      return match;
    }
    var res;

    if (prefix === '?') { res = '(?:' + $4 + ')?'; }

    if (prefix === '*' || prefix === '+') {
      res = esc('(?:') + $4 + ')';
    }

    if (prefix === '!') {
      res = esc('((?!') + $4 + esc(').*?)');
    }
        console.log('after:', unesc(res));

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

  var res = braces(glob, options);
  return res.join('|');
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
