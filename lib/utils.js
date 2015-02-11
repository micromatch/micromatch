'use strict';

var path = require('path');
var fileRe = require('filename-regex');
var win32 = process.platform === 'win32';
var win;

var utils = module.exports;

utils.filename = function filename(fp) {
  var seg = fp.match(fileRe());
  return seg && seg[0];
};

utils.isPath = function isPath(pattern) {
  return function (fp) {
    return fp === pattern;
  };
};

utils.hasPath = function hasPath(pattern) {
  return function (fp) {
    return fp.indexOf(pattern) !== -1;
  };
};

utils.matchPath = function matchPath(pattern, opts) {
  var fn = (opts && opts.contains)
    ? utils.hasPath(pattern)
    : utils.isPath(pattern);
  return fn;
};

utils.hasFilename = function hasFilename(re) {
  return function (fp) {
    var name = utils.filename(fp);
    return name && re.test(name);
  };
};

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

utils.arrayify = function arrayify(val) {
  return !Array.isArray(val)
    ? [val]
    : val;
};

/**
 * Convert a file path to a unix path.
 */

utils.unixify = function unixify(fp, opts) {
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

utils.escapePath = function escapePath(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

utils.unescapeGlob = function unescapeGlob(fp) {
  return fp.replace(/[\\"']/g, '');
};

utils.escapeRe = function escapeRe(str) {
  return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
};
