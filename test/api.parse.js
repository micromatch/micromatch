'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('..');

describe('.parse()', function() {
  it('should throw an error when arguments are invalid', function() {
    assert.throws(function() {
      mm.parse();
    });
  });

  it('should return an AST for a glob', function() {
    var ast = mm.parse('a/*');
    delete ast.state;
    assert.deepEqual(ast, {
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

    ast = mm.parse('a/**/*');
    delete ast.state;
    assert.deepEqual(ast, {
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
