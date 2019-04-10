'use strict';

require('mocha');
const path = require('path');
const assert = require('assert');
const isWindows = () => process.platform === 'win32' || path.sep === '\\';
const mm = require('..');
const { isMatch, makeRe } = mm;

if (!process.env.ORIGINAL_PATH_SEP) {
  process.env.ORIGINAL_PATH_SEP = path.sep;
}

describe('special characters', () => {
  // See micromatch#127
  describe('unicode', () => {
    it('should match Japanese characters', () => {
      assert(isMatch('フォルダ/aaa.js', 'フ*/**/*'));
      assert(isMatch('フォルダ/aaa.js', 'フォ*/**/*'));
      assert(isMatch('フォルダ/aaa.js', 'フォル*/**/*'));
      assert(isMatch('フォルダ/aaa.js', 'フ*ル*/**/*'));
      assert(isMatch('フォルダ/aaa.js', 'フォルダ/**/*'));
    });
  });

  describe('regex', () => {
    it('should match common regex characters', () => {
      let fixtures = ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc', '^abc$'];

      assert.deepEqual(mm(fixtures, 'ab?bc'), ['abbbc']);
      assert.deepEqual(mm(fixtures, 'ab*c'), ['abbbbc', 'abbbc', 'abbc', 'abc']);
      assert.deepEqual(mm(fixtures, '^abc$'), ['^abc$']);
      assert.deepEqual(mm(fixtures, 'a.c'), ['a.c']);
      assert.deepEqual(mm(fixtures, 'a.*c'), ['a.c', 'a.xy.zc', 'a.zc']);
      assert.deepEqual(mm(fixtures, 'a*c'), ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axy zc', 'axy.zc', 'axyzc']);
      assert.deepEqual(mm(fixtures, 'a(\\w)+c'), ['a1c', 'a123c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc'], 'Should match word characters');
      assert.deepEqual(mm(fixtures, 'a(\\W)+c'), ['a c', 'a.c'], 'Should match non-word characters');
      assert.deepEqual(mm(fixtures, 'a(\\d)+c'), ['a1c', 'a123c'], 'Should match numbers');
      assert.deepEqual(mm(['foo@#$%123ASD #$$%^&', 'foo!@#$asdfl;', '123'], '(\\d)+'), ['123']);
      assert.deepEqual(mm(['a123c', 'abbbc'], 'a(\\D)+c'), ['abbbc'], 'Should match non-numbers');
      assert.deepEqual(mm(['foo', ' foo '], '(f|o)+\\b'), ['foo'], 'Should match word boundaries');
    });
  });

  describe('slashes', () => {
    it('should match forward slashes', () => {
      assert(mm.isMatch('/', '/'));
    });

    it('should match backslashes', () => {
      assert(mm.isMatch('\\', '[\\\\/]'));
      assert(mm.isMatch('\\', '[\\\\/]+'));
      assert(mm.isMatch('\\\\', '[\\\\/]+'));
      assert(mm.isMatch('\\\\\\', '[\\\\/]+'));

      if (isWindows()) {
        mm(['\\'], '[\\\\/]', ['/']);
        mm(['\\', '\\\\', '\\\\\\'], '[\\\\/]+', ['/']);
      } else {
        mm(['\\'], '[\\\\/]', ['\\']);
        mm(['\\', '\\\\', '\\\\\\'], '[\\\\/]+', ['\\', '\\\\', '\\\\\\']);
      }

      path.sep = '\\';
      assert(mm.isMatch('\\', '[\\\\/]'));
      assert(mm.isMatch('\\', '[\\\\/]+'));
      assert(mm.isMatch('\\\\', '[\\\\/]+'));
      assert(mm.isMatch('\\\\\\', '[\\\\/]+'));
      mm(['\\'], '[\\\\/]', ['/']);
      mm(['\\', '\\\\', '\\\\\\'], '[\\\\/]+', ['/']);
      path.sep = process.env.ORIGINAL_PATH_SEP;
    });
  });

  describe('colons and drive letters', () => {
    it('should treat common URL characters as literals', () => {
      assert(mm.isMatch(':', ':'));
      assert(mm.isMatch(':/foo', ':/*'));
      assert(mm.isMatch('D://foo', 'D://*'));
      assert(mm.isMatch('D://foo', 'D:\\/\\/*'));
    });
  });

  describe('[ab] - brackets:', () => {
    it('should support regex character classes:', () => {
      assert.deepEqual(mm(['a/b.md', 'a/c.md', 'a/d.md', 'a/E.md'], 'a/[A-Z].md'), ['a/E.md']);
      assert.deepEqual(mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/[bd].md'), ['a/b.md', 'a/d.md']);
      assert.deepEqual(mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-[2-4].md'), ['a-2.md', 'a-3.md', 'a-4.md']);
      assert.deepEqual(mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '[bc]/[bd].md'), ['b/b.md', 'c/b.md']);
    });

    it('should handle brackets', () => {
      assert.deepEqual(mm(['ab', 'ac', 'ad', 'a*', '*'], '[a*]*', { regex: true }), ['a*', '*']);
      assert.deepEqual(mm(['ab', 'ac', 'ad', 'a*', '*'], '[a*]*'), ['ab', 'ac', 'ad', 'a*', '*']);
    });

    it('should handle unclosed brackets', () => {
      assert.deepEqual(mm(['[!ab', '[ab'], '[!a*'), ['[!ab']);
    });
  });

  describe('(a|b) - logical OR:', () => {
    it('should support regex logical OR:', () => {
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b'], '(a|b)/b'), ['a/b', 'b/b']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'c/b'], '((a|b)|c)/b'), ['a/b', 'b/b', 'c/b']);
      assert.deepEqual(mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/(b|d).md'), ['a/b.md', 'a/d.md']);
      assert.deepEqual(mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-(2|3|4).md'), ['a-2.md', 'a-3.md', 'a-4.md']);
      assert.deepEqual(mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '(b|c)/(b|d).md'), ['b/b.md', 'c/b.md']);
    });
  });

  describe('dollar $', () => {
    it('should match dollar signs', () => {
      assert(!isMatch('$', '!($)'));
      assert(!isMatch('$', '!$'));
      assert(isMatch('$$', '!$'));
      assert(isMatch('$$', '!($)'));
      assert(isMatch('$$$', '!($)'));
      assert(isMatch('^', '!($)'));

      assert(isMatch('$', '!($$)'));
      assert(!isMatch('$$', '!($$)'));
      assert(isMatch('$$$', '!($$)'));
      assert(isMatch('^', '!($$)'));

      assert(!isMatch('$', '!($*)'));
      assert(!isMatch('$$', '!($*)'));
      assert(!isMatch('$$$', '!($*)'));
      assert(isMatch('^', '!($*)'));

      assert(isMatch('$', '*'));
      assert(isMatch('$$', '*'));
      assert(isMatch('$$$', '*'));
      assert(isMatch('^', '*'));

      assert(isMatch('$', '$*'));
      assert(isMatch('$$', '$*'));
      assert(isMatch('$$$', '$*'));
      assert(!isMatch('^', '$*'));

      assert(isMatch('$', '*$*'));
      assert(isMatch('$$', '*$*'));
      assert(isMatch('$$$', '*$*'));
      assert(!isMatch('^', '*$*'));

      assert(isMatch('$', '*$'));
      assert(isMatch('$$', '*$'));
      assert(isMatch('$$$', '*$'));
      assert(!isMatch('^', '*$'));

      assert(!isMatch('$', '?$'));
      assert(isMatch('$$', '?$'));
      assert(!isMatch('$$$', '?$'));
      assert(!isMatch('^', '?$'));
    });
  });

  describe('caret ^', () => {
    it('should match carets', () => {
      assert(isMatch('^', '^'));
      assert(isMatch('^/foo', '^/*'));
      assert(isMatch('^/foo', '^/*'));
      assert(isMatch('foo^', '*^'));
      assert(isMatch('^foo/foo', '^foo/*'));
      assert(isMatch('foo^/foo', 'foo^/*'));

      assert(!isMatch('^', '!(^)'));
      assert(isMatch('^^', '!(^)'));
      assert(isMatch('^^^', '!(^)'));
      assert(isMatch('&', '!(^)'));

      assert(isMatch('^', '!(^^)'));
      assert(!isMatch('^^', '!(^^)'));
      assert(isMatch('^^^', '!(^^)'));
      assert(isMatch('&', '!(^^)'));

      assert(!isMatch('^', '!(^*)'));
      assert(!isMatch('^^', '!(^*)'));
      assert(!isMatch('^^^', '!(^*)'));
      assert(isMatch('&', '!(^*)'));

      assert(isMatch('^', '*'));
      assert(isMatch('^^', '*'));
      assert(isMatch('^^^', '*'));
      assert(isMatch('&', '*'));

      assert(isMatch('^', '^*'));
      assert(isMatch('^^', '^*'));
      assert(isMatch('^^^', '^*'));
      assert(!isMatch('&', '^*'));

      assert(isMatch('^', '*^*'));
      assert(isMatch('^^', '*^*'));
      assert(isMatch('^^^', '*^*'));
      assert(!isMatch('&', '*^*'));

      assert(isMatch('^', '*^'));
      assert(isMatch('^^', '*^'));
      assert(isMatch('^^^', '*^'));
      assert(!isMatch('&', '*^'));

      assert(!isMatch('^', '?^'));
      assert(isMatch('^^', '?^'));
      assert(!isMatch('^^^', '?^'));
      assert(!isMatch('&', '?^'));
    });
  });
});
