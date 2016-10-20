'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var matcher = argv.mm ? require('minimatch') : require('..');
var isMatch = argv.mm ? matcher : matcher.isMatch;

/**
 * These tests are based on minimatch unit tests
 */

function generate(len, ch) {
  var pattern = '';
  while (--len) pattern += ch;
  return pattern;
}

describe('handling of potential regex exploits', function() {
  it('should support long escape sequences', function() {
    assert(isMatch('A', '!(' + generate(1024 * 2, '\\') + 'A)'), 'within the limits, and valid match');
    assert(!isMatch('A', '[!(' + generate(1024 * 2, '\\') + 'A'), 'within the limits, but invalid regex');
  });

  it('should throw an error when the pattern is too long', function() {
    assert.throws(function() {
      var exploit = '!(' + generate(1024 * 64, '\\') + 'A)';
      assert(!isMatch('A', exploit));
    }, /expected pattern to be less than 65536 characters/);
  });
});
