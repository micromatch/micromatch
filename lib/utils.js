'use strict';

var path = require('path');
var win32 = process.platform === 'win32';
var win;

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

exports.arrayify = function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
};

/**
 * Convert a file path to a unix path.
 */

exports.unixify = function unixify(fp, opts) {
  if (opts && opts.unixify === true) {
    win = true;
  } else if (opts && opts.cache && typeof win === 'undefined') {
    win = win32 || path.sep === '\\';
  }
  if (win) {
    return fp.replace(/[\\\/]+/g, '/');
  }
  return fp;
};

/**
 * Escape/unescape utils
 */

exports.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

exports.unescapeGlob = function unescapeGlob(fp) {
  return fp.replace(/[\\"']/g, '');
};

exports.escapeRe = function escapeRe(str) {
  return str.replace(/[\]-[\\$*+?.#^\s{}(|)]/g, '\\$&');
};
