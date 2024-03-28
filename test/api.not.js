'use strict';

const assert = require('assert');
const { not } = require('..');

describe('.not()', () => {
  describe('posix paths', () => {
    it('should return an array of matches for a literal string', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(not(fixtures, 'a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', () => {
      const fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(not(fixtures, 'a/(a|c)'), ['a/b']);
      assert.deepEqual(not(fixtures, 'a/(a|b|c)'), []);
    });

    it('should support regex ranges', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(not(fixtures, 'a/[b-c]'), ['a/a', 'a/x/y', 'a/x']);
      assert.deepEqual(not(fixtures, 'a/[a-z]'), ['a/x/y']);
    });

    it('should support globs (*)', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a'];
      assert.deepEqual(not(fixtures, 'a/*'), ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/a'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(not(fixtures, 'a/**'), []);
      assert.deepEqual(not(fixtures, 'a/**/*'), []);
      assert.deepEqual(not(fixtures, 'a/**/**/*'), []);
    });

    it('should support negation patterns', () => {
      const fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '!a/b'), ['a/b']);
      assert.deepEqual(not(fixtures, '!a/(b)'), ['a/b']);
      assert.deepEqual(not(fixtures, '!(a/b)'), ['a/b']);
    });
  });

  describe('windows paths', () => {
    it('should return an array of matches for a literal string', () => {
      const fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(not(fixtures, '(a/b)'), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(not(fixtures, 'a/b'), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(not(fixtures, 'a/(a|c)'), ['a/b']);
      assert.deepEqual(not(fixtures, 'a/(a|b|c)'), []);
    });

    it('should support regex ranges', () => {
      const format = str => str.replace(/\\/g, '/').replace(/^\.\//, '');
      const fixtures = ['.\\a\\a', 'a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y'];
      assert.deepEqual(not(fixtures, '[a-c]/[a-c]', { format }), ['a/x', 'a/x/y']);
      assert.deepEqual(not(fixtures, 'a/[b-c]', { format }), ['a/a', 'a/x', 'a/x/y']);
      assert.deepEqual(not(fixtures, 'a/[a-z]', { format }), ['a/x/y']);
    });

    it('should support globs (*)', () => {
      const format = str => str.replace(/\\/g, '/').replace(/^\.\//, '');
      const fixtures = ['a\\a', 'a/a', 'a\\b', '.\\a\\b', 'a\\c', 'a\\x', 'a\\a\\a', 'a\\a\\b', 'a\\a\\a\\a', 'a\\a\\a\\a\\a'];
      assert.deepEqual(not(fixtures, 'a/*', { format }), ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/a', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      const expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(not(fixtures, '*'), expected);
      assert.deepEqual(not(fixtures, '**'), []);
      assert.deepEqual(not(fixtures, '*/*'), ['a/x/y', 'a/x/y/z']);
      assert.deepEqual(not(fixtures, 'a/**'), []);
      assert.deepEqual(not(fixtures, 'a/x/**'), ['a/a', 'a/b', 'a/c']);
      assert.deepEqual(not(fixtures, 'a/**/*'), []);
      assert.deepEqual(not(fixtures, 'a/**/**/*'), []);
    });

    it('should support negation patterns', () => {
      const fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      const expected = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '!**'), expected);
      assert.deepEqual(not(fixtures, '!*/*'), expected);
      assert.deepEqual(not(fixtures, '!*'), []);
      assert.deepEqual(not(fixtures, '!a/b'), ['a/b']);
      assert.deepEqual(not(fixtures, '!a/(b)'), ['a/b']);
      assert.deepEqual(not(fixtures, '!(a/b)'), ['a/b']);
    });
  });
});

