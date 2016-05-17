'use strict';

var win32 = process && process.platform === 'win32';
var path = require('path');
var utils = module.exports;

/**
 * Module dependencies
 */

utils.braces = require('braces');
utils.brackets = require('expand-brackets');
utils.cache = require('regex-cache');
utils.diff = require('arr-diff');
utils.extglob = require('extglob');
utils.isExtglob = require('is-extglob');
utils.isGlob = require('is-glob');
utils.normalize = require('normalize-path');
utils.omit = require('object.omit');
utils.parseGlob = require('parse-glob');
utils.typeOf = require('kind-of');
utils.unique = require('array-unique');

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.pathEquals = function(pattern, opts) {
  return function(fp) {
    return pattern === fp;
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.pathContains = function(pattern) {
  return function(fp) {
    return fp.indexOf(pattern) !== -1;
  };
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.matchPath = function(pattern, opts) {
  return (opts && opts.contains)
    ? utils.pathContains(pattern, opts)
    : utils.pathEquals(pattern, opts);
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re`
 * @return {Boolean}
 */

utils.hasFilename = function(re) {
  return function(fp) {
    var name = path.basename(fp);
    return name && re.test(name);
  };
};

/**
 * Coerce `val` to an array
 *
 * @param  {*} val
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

utils.unixify = function(fp, opts) {
  if (opts && opts.unixify === false) return fp;
  if (opts && opts.unixify === true || win32 || path.sep === '\\') {
    return utils.normalize(fp, false);
  }
  if (opts && opts.unescape === true) {
    return fp ? fp.toString().replace(/\\(\w)/g, '$1') : '';
  }
  return fp;
};

/**
 * Escape/unescape utils
 */

utils.escapePath = function(fp) {
  return fp.replace(/[\\.]/g, '\\$&');
};

utils.unescapeGlob = function(fp) {
  return fp.replace(/[\\"']/g, '');
};

utils.escapeRe = function(str) {
  return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
};

/**
 * Expose `utils`
 */

module.exports = utils;
