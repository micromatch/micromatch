/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fileRe = require('filename-regex');

/**
 * Parse a glob pattern into sections
 */

exports.glob = function parseGlob(glob, opts) {
  var filename = fileRe().exec(glob);
  var leadingDot = filename[0].charAt(0) === '.';
  var basename = '';
  var tok = null;

  var seg = filename[0].split('.');
  var extensions = [];

  if (!leadingDot) {
    basename = seg[0];
    extensions = seg.slice(1);
  }

  var ext = extensions[0];

  tok = {};
  tok.dirname = glob.replace(filename[0], '');

  tok.filename = filename[0];
  tok.basename = basename;

  tok.extensions = extensions;
  tok.extname = '\\.' + ext;
  tok.ext = ext;

  tok.isDotfile = leadingDot && isDotfile(tok, opts);
  return tok;
};

function isDotfile(tok, opts) {
  return opts.dot !== false
    && opts.dotfiles !== false
    && tok.basename === '';
}

function esc(fp) {
  return fp.replace(/\./, '\\.');
}
