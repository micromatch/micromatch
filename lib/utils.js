'use strict';

var path = require('path');
var win32 = process.platform === 'win32';

/**
 * Convert a file path to a unix path.
 */

exports.unixify = function unixify(fp, opts) {
  if (opts && opts.normalize || win32 || path.sep === '\\') {
    return fp.replace(/[\\\/]+/g, '/');
  }
  return fp;
};

exports.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};