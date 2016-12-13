'use strict';

var utils = module.exports;
var path = require('path');
var cache = {};

/**
 * Module dependencies
 */

var Snapdragon = require('snapdragon');
utils.define = require('define-property');
utils.diff = require('arr-diff');
utils.extend = require('extend-shallow');
utils.typeOf = require('kind-of');
utils.pick = require('object.pick');
utils.unique = require('array-unique');

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

/**
 * Compose a matcher function with the given patterns
 */

utils.compose = function(patterns, options, matcher) {
  var fns = patterns.map(function(pattern) {
    return matcher(pattern, options);
  });

  return function(file) {
    var len = fns.length;
    while (len--) if (fns[len](file)) return true;
    return false;
  };
};

/**
 * Get the `Snapdragon` instance to use
 */

utils.instantiate = function(ast, options) {
  var snapdragon;
  // if an instance was created by `.parse`, use that instance
  if (utils.typeOf(ast) === 'object' && ast.snapdragon) {
    snapdragon = ast.snapdragon;
  // if the user supplies an instance on options, use that instance
  } else if (utils.typeOf(options) === 'object' && options.snapdragon) {
    snapdragon = options.snapdragon;
  // create a new instance
  } else {
    snapdragon = new Snapdragon(options);
  }

  utils.define(snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    // escape unmatched brace/bracket/parens
    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0];
      var inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') {
          inner.val = '\\' + inner.val;
        }

      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') {
          sibling.loose = true;
        }
      }
    }

    // add non-enumerable parser reference
    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  return snapdragon;
};

/**
 * Create the key to use for memoization. The key is generated
 * by iterating over the options and concatenating key-value pairs
 * to the pattern string.
 */

utils.createKey = function(pattern, options) {
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

utils.arrayify = function(val) {
  if (typeof val === 'string') return [val];
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isString = function(val) {
  return typeof val === 'string';
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isRegex = function(val) {
  return utils.typeOf(val) === 'regexp';
};

/**
 * Return true if `val` is a non-empty string
 */

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

/**
 * Escape regex characters in the given string
 */

utils.escapeRegex = function(str) {
  return str.replace(/[\-\[\]{}()^$|\s*+?.\\\/]/g, '\\$&');
};

/**
 * Combines duplicate characters in the provided string.
 * @param {String} `str`
 * @returns {String}
 */

utils.combineDuplicates = function(str, val) {
  if (typeof val === 'string') {
    var re = new RegExp('(' + val + ')(?=(?:' + val + ')*\\1)', 'g');
    return str.replace(re, '');
  }
  return str.replace(/(.)(?=.*\1)/g, '');
};

/**
 * Returns true if the given `str` has special characters
 */

utils.hasSpecialChars = function(str) {
  return /(?:(?:(^|\/)[!.])|[*?+()|\[\]{}]|[+@]\()/.test(str);
};

/**
 * Strip backslashes from a string.
 *
 * @param {String} `str`
 * @return {String}
 */

utils.unescape = function(str) {
  return utils.normalize(str.replace(/\\(\W)/g, '$1'));
};

/**
 * Normalize slashes in the given filepath.
 *
 * @param {String} `filepath`
 * @return {String}
 */

utils.normalize = function(str) {
  return str.replace(/\\+/g, '/');
};

/**
 * Strip the drive letter from a windows filepath
 * @param {String} `fp`
 * @return {String}
 */

utils.stripDrive = function(fp) {
  return path.sep === '\\' ? fp.replace(/^[a-z]:\/?/i, '/') : fp;
};

/**
 * Strip the prefix from a filepath
 * @param {String} `fp`
 * @return {String}
 */

utils.stripPrefix = function(str) {
  return str.replace(/^\.[\\\/]+/, '');
};

/**
 * Returns true if `str` is a common character that doesn't need
 * to be processed to be used for matching.
 * @param {String} `str`
 * @return {Boolean}
 */

utils.isSimpleChar = function(str) {
  return str === '' || str === ' ' || str === '.';
};

utils.isSlash = function(str) {
  return str === '/' || str === '\\/' || str === '\\' || str === '\\\\';
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
    ? utils.containsPattern(pattern, options)
    : utils.equalsPattern(pattern, options);
};

/**
 * Returns a function that returns true if the given
 * pattern is the same as a given `filepath`
 *
 * @param {String} `pattern`
 * @return {Function}
 */

utils.equalsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);

  return function(filepath) {
    filepath = utils.stripPrefix(filepath);
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

utils.containsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  return function(filepath) {
    filepath = utils.stripPrefix(filepath);
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

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(filepath) || re.test(path.basename(filepath));
  };
};

/**
 * Normalize all slashes in a file path or glob pattern to
 * forward slashes.
 */

utils.unixify = function(options) {
  var type = path.sep === '\\' ? 'backslash' : 'slash';
  var key = utils.createKey('unixify' + type, options);

  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  var unixify = function(filepath) {
    return utils.stripPrefix(filepath);
  };

  options = options || {};
  if (type === 'backslash' || options.unixify === true || options.normalize === true) {
    unixify = function(filepath) {
      return utils.stripPrefix(utils.normalize(filepath));
    };
  }

  if (options.unescape === true) {
    var fn = function(filepath) {
      return unixify(utils.unescape(filepath));
    };
    cache[key] = fn;
    return fn;
  }
  cache[key] = unixify;
  return unixify;
};
