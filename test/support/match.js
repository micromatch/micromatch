'use strict';

var assert = require('assert');
var utils = require('../../lib/utils');
var matcher = require('./matcher');
var compare = require('./compare');

module.exports = function(fixtures, patterns, expected, options) {
  if (!Array.isArray(expected)) {
    var tmp = expected;
    expected = options;
    options = tmp;
  }

  var actual = matcher(utils.arrayify(fixtures), patterns, options);
  expected.sort(compare);
  actual.sort(compare);

  assert.deepEqual(actual, expected, patterns);
};

module.exports.match = function(fixtures, pattern, expected, options) {
  if (!Array.isArray(expected)) {
    var tmp = expected;
    expected = options;
    options = tmp;
  }

  var actual = matcher.match(utils.arrayify(fixtures), pattern, options);
  expected.sort(compare);
  actual.sort(compare);

  assert.deepEqual(actual, expected, pattern);
};

module.exports.isMatch = function() {
  return matcher.isMatch.apply(null, arguments);
};

module.exports.makeRe = function() {
  return matcher.makeRe.apply(null, arguments);
};

module.exports.braces = function() {
  return matcher.braces.apply(null, arguments);
};

function isMatch(fixture, pattern, expected, options) {
  if (typeof expected !== 'boolean') {
    var tmp = expected;
    expected = options;
    options = tmp;
  }

  var isMatch = matcher.isMatch(fixture, pattern, options);
  if (expected === false) {
    assert(!isMatch, 'should not match ' + pattern);
  } else {
    assert(isMatch, 'should match ' + pattern);
  }
};
