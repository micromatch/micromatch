'use strict';

var assert = require('assert');
var mm = require('..');

describe('.all()', function() {
  it('should throw an error when value is not a string', function() {
    assert.throws(function() {
      mm.all();
    });
  });

  it('should return true when all patterns match the given string', function() {
    assert(mm.all('z', ['z', '*', '[a-z]']));
    assert(mm.all('b', 'b'));
    assert(mm.all('b', '*'));
  });

  it('should return false when some patterns do not match', function() {
    assert(!mm.all('a', ['a', 'b', '*']));
  });

  it('should arrayify a string value', function() {
    assert(mm.all('a', ['*']));
  });
});
