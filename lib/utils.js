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
  if (opts && opts.normalize) {
    win = true;
  } else if (opts && opts.cache && typeof win === 'undefined') {
    win = win32 || path.sep === '\\';
  }
  if (win) {
    return fp.replace(/[\\\/]+/g, '/');
  }
  return fp;
};

exports.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

exports.isDrive = function isDrive(fp) {
  return /^\w:/.test(fp);
};

exports.isCWD = function isCWD(fp) {
  return fp.charAt(0) === '.';
};

exports.isLongPath = function isLongPath(fp, len) {
  if (typeof len === 'number') {
    return len > 248;
  }
  return fp.length > 248;
};

exports.isUNC = function isUNC(fp) {
  return /^\\\\/.test(fp);
};

exports.escapeRe = function escapeRe(str) {
  return str.replace(/[$*+?.#\\^\s[-\]{}(|)]/g, '\\$&');
};
