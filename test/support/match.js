'use strict';

var assert = require('assert');
var utils = require('../../lib/utils');
var matcher = require('./matcher');
var compare = require('./compare');
var mm = require('../..');

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

module.exports.matcher = function(fixtures, patterns, expected, options) {
  if (!Array.isArray(expected)) {
    var tmp = expected;
    expected = options;
    options = tmp;
  }

  var fn = matcher.matcher(patterns, options);
  fixtures = utils.arrayify(fixtures);

  var actual = [];
  fixtures.forEach(function(file) {
    if (fn(file)) {
      actual.push(file);
    }
  });

  expected.sort(compare);
  actual.sort(compare);

  assert.deepEqual(actual, expected, patterns);
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

module.exports.create = function() {
  return matcher.create.apply(null, arguments);
};

module.exports.not = function() {
  return matcher.not.apply(null, arguments);
};
