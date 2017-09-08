'use strict';

var assert = require('assert');
var mm = require('..');

describe('.braces()', function() {
  it('should throw an error when arguments are invalid', function() {
    assert.throws(function() {
      mm.braces();
    });
  });

  it('should create a regex source string from a brace pattern', function() {
    assert.deepEqual(mm.braces('{a,b}'), ['(a|b)']);
  });

  it('should expand a brace pattern', function() {
    assert.deepEqual(mm.braces('{a,b}', {expand: true}), ['a', 'b']);
  });
});
