'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('special characters', function() {
  describe('regex', function() {
    it('should match common regex characters', function() {
      var fixtures = ['a c', 'a1c', 'a123c', 'a.c', 'a.xy.zc', 'a.zc', 'abbbbc', 'abbbc', 'abbc', 'abc', 'abq', 'axy zc', 'axy', 'axy.zc', 'axyzc', '^abc$'];

      mm(fixtures, 'ab?bc', ['abbbc']);
      mm(fixtures, 'ab*c', ['abbbbc', 'abbbc', 'abbc', 'abc']);
      mm(fixtures, 'ab+bc', ['abbbbc', 'abbbc', 'abbc']);
      mm(fixtures, '^abc$', ['^abc$']);
      mm(fixtures, 'a.c', ['a.c']);
      mm(fixtures, 'a.*c', ['a.c', 'a.xy.zc', 'a.zc']);
      mm(fixtures, 'a*c', ['a c', 'a.c', 'a1c', 'a123c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc', 'axy zc', 'axy.zc', 'a.xy.zc', 'a.zc']);
      mm(fixtures, 'a\\w+c', ['a1c', 'a123c', 'abbbbc', 'abbbc', 'abbc', 'abc', 'axyzc'], 'Should match word characters');
      mm(fixtures, 'a\\W+c', ['a.c', 'a c'], 'Should match non-word characters');
      mm(fixtures, 'a\\d+c', ['a1c', 'a123c'], 'Should match numbers');
      mm(['foo@#$%123ASD #$$%^&', 'foo!@#$asdfl;', '123'], '\\d+', ['123']);
      mm(['a123c', 'abbbc'], 'a\\D+c', ['abbbc'], 'Should match non-numbers');
      mm(['foo', ' foo '], '(f|o)+\\b', ['foo'], 'Should match word boundaries');
    });
  });

  describe('$ dollar signs', function() {
    it('should treat dollar signs as literal:', function() {
      assert(mm.isMatch('$', '$'));
      assert(mm.isMatch('$/foo', '$/*'));
      assert(mm.isMatch('$/foo', '$/*'));
      assert(mm.isMatch('foo$', '*$'));
      assert(mm.isMatch('$foo/foo', '$foo/*'));
      assert(mm.isMatch('foo$/foo', 'foo$/*'));
      assert(mm.isMatch('foo$/foo$', 'foo$/*'));
    });
  });

  describe('^ caret', function() {
    it('should treat caret as literal:', function() {
      assert(mm.isMatch('^', '^'));
      assert(mm.isMatch('^/foo', '^/*'));
      assert(mm.isMatch('^/foo', '^/*'));
      assert(mm.isMatch('foo^', '*^'));
      assert(mm.isMatch('^foo/foo', '^foo/*'));
      assert(mm.isMatch('foo^/foo', 'foo^/*'));
    });
  });

  describe('slashes', function() {
    it('should match forward slashes', function() {
      assert(mm.isMatch('/', '/'));
    });

    it('should match backslashes', function() {
      assert(mm.isMatch('\\', '[\\\\]'));
      assert(mm.isMatch('\\', '[\\\\]+'));
      assert(mm.isMatch('\\\\', '[\\\\]+'));
      assert(mm.isMatch('\\\\\\', '[\\\\]+'));
      mm(['\\'], '[\\\\]', ['\\']);
      mm(['\\', '\\\\', '\\\\\\'], '[\\\\]+', ['\\', '\\\\', '\\\\\\']);
    });
  });

  describe('colons and drive letters', function() {
    it('should treat common URL characters as literals', function() {
      assert(mm.isMatch(':', ':'));
      assert(mm.isMatch(':/foo', ':/*'));
      assert(mm.isMatch('D://foo', 'D://*'));
      assert(mm.isMatch('D://foo', 'D:\\/\\/*'));
      assert(mm.isMatch('D:\\/\\/foo', 'D:\\\\/\\\\/*'));
    });
  });

  describe('[ab] - brackets:', function() {
    it('should support regex character classes:', function() {
      mm(['a/b.md', 'a/c.md', 'a/d.md', 'a/E.md'], 'a/[A-Z].md', ['a/E.md']);
      mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/[bd].md', ['a/b.md', 'a/d.md']);
      mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-[2-4].md', ['a-2.md', 'a-3.md', 'a-4.md']);
      mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '[bc]/[bd].md', ['b/b.md', 'c/b.md']);
    });

    it('should handle unclosed brackets', function() {
      mm(['[!ab', '[ab'], '[!a*', ['[!ab']);
    });
  });

  describe('(a|b) - logical OR:', function() {
    it('should support regex logical OR:', function() {
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b'], '(a|b)/b', ['a/b', 'b/b']);
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'c/b'], '((a|b)|c)/b', ['a/b', 'b/b', 'c/b']);
      mm(['a/b.md', 'a/c.md', 'a/d.md'], 'a/(b|d).md', ['a/b.md', 'a/d.md']);
      mm(['a-1.md', 'a-2.md', 'a-3.md', 'a-4.md', 'a-5.md'], 'a-(2|3|4).md', ['a-2.md', 'a-3.md', 'a-4.md']);
      mm(['a/b.md', 'b/b.md', 'c/b.md', 'b/c.md', 'a/d.md'], '(b|c)/(b|d).md', ['b/b.md', 'c/b.md']);
    });
  });
});
