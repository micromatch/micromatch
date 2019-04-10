'use strict';

const assert = require('assert');
const mm = require('..');
const generate = n => '\\'.repeat(n);

/**
 * These tests are based on minimatch unit tests
 */

describe('handling of potential regex exploits', () => {

  it('should support long escape sequences', () => {
    assert(mm.isMatch('A', `!(${generate(65500)}A)`), 'within the limits, and valid match');
    assert(!mm.isMatch('A', `[!(${generate(65500)}A`), 'within the limits, but invalid regex');
  });

  it('should throw an error when the pattern is too long', () => {
    assert.throws(() => {
      assert(!mm.isMatch('A', `!(${generate(65536)}A)`));
    }, /Input length: 65540, exceeds maximum allowed length: 65536/);
  });

  it('should allow max bytes to be customized', () => {
    assert.throws(() => {
      assert(!mm.isMatch('A', `!(${generate(500)}A)`, { maxLength: 499 }));
    }, /Input length: 504, exceeds maximum allowed length: 499/);
  });
});
