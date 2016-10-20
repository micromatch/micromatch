'use strict';

var assert = require('assert');
var mm = require('..');

describe('.isMatch():', function() {
  describe('error handling:', function() {
    it('should throw on bad args', function() {
      assert.throws(function() {
        mm.isMatch({});
      }, /expected pattern to be a string or regex/);
    });
  });

  describe('matching:', function() {
    it('should escape plus signs to match string literals', function() {
      assert(mm.isMatch('a+b/src/glimini.js', 'a+b/src/*.js'));
      assert(mm.isMatch('+b/src/glimini.js', '+b/src/*.js'));
      assert(mm.isMatch('coffee+/src/glimini.js', 'coffee+/src/*.js'));
      assert(mm.isMatch('coffee+/src/glimini.js', 'coffee+/src/*.js'));
      assert(mm.isMatch('coffee+/src/glimini.js', 'coffee+/src/*'));
    });

    it('should not escape plus signs that follow brackets', function() {
      assert(mm.isMatch('a', '[a]+'));
      assert(mm.isMatch('aa', '[a]+'));
      assert(mm.isMatch('aaa', '[a]+'));
      assert(mm.isMatch('az', '[a-z]+'));
      assert(mm.isMatch('zzz', '[a-z]+'));
    });

    it('should support stars following brackets', function() {
      assert(mm.isMatch('a', '[a]*'));
      assert(mm.isMatch('aa', '[a]*'));
      assert(mm.isMatch('aaa', '[a]*'));
      assert(mm.isMatch('az', '[a-z]*'));
      assert(mm.isMatch('zzz', '[a-z]*'));
    });

    it('should not escape plus signs that follow parens', function() {
      assert(mm.isMatch('a', '(a)+'));
      assert(mm.isMatch('ab', '(a|b)+'));
      assert(mm.isMatch('aa', '(a)+'));
      assert(mm.isMatch('aaab', '(a|b)+'));
      assert(mm.isMatch('aaabbb', '(a|b)+'));
    });

    it('should support stars following parens', function() {
      assert(mm.isMatch('a', '(a)*'));
      assert(mm.isMatch('ab', '(a|b)*'));
      assert(mm.isMatch('aa', '(a)*'));
      assert(mm.isMatch('aaab', '(a|b)*'));
      assert(mm.isMatch('aaabbb', '(a|b)*'));
    });

    it('should not match slashes with single stars', function() {
      assert(!mm.isMatch('a/b', '(a)*'));
      assert(!mm.isMatch('a/b', '[a]*'));
      assert(!mm.isMatch('a/b', 'a*'));
      assert(!mm.isMatch('a/b', '(a|b)*'));
    });

    it('should not match dots with stars by default', function() {
      assert(!mm.isMatch('.a', '(a)*'));
      assert(!mm.isMatch('.a', '*[a]*'));
      assert(!mm.isMatch('.a', '*[a]'));
      assert(!mm.isMatch('.a', '*a*'));
      assert(!mm.isMatch('.a', '*a'));
      assert(!mm.isMatch('.a', '*(a|b)'));
    });

    it('should correctly deal with empty globs', function() {
      assert(!mm.isMatch('ab', ''));
      assert(!mm.isMatch('a', ''));
      assert(!mm.isMatch('.', ''));
    });

    it('should match with non-glob patterns', function() {
      assert(mm.isMatch('.', '.'));
      assert(mm.isMatch('/a', '/a'));
      assert(!mm.isMatch('/ab', '/a'));
      assert(mm.isMatch('a', 'a'));
      assert(!mm.isMatch('ab', '/a'));
      assert(!mm.isMatch('ab', 'a'));
      assert(mm.isMatch('ab', 'ab'));
      assert(!mm.isMatch('abcd', 'cd'));
      assert(!mm.isMatch('abcd', 'bc'));
      assert(!mm.isMatch('abcd', 'ab'));
    });

    it('should match file names', function() {
      assert(mm.isMatch('a.b', 'a.b'));
      assert(mm.isMatch('a.b', '*.b'));
      assert(mm.isMatch('a.b', 'a.*'));
      assert(mm.isMatch('a.b', '*.*'));
      assert(mm.isMatch('a-b.c-d', 'a*.c*'));
      assert(mm.isMatch('a-b.c-d', '*b.*d'));
      assert(mm.isMatch('a-b.c-d', '*.*'));
      assert(mm.isMatch('a-b.c-d', '*.*-*'));
      assert(mm.isMatch('a-b.c-d', '*-*.*-*'));
      assert(mm.isMatch('a-b.c-d', '*.c-*'));
      assert(mm.isMatch('a-b.c-d', '*.*-d'));
      assert(mm.isMatch('a-b.c-d', 'a-*.*-d'));
      assert(mm.isMatch('a-b.c-d', '*-b.c-*'));
      assert(mm.isMatch('a-b.c-d', '*-b*c-*'));

      // false
      assert(!mm.isMatch('a-b.c-d', '*-bc-*'));
    });

    it('should match with common glob patterns', function() {
      assert(mm.isMatch('/ab', '/*'));
      assert(mm.isMatch('/cd', '/*'));
      assert(!mm.isMatch('ef', '/*'));
      assert(mm.isMatch('ab', './*'));
      assert(mm.isMatch('ab/', './*/'));
      assert(!mm.isMatch('ab', './*/'));
      assert(mm.isMatch('ab', '*'));
      assert(mm.isMatch('ab', 'ab'));
    });

    it('should exactly match leading slash', function() {
      assert(!mm.isMatch('ef', '/*'));
      assert(mm.isMatch('/ef', '/*'));
    });

    it('should match files with the given extension', function() {
      assert(!mm.isMatch('.md', '*.md'));
      assert(mm.isMatch('.md', '.md'));
      assert(!mm.isMatch('.c.md', '*.md'));
      assert(mm.isMatch('.c.md', '.*.md'));
      assert(mm.isMatch('c.md', '*.md'));
      assert(mm.isMatch('c.md', '*.md'));
      assert(!mm.isMatch('a/b/c/c.md', '*.md'));
      assert(!mm.isMatch('a/b/c.md', 'a/*.md'));
      assert(mm.isMatch('a/b/c.md', 'a/*/*.md'));
      assert(mm.isMatch('a/b/c.md', '**/*.md'));
      assert(mm.isMatch('a/b/c.js', 'a/**/*.*'));
    });

    it('should match wildcards', function() {
      assert(!mm.isMatch('a/b/c/z.js', '*.js'));
      assert(!mm.isMatch('a/b/z.js', '*.js'));
      assert(!mm.isMatch('a/z.js', '*.js'));
      assert(mm.isMatch('z.js', '*.js'));

      assert(mm.isMatch('z.js', 'z*.js'));
      assert(mm.isMatch('a/z.js', 'a/z*.js'));
      assert(mm.isMatch('a/z.js', '*/z*.js'));
    });

    it('should match globstars', function() {
      assert(mm.isMatch('a/b/c/z.js', '**/*.js'));
      assert(mm.isMatch('a/b/z.js', '**/*.js'));
      assert(mm.isMatch('a/z.js', '**/*.js'));
      assert(mm.isMatch('a/b/c/d/e/z.js', 'a/b/**/*.js'));
      assert(mm.isMatch('a/b/c/d/z.js', 'a/b/**/*.js'));
      assert(mm.isMatch('a/b/c/z.js', 'a/b/c/**/*.js'));
      assert(mm.isMatch('a/b/c/z.js', 'a/b/c**/*.js'));
      assert(mm.isMatch('a/b/c/z.js', 'a/b/**/*.js'));
      assert(mm.isMatch('a/b/z.js', 'a/b/**/*.js'));

      assert(!mm.isMatch('a/z.js', 'a/b/**/*.js'));
      assert(!mm.isMatch('z.js', 'a/b/**/*.js'));

      // issue #23
      assert(!mm.isMatch('zzjs', 'z*.js'));
      assert(!mm.isMatch('zzjs', '*z.js'));

      // issue #24
      assert(mm.isMatch('a', '**'));
      assert(!mm.isMatch('a', 'a/**'));
      assert(mm.isMatch('a/', '**'));
      assert(mm.isMatch('a/b/c/d', '**'));
      assert(mm.isMatch('a/b/c/d/', '**'));
      assert(mm.isMatch('a/b/c/d/', '**/**'));
      assert(mm.isMatch('a/b/c/d/', '**/b/**'));
      assert(mm.isMatch('a/b/c/d/', 'a/b/**'));
      assert(mm.isMatch('a/b/c/d/', 'a/b/**/'));
      assert(mm.isMatch('a/b/c/d/', 'a/b/**/c/**/'));
      assert(mm.isMatch('a/b/c/d/', 'a/b/**/c/**/d/'));
      assert(!mm.isMatch('a/b/c/d/', 'a/b/**/f'));
      assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
      assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
      assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/c/**/d/*.*'));
      assert(mm.isMatch('a/b/c/d/e.f', 'a/b/**/d/**/*.*'));
      assert(mm.isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
      assert(mm.isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));

      // https://github.com/jonschlinkert/micromatch/issues/15
      assert(mm.isMatch('z.js', 'z*'));
      assert(mm.isMatch('z.js', '**/z*'));
      assert(mm.isMatch('z.js', '**/z*.js'));
      assert(mm.isMatch('z.js', '**/*.js'));
      assert(mm.isMatch('foo', '**/foo'));

      assert(mm.isMatch('a/b-c/z.js', 'a/b-*/**/z.js'));
      assert(mm.isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
    });

    it('should match slashes', function() {
      assert(!mm.isMatch('bar/baz/foo', '*/foo'));
      assert(!mm.isMatch('deep/foo/bar', '**/bar/*'));
      assert(!mm.isMatch('deep/foo/bar/baz/x', '*/bar/**'));
      assert(!mm.isMatch('foo', 'foo/**'));
      assert(!mm.isMatch('foo/bar', 'foo?bar'));
      assert(!mm.isMatch('foo/bar/baz', '**/bar*'));
      assert(!mm.isMatch('foo/bar/baz', '**/bar**'));
      assert(!mm.isMatch('foo/baz/bar', 'foo**bar'));
      assert(!mm.isMatch('foo/baz/bar', 'foo*bar'));
      assert(mm.isMatch('a/b/j/c/z/x.md', 'a/**/j/**/z/*.md'));
      assert(mm.isMatch('a/j/z/x.md', 'a/**/j/**/z/*.md'));
      assert(mm.isMatch('bar/baz/foo', '**/foo'));
      assert(mm.isMatch('deep/foo/bar/', '**/bar/**'));
      assert(mm.isMatch('deep/foo/bar/baz', '**/bar/*'));
      assert(mm.isMatch('deep/foo/bar/baz/', '**/bar/*'));
      assert(mm.isMatch('deep/foo/bar/baz/', '**/bar/**'));
      assert(mm.isMatch('deep/foo/bar/baz/x', '**/bar/*/*'));
      assert(mm.isMatch('foo/b/a/z/bar', 'foo/**/**/bar'));
      assert(mm.isMatch('foo/b/a/z/bar', 'foo/**/bar'));
      assert(mm.isMatch('foo/bar', 'foo/**/**/bar'));
      assert(mm.isMatch('foo/bar', 'foo/**/bar'));
      assert(mm.isMatch('foo/bar', 'foo[/]bar'));
      assert(mm.isMatch('foo/bar/baz/x', '*/bar/**'));
      assert(mm.isMatch('foo/baz/bar', 'foo/**/**/bar'));
      assert(mm.isMatch('foo/baz/bar', 'foo/**/bar'));
      assert(mm.isMatch('foobazbar', 'foo**bar'));
      assert(mm.isMatch('XXX/foo', '**/foo'));
    });

    it('question marks should not match slashes', function() {
      assert(!mm.isMatch('aaa/bbb', 'aaa?bbb'));
    });

    it('should not match dotfiles when `dot` or `dotfiles` are not set', function() {
      assert(!mm.isMatch('.c.md', '*.md'));
      assert(!mm.isMatch('a/.c.md', '*.md'));
      assert(mm.isMatch('a/.c.md', 'a/.c.md'));
      assert(!mm.isMatch('.a', '*.md'));
      assert(!mm.isMatch('.verb.txt', '*.md'));
      assert(mm.isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(mm.isMatch('.md', '.md'));
      assert(!mm.isMatch('.txt', '.md'));
      assert(mm.isMatch('.md', '.md'));
      assert(mm.isMatch('.a', '.a'));
      assert(mm.isMatch('.b', '.b*'));
      assert(mm.isMatch('.ab', '.a*'));
      assert(mm.isMatch('.ab', '.*'));
      assert(!mm.isMatch('.ab', '*.*'));
      assert(!mm.isMatch('.md', 'a/b/c/*.md'));
      assert(!mm.isMatch('.a.md', 'a/b/c/*.md'));
      assert(mm.isMatch('a/b/c/d.a.md', 'a/b/c/*.md'));
      assert(!mm.isMatch('a/b/d/.md', 'a/b/c/*.md'));
    });

    it('should match dotfiles when `dot` or `dotfiles` is set', function() {
      assert(mm.isMatch('.c.md', '*.md', {dot: true}));
      assert(mm.isMatch('.c.md', '.*', {dot: true}));
      assert(mm.isMatch('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}));
      assert(mm.isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}));
    });

    it('should match file paths', function() {
      assert(mm.isMatch('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(mm.isMatch('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.isMatch('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.isMatch('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.isMatch('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(mm.isMatch('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
    });

    it('should match full file paths', function() {
      assert(!mm.isMatch('a/.b', 'a/**/z/*.md'));
      assert(mm.isMatch('a/.b', 'a/.*'));
      assert(!mm.isMatch('a/b/z/.a', 'a/**/z/*.a'));
      assert(!mm.isMatch('a/b/z/.a', 'a/*/z/*.a'));
      assert(mm.isMatch('a/b/z/.a', 'a/*/z/.a'));
      assert(mm.isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.isMatch('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
      assert(!mm.isMatch('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md'));
    });

    it('should match paths with leading `./` when pattern has `./`', function() {
      assert(mm.isMatch('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/d/e/z/c.md', './a/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.isMatch('./a/b/z/.a', './a/**/z/.a'));
      // sanity checks
      assert(!mm.isMatch('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(!mm.isMatch('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md'));
    });

    it('should match paths with leading `./`', function() {
      assert(!mm.isMatch('./.a', '*.a'));
      assert(!mm.isMatch('./.a', './*.a'));
      assert(!mm.isMatch('./.a', 'a/**/z/*.md'));
      assert(!mm.isMatch('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(!mm.isMatch('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md'));
      assert(!mm.isMatch('a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.isMatch('./.a', './.a'));
      assert(mm.isMatch('./a/b/c.md', 'a/**/*.md'));
      assert(mm.isMatch('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/d/e/z/c.md', '**/*.md'));
      assert(mm.isMatch('./a/b/c/d/e/z/c.md', './a/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.isMatch('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md'));
      assert(mm.isMatch('./a/b/z/.a', './a/**/z/.a'));
      assert(mm.isMatch('./a/b/z/.a', 'a/**/z/.a'));
      assert(mm.isMatch('.a', './.a'));
      assert(mm.isMatch('a/b/c.md', './a/**/*.md'));
      assert(mm.isMatch('a/b/c.md', 'a/**/*.md'));
      assert(mm.isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.isMatch('a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md'));
    });
  });
});
