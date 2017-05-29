'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('..');

describe('.braceExpand()', function() {
  it('should throw an error when arguments are invalid', function() {
    assert.throws(function() {
      mm.braceExpand();
    });
  });

  it('should expand a brace pattern', function() {
    assert.deepEqual(mm.braceExpand('{a,b}'), ['a', 'b']);
  });
});
