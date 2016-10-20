'use strict';

var path = require('path');
var cache = {};

/**
 * Utils
 */

exports.define = require('define-property');
exports.diff = require('arr-diff');
exports.extend = require('extend-shallow');
exports.isGlob = require('is-glob');
exports.typeOf = require('kind-of');
exports.pick = require('object.pick');
exports.union = require('arr-union');
exports.unique = require('array-unique');

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

exports.createKey = function(pattern, options) {
  var key = pattern;
  if (typeof options === 'undefined') {
    return key;
  }
  for (var prop in options) {
    if (options.hasOwnProperty(prop)) {
      key += ';' + prop + '=' + String(options[prop]);
    }
  }
  return key;
};

/**
 * Cast `val` to an array
 * @return {Array}
 */

exports.arrayify = function(val) {
  if (typeof val === 'string') return [val];
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `val` is a non-empty string
 */

exports.isString = function(val) {
  return typeof val === 'string';
};

/**
 * Return true if `val` is a non-empty string
 */

exports.isRegex = function(val) {
  return exports.typeOf(val) === 'regexp';
};

/**
 * Return true if `val` is a non-empty string
 */

exports.isObject = function(val) {
  return exports.typeOf(val) === 'object';
};

/**
 * Escape regex characters in the given string
 */

exports.escapeRegex = function(str) {
  return str.replace(/[\-\[\]{}()^$|\s*+?.\\\/]/g, '\\$&');
};

/**
 * Combines duplicate characters in the provided string.
 * @param {String} `str`
 * @returns {String}
 */

exports.combineDuplicates = function(str, val) {
  if (typeof val === 'string') {
    var re = new RegExp('(' + val + ')(?=(?:' + val + ')*\\1)', 'g');
    return str.replace(re, '');
  }
  return str.replace(/(.)(?=.*\1)/g, '');
};

/**
 * Returns true if the given `str` has special characters
 */

exports.hasSpecialChars = function(str) {
  return /(?:(^|\/)[!.]|[*?+()|\[\]{}]|[+@]\()/.test(str);
};

/**
 * Strip backslashes from a string.
 *
 * @param {String} `filepath`
 * @return {String}
 */

exports.unescape = function(str) {
  return exports.normalize(str.replace(/\\(\W)/g, '$1'));
};

/**
 * Normalize slashes in the given filepath.
 *
 * @param {String} `filepath`
 * @return {String}
 */

exports.normalize = function(filepath) {
  return filepath.replace(/[\\\/]+(?=[\w._-])(?![*?+\\!])/g, '/');
};

/**
 * Returns true if `str` is a common character that doesn't need
 * to be processed to be used for matching.
 * @param {String} `str`
 * @return {Boolean}
 */

exports.isSimpleChar = function(str) {
  return str === '' || str === ' ' || str === '.';
};

exports.isSlash = function(str) {
  return str === '/' || str === '\\' || str === '\\\\';
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

exports.matchPath = function(pattern, options) {
  return (options && options.contains)
    ? exports.containsPattern(pattern, options)
    : exports.equalsPattern(pattern, options);
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

exports.equalsPattern = function(pattern, options) {
  var unixify = exports.unixify(options);

  return function(filepath) {
    if (options && options.nocase === true) {
      filepath = filepath.toLowerCase();
    }
    return pattern === filepath || pattern === unixify(filepath);
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

exports.containsPattern = function(pattern, options) {
  var unixify = exports.unixify(options);
  return function(filepath) {
    if (options && options.nocase === true) {
      return unixify(filepath.toLowerCase()).indexOf(pattern) !== -1;
    } else {
      return unixify(filepath).indexOf(pattern) !== -1;
    }
  };
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re` Matching regex
 * @return {Function}
 */

exports.matchBasename = function(re) {
  return function(filepath) {
    return re.test(filepath) || re.test(path.basename(filepath));
  };
};

/**
 * Strip the prefix from a filepath
 * @param {String} `filepath`
 * @return {String}
 */

exports.stripPrefix = function(fp) {
  if (typeof fp !== 'string') {
    return fp;
  }

  if (fp.charAt(0) === '.' && (fp.charAt(1) === '/' || fp.charAt(1) === '\\')) {
    return fp.slice(2);
  }

  return fp;
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

exports.unixify = function(options) {
  var key = exports.createKey('unixify', options);

  if (cache.hasOwnProperty(key) && path.sep === '/') {
    return cache[key];
  }

  var opts = exports.extend({}, options);

  var unixify = function(filepath) {
    return exports.stripPrefix(filepath);
  };

  if (path.sep !== '/' || opts.unixify === true || opts.normalize === true) {
    unixify = function(filepath) {
      return exports.stripPrefix(exports.normalize(filepath));
    };
  }

  if (opts.unescape === true) {
    unixify = function(filepath) {
      return exports.stripPrefix(exports.normalize(exports.unescape(filepath)));
    };
  }

  cache[key] = unixify;
  return unixify;
};
