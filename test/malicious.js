'use strict';

var assert = require('assert');
var mm = require('./support/match');

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
    assert(mm.isMatch('A', '!(' + generate(1024 * 2, '\\') + 'A)'), 'within the limits, and valid match');
    assert(!mm.isMatch('A', '[!(' + generate(1024 * 2, '\\') + 'A'), 'within the limits, but invalid regex');
  });

  it('should throw an error when the pattern is too long', function() {
    assert.throws(function() {
      var exploit = '!(' + generate(1024 * 64, '\\') + 'A)';
      assert(!mm.isMatch('A', exploit));
    }, /expected pattern to be less than 65536 characters/);
  });
});
