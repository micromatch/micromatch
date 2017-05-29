'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('..');

describe('.every()', function() {
  it('should return true if every string matches', function() {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(mm.every(fixtures, ['z', '*/*']));
  });

  it('should return false when not all strings match', function() {
    var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
    assert(!mm.every(fixtures, ['a/*', 'x/*']));
  });

  it('should arrayify a string value', function() {
    assert(mm.every('a', ['*']));
  });
});
