'use strict';

const assert = require('assert');
const { braceExpand } = require('..');

describe('.braceExpand()', () => {
  it('should throw an error when arguments are invalid', () => {
    assert.throws(() => braceExpand());
  });

  it('should expand a brace pattern', () => {
    assert.deepEqual(braceExpand('{a,b}'), ['a', 'b']);
  });
});
