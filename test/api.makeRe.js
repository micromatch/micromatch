'use strict';

const assert = require('assert');
const mm = require('..');

describe('.makeRe()', () => {
  it('should throw an error when value is not a string', () => {
    assert.throws(() => mm.makeRe());
  });

  it('should create a regex for a glob pattern', () => {
    assert(mm.makeRe('*') instanceof RegExp);
  });

  describe('differences from picomatch', () => {
    it('should produce good regex for braces', () => {
      let regex = mm.makeRe('{2..10..3}', { capture: false });
      assert(regex instanceof RegExp);
      assert.equal( regex.source, '^(?:(?:2|5|8))$');

      regex = mm.makeRe('{2..10..3}', { capture: true });
      assert.equal( regex.source, '^(?:(?:(2|5|8)))$');
    });
  });
});
