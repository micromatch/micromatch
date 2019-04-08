'use strict';

require('mocha');
const assert = require('assert');
const { isMatch } = require('..');

describe('stars', () => {
  describe('single stars', () => {
    it('should match using one consecutive star', () => {
      assert(!isMatch('a/b/c/z.js', '*.js'));
      assert(!isMatch('a/b/z.js', '*.js'));
      assert(!isMatch('a/z.js', '*.js'));
      assert(isMatch('a/z.js', '*/z*.js'));
      assert(isMatch('a/z.js', 'a/z*.js'));
      assert(isMatch('ab', '*'));
      assert(isMatch('abc', '*'));
      assert(isMatch('abc', '*c'));
      assert(isMatch('abc', 'a*'));
      assert(isMatch('abc', 'a*c'));
      assert(isMatch('abc', 'abc'));
      assert(isMatch('one abc two', '*abc*'));
      assert(isMatch('oneabctwo', '*abc*'));
      assert(isMatch('z.js', '*.js'));
      assert(isMatch('z.js', 'z*.js'));
    });

    it('should support multiple non-consecutive stars in a path segment', () => {
      assert(!isMatch('a-b.c-d', '*-bc-*'));
      assert(isMatch('a-b.c-d', '*-*.*-*'));
      assert(isMatch('a-b.c-d', '*-b*c-*'));
      assert(isMatch('a-b.c-d', '*-b.c-*'));
      assert(isMatch('a-b.c-d', '*.*'));
      assert(isMatch('a-b.c-d', '*.*-*'));
      assert(isMatch('a-b.c-d', '*.*-d'));
      assert(isMatch('a-b.c-d', '*.c-*'));
      assert(isMatch('a-b.c-d', '*b.*d'));
      assert(isMatch('a-b.c-d', 'a*.c*'));
      assert(isMatch('a-b.c-d', 'a-*.*-d'));
      assert(isMatch('a.b', '*.*'));
      assert(isMatch('a.b', '*.b'));
      assert(isMatch('a.b', 'a.*'));
      assert(isMatch('a.b', 'a.b'));
    });

    it('should support stars following brackets', () => {
      assert(isMatch('a', '[a]*'));
      assert(isMatch('aa', '[a]*'));
      assert(isMatch('aaa', '[a]*'));
      assert(isMatch('az', '[a-z]*'));
      assert(isMatch('zzz', '[a-z]*'));
    });

    it('should support stars following parens', () => {
      assert(isMatch('a', '(a)*'));
      assert(isMatch('ab', '(a|b)*'));
      assert(isMatch('aa', '(a)*'));
      assert(isMatch('aaab', '(a|b)*'));
      assert(isMatch('aaabbb', '(a|b)*'));
    });

    it('should not match slashes with single stars', () => {
      assert(!isMatch('a/b', '(a)*'));
      assert(!isMatch('a/b', '[a]*'));
      assert(!isMatch('a/b', 'a*'));
      assert(!isMatch('a/b', '(a|b)*'));
    });

    it('should return true when one of the given patterns matches the string', () => {
      assert(isMatch('/ab', '*/*'));
      assert(isMatch('.', '.'));
      assert(!isMatch('a/.b', 'a/'));
      assert(isMatch('/ab', '/*'));
      assert(isMatch('/ab', '/??'));
      assert(isMatch('/ab', '/?b'));
      assert(isMatch('/cd', '/*'));
      assert(isMatch('a', 'a'));
      assert(isMatch('a/.b', 'a/.*'));
      assert(isMatch('a/b', '?/?'));
      assert(isMatch('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
      assert(isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(isMatch('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(isMatch('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(isMatch('a/b/z/.a', 'a/*/z/.a'));
      assert(!isMatch('a/b/z/.a', 'bz'));
      assert(isMatch('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(isMatch('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(isMatch('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('aaa', '*'));
      assert(isMatch('ab', '*'));
      assert(isMatch('ab', './*'));
      assert(isMatch('ab', 'ab'));
      assert(isMatch('ab/', './*/'));
    });

    it('should return false when the path does not match the pattern', () => {
      assert(!isMatch('/ab', ['*/']));
      assert(!isMatch('/ab', ['*/a']));
      assert(!isMatch('/ab', ['/']));
      assert(!isMatch('/ab', ['/?']));
      assert(!isMatch('/ab', ['/a']));
      assert(!isMatch('/ab', ['?/?']));
      assert(!isMatch('/ab', ['a/*']));
      assert(!isMatch('a/.b', ['a/']));
      assert(!isMatch('a/b/c', ['a/*']));
      assert(!isMatch('a/b/c', ['a/b']));
      assert(!isMatch('a/b/c/d/e/z/c.md', ['b/c/d/e']));
      assert(!isMatch('a/b/z/.a', ['b/z']));
      assert(!isMatch('ab', ['*/*']));
      assert(!isMatch('ab', ['/a']));
      assert(!isMatch('ab', ['a']));
      assert(!isMatch('ab', ['b']));
      assert(!isMatch('ab', ['c']));
      assert(!isMatch('abcd', ['ab']));
      assert(!isMatch('abcd', ['bc']));
      assert(!isMatch('abcd', ['c']));
      assert(!isMatch('abcd', ['cd']));
      assert(!isMatch('abcd', ['d']));
      assert(!isMatch('abcd', ['f']));
      assert(!isMatch('ef', ['/*']));
    });

    it('should match a path segment for each single star', () => {
      assert(!isMatch('aaa', '*/*/*'));
      assert(!isMatch('aaa/bb/aa/rr', '*/*/*'));
      assert(!isMatch('aaa/bba/ccc', 'aaa*'));
      assert(!isMatch('aaa/bba/ccc', 'aaa**'));
      assert(!isMatch('aaa/bba/ccc', 'aaa/*'));
      assert(!isMatch('aaa/bba/ccc', 'aaa/*ccc'));
      assert(!isMatch('aaa/bba/ccc', 'aaa/*z'));
      assert(!isMatch('aaa/bbb', '*/*/*'));
      assert(!isMatch('ab/zzz/ejkl/hi', '*/*jk*/*i'));
      assert(isMatch('aaa/bba/ccc', '*/*/*'));
      assert(isMatch('aaa/bba/ccc', 'aaa/**'));
      assert(isMatch('aaa/bbb', 'aaa/*'));
      assert(isMatch('ab/zzz/ejkl/hi', '*/*z*/*/*i'));
      assert(isMatch('abzzzejklhi', '*j*i'));
    });

    it('should match any character besides "/" with a single "*"', () => {
      assert(isMatch('foo', 'f*'));
      assert(!isMatch('foo', 'b*'));
      assert(!isMatch('bar', 'f*'));
      assert(isMatch('bar', 'b*'));
    });

    it('should support single globs (*)', () => {
      assert(isMatch('a', '*'));
      assert(isMatch('b', '*'));
      assert(!isMatch('a/a', '*'));
      assert(!isMatch('a/a/a', '*'));
      assert(!isMatch('a/a/b', '*'));
      assert(!isMatch('a/a/a/a', '*'));
      assert(!isMatch('a/a/a/a/a', '*'));

      assert(!isMatch('a', '*/*'));
      assert(isMatch('a/a', '*/*'));
      assert(!isMatch('a/a/a', '*/*'));

      assert(!isMatch('a', '*/*/*'));
      assert(!isMatch('a/a', '*/*/*'));
      assert(isMatch('a/a/a', '*/*/*'));
      assert(!isMatch('a/a/a/a', '*/*/*'));

      assert(!isMatch('a', '*/*/*/*'));
      assert(!isMatch('a/a', '*/*/*/*'));
      assert(!isMatch('a/a/a', '*/*/*/*'));
      assert(isMatch('a/a/a/a', '*/*/*/*'));
      assert(!isMatch('a/a/a/a/a', '*/*/*/*'));

      assert(!isMatch('a', '*/*/*/*/*'));
      assert(!isMatch('a/a', '*/*/*/*/*'));
      assert(!isMatch('a/a/a', '*/*/*/*/*'));
      assert(!isMatch('a/a/b', '*/*/*/*/*'));
      assert(!isMatch('a/a/a/a', '*/*/*/*/*'));
      assert(isMatch('a/a/a/a/a', '*/*/*/*/*'));
      assert(!isMatch('a/a/a/a/a/a', '*/*/*/*/*'));

      assert(!isMatch('a', 'a/*'));
      assert(isMatch('a/a', 'a/*'));
      assert(!isMatch('a/a/a', 'a/*'));
      assert(!isMatch('a/a/a/a', 'a/*'));
      assert(!isMatch('a/a/a/a/a', 'a/*'));

      assert(!isMatch('a', 'a/*/*'));
      assert(!isMatch('a/a', 'a/*/*'));
      assert(isMatch('a/a/a', 'a/*/*'));
      assert(!isMatch('b/a/a', 'a/*/*'));
      assert(!isMatch('a/a/a/a', 'a/*/*'));
      assert(!isMatch('a/a/a/a/a', 'a/*/*'));

      assert(!isMatch('a', 'a/*/*/*'));
      assert(!isMatch('a/a', 'a/*/*/*'));
      assert(!isMatch('a/a/a', 'a/*/*/*'));
      assert(isMatch('a/a/a/a', 'a/*/*/*'));
      assert(!isMatch('a/a/a/a/a', 'a/*/*/*'));

      assert(!isMatch('a', 'a/*/*/*/*'));
      assert(!isMatch('a/a', 'a/*/*/*/*'));
      assert(!isMatch('a/a/a', 'a/*/*/*/*'));
      assert(!isMatch('a/a/b', 'a/*/*/*/*'));
      assert(!isMatch('a/a/a/a', 'a/*/*/*/*'));
      assert(isMatch('a/a/a/a/a', 'a/*/*/*/*'));

      assert(!isMatch('a', 'a/*/a'));
      assert(!isMatch('a/a', 'a/*/a'));
      assert(isMatch('a/a/a', 'a/*/a'));
      assert(!isMatch('a/a/b', 'a/*/a'));
      assert(!isMatch('a/a/a/a', 'a/*/a'));
      assert(!isMatch('a/a/a/a/a', 'a/*/a'));

      assert(!isMatch('a', 'a/*/b'));
      assert(!isMatch('a/a', 'a/*/b'));
      assert(!isMatch('a/a/a', 'a/*/b'));
      assert(isMatch('a/a/b', 'a/*/b'));
      assert(!isMatch('a/a/a/a', 'a/*/b'));
      assert(!isMatch('a/a/a/a/a', 'a/*/b'));
    });

    it('should only match a single folder per star when globstars are used', () => {
      assert(!isMatch('a', '*/**/a'));
      assert(!isMatch('a/a/b', '*/**/a'));
      assert(isMatch('a/a', '*/**/a'));
      assert(isMatch('a/a/a', '*/**/a'));
      assert(isMatch('a/a/a/a', '*/**/a'));
      assert(isMatch('a/a/a/a/a', '*/**/a'));
    });

    it('should optionally match a trailing slash when single star is last char', () => {
      assert(isMatch('a', '*'));
      assert(isMatch('a/', '*{,/}'));
      assert(!isMatch('a/a', '*'));
      assert(!isMatch('a/b', '*'));
      assert(!isMatch('a/c', '*'));
      assert(!isMatch('a/x', '*'));
      assert(!isMatch('a/x/y', '*'));
      assert(!isMatch('a/x/y/z', '*'));

      assert(!isMatch('a', '*/'));
      assert(isMatch('a/', '*/'));
      assert(!isMatch('a/a', '*/'));
      assert(!isMatch('a/b', '*/'));
      assert(!isMatch('a/c', '*/'));
      assert(!isMatch('a/x', '*/'));
      assert(!isMatch('a/x/y', '*/'));
      assert(!isMatch('a/x/y/z', '*/'));

      assert(!isMatch('a', '*/*'));
      assert(!isMatch('a/', '*/*'));
      assert(isMatch('a/a', '*/*'));
      assert(isMatch('a/b', '*/*'));
      assert(isMatch('a/c', '*/*'));
      assert(isMatch('a/x', '*/*'));
      assert(!isMatch('a/x/y', '*/*'));
      assert(!isMatch('a/x/y/z', '*/*'));

      assert(!isMatch('a', 'a/*'));
      assert(!isMatch('a/', 'a/*'));
      assert(isMatch('a/a', 'a/*'));
      assert(isMatch('a/b', 'a/*'));
      assert(isMatch('a/c', 'a/*'));
      assert(isMatch('a/x', 'a/*'));
      assert(!isMatch('a/x/y', 'a/*'));
      assert(!isMatch('a/x/y/z', 'a/*'));
    });

    it('should support globstars (**)', () => {
      assert(isMatch('a', '**'));
      assert(isMatch('a/', '**'));
      assert(isMatch('a/a', '**'));
      assert(isMatch('a/b', '**'));
      assert(isMatch('a/c', '**'));
      assert(isMatch('a/x', '**'));
      assert(isMatch('a/x/y', '**'));
      assert(isMatch('a/x/y/z', '**'));

      assert(!isMatch('a/', '**/a'));
      assert(!isMatch('a/b', '**/a'));
      assert(!isMatch('a/c', '**/a'));
      assert(!isMatch('a/x', '**/a'));
      assert(!isMatch('a/x/y', '**/a'));
      assert(!isMatch('a/x/y/z', '**/a'));
      assert(isMatch('a', '**/a'));
      assert(isMatch('a/a', '**/a'));

      assert(isMatch('a', 'a/**'));
      assert(isMatch('a/', 'a/**'));
      assert(isMatch('a/a', 'a/**'));
      assert(isMatch('a/b', 'a/**'));
      assert(isMatch('a/c', 'a/**'));
      assert(isMatch('a/x', 'a/**'));
      assert(isMatch('a/x/y', 'a/**'));
      assert(isMatch('a/x/y/z', 'a/**'));

      assert(!isMatch('a', 'a/**/*'));
      assert(!isMatch('a/', 'a/**/*'));
      assert(isMatch('a/a', 'a/**/*'));
      assert(isMatch('a/b', 'a/**/*'));
      assert(isMatch('a/c', 'a/**/*'));
      assert(isMatch('a/x', 'a/**/*'));
      assert(isMatch('a/x/y', 'a/**/*'));
      assert(isMatch('a/x/y/z', 'a/**/*'));

      assert(!isMatch('a', 'a/**/**/*'));
      assert(!isMatch('a/', 'a/**/**/*'));
      assert(isMatch('a/a', 'a/**/**/*'));
      assert(isMatch('a/b', 'a/**/**/*'));
      assert(isMatch('a/c', 'a/**/**/*'));
      assert(isMatch('a/x', 'a/**/**/*'));
      assert(isMatch('a/x/y', 'a/**/**/*'));
      assert(isMatch('a/x/y/z', 'a/**/**/*'));

      assert(!isMatch('a', 'a/**/**/**/*'));
      assert(!isMatch('a/', 'a/**/**/**/*'));
      assert(isMatch('a/a', 'a/**/**/**/*'));
      assert(isMatch('a/b', 'a/**/**/**/*'));
      assert(isMatch('a/c', 'a/**/**/**/*'));
      assert(isMatch('a/x', 'a/**/**/**/*'));
      assert(isMatch('a/x/y', 'a/**/**/**/*'));
      assert(isMatch('a/x/y/z', 'a/**/**/**/*'));

      assert(isMatch('a/b/foo/bar/baz.qux', 'a/b/**/bar/**/*.*'));
      assert(isMatch('a/b/bar/baz.qux', 'a/b/**/bar/**/*.*'));
    });

    it('should work with file extensions', () => {
      assert(!isMatch('a.txt', 'a/**/*.txt'));
      assert(isMatch('a/b.txt', 'a/**/*.txt'));
      assert(isMatch('a/x/y.txt', 'a/**/*.txt'));
      assert(!isMatch('a/x/y/z', 'a/**/*.txt'));

      assert(!isMatch('a.txt', 'a/*.txt'));
      assert(isMatch('a/b.txt', 'a/*.txt'));
      assert(!isMatch('a/x/y.txt', 'a/*.txt'));
      assert(!isMatch('a/x/y/z', 'a/*.txt'));

      assert(isMatch('a.txt', 'a*.txt'));
      assert(!isMatch('a/b.txt', 'a*.txt'));
      assert(!isMatch('a/x/y.txt', 'a*.txt'));
      assert(!isMatch('a/x/y/z', 'a*.txt'));

      assert(isMatch('a.txt', '*.txt'));
      assert(!isMatch('a/b.txt', '*.txt'));
      assert(!isMatch('a/x/y.txt', '*.txt'));
      assert(!isMatch('a/x/y/z', '*.txt'));
    });

    it('should correctly match slashes', () => {
      assert(!isMatch('a/a/bb', 'a/**/b'));
      assert(!isMatch('a/bb', 'a/**/b'));
      assert(!isMatch('foo', '*/**'));
      assert(!isMatch('foo/bar', '**/'));
      assert(!isMatch('foo/bar', '**/*/'));
      assert(!isMatch('foo/bar', '*/*/'));
      assert(!isMatch('foo/bar/', '**/*', { strictSlashes: true }));
      assert(isMatch('/home/foo/..', '**/..'));
      assert(isMatch('a/a', '*/**/a'));
      assert(isMatch('foo/', '*/**'));
      assert(isMatch('foo/bar', '**/*'));
      assert(isMatch('foo/bar', '*/*'));
      assert(isMatch('foo/bar', '*/**'));
      assert(isMatch('foo/bar/', '**/'));
      assert(isMatch('foo/bar/', '**/*'));
      assert(isMatch('foo/bar/', '**/*/'));
      assert(isMatch('foo/bar/', '*/**'));
      assert(isMatch('foo/bar/', '*/*/'));
    });

    it('should optionally match trailing slashes with braces', () => {
      assert(isMatch('foo', '**/*'));
      assert(isMatch('foo', '**/*{,/}'));
      assert(isMatch('foo/', '**/*{,/}'));
      assert(isMatch('foo/bar', '**/*{,/}'));
      assert(isMatch('foo/bar/', '**/*{,/}'));
    });
  });
});
