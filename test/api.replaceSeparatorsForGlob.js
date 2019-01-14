'use strict';

var assert = require('assert');
var mm = require('..');

describe('.replaceSeparatorsForGlob()', function() {
  it('should throw an error when value is not a string', function() {
    assert.throws(function() {
      mm.replaceSeparatorsForGlob();
    });
  });

  it('should replace backslashes', function() {
    assert.equal(mm.replaceSeparatorsForGlob('/some/path\\with\\backslashes'), '/some/path/with/backslashes');
  });

  it('should not replace backslashes when they are escaped characters', function() {
    assert.equal(mm.replaceSeparatorsForGlob('/some/path\\with\\backslashes/and\\(parens\\)'), '/some/path/with/backslashes/and\\(parens\\)');
  });
});
