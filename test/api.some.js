'use strict';

var assert = require('assert');
var mm = require('..');

describe('.some()', function() {
  it('should return true if any matches are found', function() {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(mm.some(fixtures, ['z', 'b/*']));
  });

  it('should return false if no matches are found', function() {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(!mm.some(fixtures, ['z', 'x/*']));
  });

  it('should arrayify a string value', function() {
    assert(mm.some('a', ['*']));
  });
});
