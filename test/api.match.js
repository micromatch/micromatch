'use strict';

const assert = require('assert');
const mm = require('..');

describe('.match()', () => {
  describe('posix paths', () => {
    it('should return an array of matches for a literal string', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
    });

    it('should support regex logical or', () => {
      const fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, '!*/*'), []);
      assert.deepEqual(mm(fixtures, '!*/b'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/*'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(*)'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(*/b)'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('windows paths', () => {
    it('should return an array of matches for a literal string', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '(a/b)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
    });

    it('should support regex logical or', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a\\\\(a|c)', { windows: false }), ['a\\a', 'a\\c']);
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '!*/*'), []);
      assert.deepEqual(mm(fixtures, '!*/b', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!*/b'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/*', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!a/*'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/b', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(b)', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!a/(b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!a/(*)', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!a/(*)'), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(*/b)', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!(*/b)'), ['a/a', 'a/c', 'b/a', 'b/c']);
      assert.deepEqual(mm(fixtures, '!(a/b)', { windows: false }), ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, '!(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });
});
