'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('..');

describe('.compile()', function() {
  it('should throw an error when arguments are invalid', function() {
    assert.throws(function() {
      mm.compile();
    });
  });

  it('should return an AST for a glob', function() {
    var foo = mm.compile('a/*');
    delete foo.ast.state;
    assert.deepEqual(foo.ast, {
      type: 'root',
      errors: [],
      nodes: [
        { type: 'bos', val: '' },
        { type: 'text', val: 'a' },
        { type: 'slash', val: '/' },
        { type: 'star', val: '*' },
        { type: 'eos', val: '' }
      ],
      input: 'a/*'
    });

    var bar = mm.compile('a/**/*');
    delete bar.ast.state;
    assert.deepEqual(bar.ast, {
      type: 'root',
      errors: [],
      nodes: [
        { type: 'bos', val: '' },
        { type: 'text', val: 'a' },
        { type: 'slash', val: '/' },
        { type: 'globstar', val: '**' },
        { type: 'slash', val: '/' },
        { type: 'star', val: '*' },
        { type: 'eos', val: '' }
      ],
      input: 'a/**/*'
    });
  });
});
