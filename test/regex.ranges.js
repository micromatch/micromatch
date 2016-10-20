'use strict';

require('mocha');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var minimatch = require('minimatch');
var brackets = require('..');

var matcher = argv.mm ? minimatch : brackets;
var isMatch = argv.mm ? minimatch : brackets.isMatch.bind(matcher);

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options).sort(compare);
  expected.sort(compare);
  assert.deepEqual(actual, expected);
}

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

describe('ranges', function() {
  it('should support valid regex ranges', function() {
    var fixtures = ['a.a', 'a.b', 'a.a.a', 'c.a', 'd.a.d', 'a.bb', 'a.ccc'];
    match(fixtures, '[a-b].[a-b]', ['a.a', 'a.b']);
    match(fixtures, '[a-d].[a-b]', ['a.a', 'a.b', 'c.a']);
    match(fixtures, '[a-d]*.[a-b]', ['a.a', 'a.b', 'c.a']);
  });

  it('should support valid regex ranges with negation patterns', function() {
    var fixtures = ['a.a', 'a.b', 'a.a.a', 'c.a', 'd.a.d', 'a.bb', 'a.ccc'];
    match(fixtures, '!*.[a-b]', ['a.bb', 'a.ccc', 'd.a.d']);
    match(fixtures, '![a-b].[a-b]', ['a.a.a', 'a.bb', 'a.ccc', 'c.a', 'd.a.d']);
    match(fixtures, '![a-b]+.[a-b]+', ['a.a.a', 'a.ccc', 'c.a', 'd.a.d']);
    match(fixtures, '!*.[a-b]*', ['a.ccc', 'd.a.d']);
    match(fixtures, '*.[^a-b]', ['d.a.d']);
    match(fixtures, 'a.[^a-b]*', ['a.ccc']);
  });
});
