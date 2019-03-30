'use strict';

require('mocha');
const path = require('path');
const assert = require('assert');
const { braceExpand } = require('..');

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep
}

describe('.braceExpand()', () => {it('should throw an error when arguments are invalid', () => {
    assert.throws(() => braceExpand());
  });

  it('should expand a brace pattern', () => {
    assert.deepEqual(braceExpand('{a,b}'), ['a', 'b']);
  });
});
