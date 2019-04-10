'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const sep = path.sep;

describe('.match()', () => {
  afterEach(() => (path.sep = sep));
  after(() => (path.sep = sep));

  describe('posix paths', () => {
    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
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
    beforeEach(() => {
      path.sep = '\\';
    });

    afterEach(() => {
      path.sep = sep;
    });

    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '(a/b)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(mm(fixtures, 'a/(a|c)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a\\\\(a|c)', { windows: false }), ['a\\a', 'a\\c']);
      assert.deepEqual(mm(fixtures, 'a/(a|c)'), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/(a|b|c)'), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
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
