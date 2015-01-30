/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var pathRe = require('glob-path-regex');

/**
 * Parse a glob pattern into sections
 *
 * When no paths or '**' are in the glob, we use a
 * different strategy for parsing the filename, since
 * file names can contain braces and other difficult
 * patterns. such as:
 *
 *  - `*.{a,b}`
 *  - `(**|*.js)`
 */

exports.glob = function parseGlob(glob) {
  var m = pathRe().exec(glob) || [];
  var tok = {};

  if (!/(\/|\*\*)/.test(glob)) {
    tok.pattern = glob;
    tok.dirname = '';
    tok.filename = glob;

    var basename = /^([^.]*)/.exec(glob);
    if (basename) {
      tok.basename = basename[0];
      tok.extname = glob.replace(tok.basename, '');
    } else {
      tok.basename = glob;
      tok.extname = m[5];
    }

  } else {
    tok.pattern = glob;
    tok.dirname = m[1];

    tok.filename = m[2];
    tok.basename = m[3];
    tok.extname = m[5];
  }

  tok.isDotGlob = tok.filename.charAt(0) === '.';
  return tok;
};
