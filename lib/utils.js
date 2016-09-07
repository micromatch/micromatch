'use strict';

var isWindows = process.platform === 'win32';
var path = require('path');
var utils = module.exports;

utils.fill = require('fill-array');
utils.unique = require('array-unique');
utils.define = require('define-property');
utils.extend = require('extend-shallow');
utils.repeat = require('repeat-string');
utils.normalize = require('normalize-path');
utils.isGlob = require('is-glob');
utils.diff = require('arr-diff');
var unixifyCache = {};

/**
 * Create a negation regex from the given string
 * @param {String} `str`
 * @return {RegExp}
 */

utils.not = function(str) {
  return '^((?!(?:' + str + ')).)*';
};

utils.expand = function(str) {
  var segs = str.split(',').filter(Boolean);
  var arr = segs.slice();

  if (arr.length === 1) {
    arr = str.split('..');

    if (arr.length > 1) {
      segs = utils.fill.apply(null, arr);
    }
  }
  return segs;
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isString = function(val) {
  return val && typeof val === 'string';
};

/**
 * Get the last element from `array`
 * @param {Array} `array`
 * @return {*}
 */

utils.last = function(arr) {
  return arr[arr.length - 1];
};

utils.hasSpecialChars = function(str) {
  return /(?:(^|\/)[!.]|[*?()\[\]{}]|[+@]\()/.test(str);
};

/**
 * Returns a function that returns true if the given
 * regex matches the `filename` of a file path.
 *
 * @param {RegExp} `re` Matching regex
 * @return {Function}
 */

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(filepath) || re.test(path.basename(filepath));
  };
};

/**
 * Returns a function that returns true if the given
 * pattern matches or contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.matchPath = function(pattern, options) {
  return (options && options.contains)
    ? utils.containsPath(pattern, options)
    : utils.equalsPath(pattern, options);
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.equalsPath = function(pattern, options) {
  options = options || {};
  return function(filepath) {
    if (options.nocase === true) {
      return pattern.toLowerCase() === filepath.toLowerCase();
    } else {
      return pattern === filepath;
    }
  };
};

/**
 * Returns a function that returns true if the given
 * pattern contains a `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.containsPath = function(pattern) {
  return function(filepath) {
    return pattern.indexOf(filepath) !== -1;
  };
};

utils.stripPrefix = function(filepath, options) {
  var opts = utils.extend({}, options);
  if (opts.normalize !== true) {
    return filepath;
  }

  filepath = String(filepath || '');
  if (filepath.slice(0, 2) === './') {
    return filepath.slice(2);
  }
  return filepath;
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

utils.unixify = function(options) {
  var opts = utils.extend({}, options);
  var unixify;

  if (path.sep !== '/' || opts.unixify === true) {
    unixify = function(filepath) {
      return utils.normalize(utils.stripPrefix(filepath, opts), false);
    };

  } else if (opts.unescape === true) {
    unixify = function(filepath) {
      return utils.stripPrefix(filepath, opts).replace(/\\([-.\w])/g, '$1');
    };

  } else {
    unixify = function(filepath) {
      return utils.stripPrefix(filepath, opts);
    };
  }

  return unixify;
};
