'use strict';

var assert = require('assert');
var mm = require('..');

describe('.makeRe()', function() {
  it('should throw an error when value is not a string', function() {
    assert.throws(function() {
      mm.makeRe();
    });
  });

  it('should create a regex for a glob pattern', function() {
    assert(mm.makeRe('*') instanceof RegExp);
  });

  it('should create a regex for a string', function() {
    assert.deepEqual(mm.makeRe('abc').source, '^(?:abc)$');
  });
});
