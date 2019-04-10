'use strict';

const path = require('path');
const sep = path.sep;
const assert = require('assert');
const { not } = require('..');

describe('.not()', () => {
  beforeEach(() => {
    path.sep = '\\';
  });
  afterEach(() => {
    path.sep = sep;
  });

  describe('posix paths', () => {
    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '(a/b)'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(not(fixtures, 'a/b'), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a/a', 'a/b', 'a/c'];
      assert.deepEqual(not(fixtures, 'a/(a|c)'), ['a/b']);
      assert.deepEqual(not(fixtures, 'a/(a|b|c)'), []);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      assert.deepEqual(not(fixtures, 'a/[b-c]'), ['a/a', 'a/x/y', 'a/x']);
      assert.deepEqual(not(fixtures, 'a/[a-z]'), ['a/x/y']);
    });

    it('should support globs (*)', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a'];
      assert.deepEqual(not(fixtures, 'a/*'), ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/a'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*/*'), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(not(fixtures, 'a/**'), []);
      assert.deepEqual(not(fixtures, 'a/**/*'), []);
      assert.deepEqual(not(fixtures, 'a/**/**/*'), []);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '!a/b'), ['a/b']);
      assert.deepEqual(not(fixtures, '!a/(b)'), ['a/b']);
      assert.deepEqual(not(fixtures, '!(a/b)'), ['a/b']);
    });
  });

  describe('windows paths', () => {
    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(not(fixtures, '(a/b)'), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(not(fixtures, 'a/b'), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(not(fixtures, 'a/(a|c)'), ['a/b']);
      assert.deepEqual(not(fixtures, 'a/(a|b|c)'), []);
    });

    it('should support regex ranges', () => {
      let format = str => str.replace(/\\/g, '/').replace(/^\.\//, '');
      let fixtures = ['.\\a\\a', 'a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y'];
      assert.deepEqual(not(fixtures, '[a-c]/[a-c]', { format }), ['a/x', 'a/x/y']);
      assert.deepEqual(not(fixtures, 'a/[b-c]', { format }), ['a/a', 'a/x', 'a/x/y']);
      assert.deepEqual(not(fixtures, 'a/[a-z]', { format }), ['a/x/y']);
    });

    it('should support globs (*)', () => {
      let format = str => str.replace(/\\/g, '/').replace(/^\.\//, '');
      let fixtures = ['a\\a', 'a/a', 'a\\b', '.\\a\\b', 'a\\c', 'a\\x', 'a\\a\\a', 'a\\a\\b', 'a\\a\\a\\a', 'a\\a\\a\\a\\a'];
      assert.deepEqual(not(fixtures, 'a/*', { format }), ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/a', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      assert.deepEqual(not(fixtures, 'a/*/*/*/*', { format }), ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      let expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(not(fixtures, '*'), expected);
      assert.deepEqual(not(fixtures, '**'), []);
      assert.deepEqual(not(fixtures, '*/*'), ['a/x/y', 'a/x/y/z']);
      assert.deepEqual(not(fixtures, 'a/**'), []);
      assert.deepEqual(not(fixtures, 'a/x/**'), ['a/a', 'a/b', 'a/c']);
      assert.deepEqual(not(fixtures, 'a/**/*'), []);
      assert.deepEqual(not(fixtures, 'a/**/**/*'), []);
    });

    it('should support negation patterns', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      let expected = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      assert.deepEqual(not(fixtures, '!**'), expected);
      assert.deepEqual(not(fixtures, '!*/*'), expected);
      assert.deepEqual(not(fixtures, '!*'), []);
      assert.deepEqual(not(fixtures, '!a/b'), ['a/b']);
      assert.deepEqual(not(fixtures, '!a/(b)'), ['a/b']);
      assert.deepEqual(not(fixtures, '!(a/b)'), ['a/b']);
    });
  });
});

