'use strict';

const assert = require('assert');
const { isMatch, any } = require('..');

describe('.isMatch():', () => {
  describe('error handling:', () => {
    it('should throw on bad args', () => {
      assert.throws(() => isMatch({}), /Expected/i);
    });
  });

  describe('alias:', () => {
    it('should have the alias .any(...)', () => {
      assert.strictEqual(isMatch, any);
    });
  });

  describe('matching:', () => {
    it('should escape plus signs to match string literals', () => {
      assert(isMatch('a+b/src/glimini.js', 'a+b/src/*.js'));
      assert(isMatch('+b/src/glimini.js', '+b/src/*.js'));
      assert(isMatch('coffee+/src/glimini.js', 'coffee+/src/*.js'));
      assert(isMatch('coffee+/src/glimini.js', 'coffee+/src/*.js'));
      assert(isMatch('coffee+/src/glimini.js', 'coffee+/src/*'));
    });

    it('should not escape plus signs that follow brackets', () => {
      assert(isMatch('a', '[a]+'));
      assert(isMatch('aa', '[a]+'));
      assert(isMatch('aaa', '[a]+'));
      assert(isMatch('az', '[a-z]+'));
      assert(isMatch('zzz', '[a-z]+'));
    });

    it('should support stars following brackets', () => {
      assert(isMatch('a', '[a]*'));
      assert(isMatch('aa', '[a]*'));
      assert(isMatch('aaa', '[a]*'));
      assert(isMatch('az', '[a-z]*'));
      assert(isMatch('zzz', '[a-z]*'));
    });

    it('should not escape plus signs that follow parens', () => {
      assert(isMatch('a', '(a)+'));
      assert(isMatch('ab', '(a|b)+'));
      assert(isMatch('aa', '(a)+'));
      assert(isMatch('aaab', '(a|b)+'));
      assert(isMatch('aaabbb', '(a|b)+'));
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

    it('should not match dots with stars by default', () => {
      assert(!isMatch('.a', '(a)*'));
      assert(!isMatch('.a', '*[a]*'));
      assert(!isMatch('.a', '*[a]'));
      assert(!isMatch('.a', '*a*'));
      assert(!isMatch('.a', '*a'));
      assert(!isMatch('.a', '*(a|b)'));
    });

    it('should match with non-glob patterns', () => {
      assert(isMatch('.', '.'));
      assert(isMatch('/a', '/a'));
      assert(!isMatch('/ab', '/a'));
      assert(isMatch('a', 'a'));
      assert(!isMatch('ab', '/a'));
      assert(!isMatch('ab', 'a'));
      assert(isMatch('ab', 'ab'));
      assert(!isMatch('abcd', 'cd'));
      assert(!isMatch('abcd', 'bc'));
      assert(!isMatch('abcd', 'ab'));
    });

    it('should match non-leading dots', () => {
      assert(isMatch('a.b', 'a.b'));
      assert(isMatch('a.b', '*.b'));
      assert(isMatch('a.b', 'a.*'));
      assert(isMatch('a.b', '*.*'));
      assert(isMatch('a-b.c-d', 'a*.c*'));
      assert(isMatch('a-b.c-d', '*b.*d'));
      assert(isMatch('a-b.c-d', '*.*'));
      assert(isMatch('a-b.c-d', '*.*-*'));
      assert(isMatch('a-b.c-d', '*-*.*-*'));
      assert(isMatch('a-b.c-d', '*.c-*'));
      assert(isMatch('a-b.c-d', '*.*-d'));
      assert(isMatch('a-b.c-d', 'a-*.*-d'));
      assert(isMatch('a-b.c-d', '*-b.c-*'));
      assert(isMatch('a-b.c-d', '*-b*c-*'));

      // false
      assert(!isMatch('a-b.c-d', '*-bc-*'));
    });

    it('should match with common glob patterns', () => {
      assert(!isMatch('/ab', './*/'));
      assert(!isMatch('/ef', '*'));
      assert(!isMatch('ab', './*/'));
      assert(!isMatch('ef', '/*'));
      assert(isMatch('/ab', '/*'));
      assert(isMatch('/cd', '/*'));
      assert(isMatch('ab', '*'));
      assert(isMatch('ab', './*'));
      assert(isMatch('ab', 'ab'));
      assert(isMatch('ab/', './*/'));
    });

    it('should exactly match leading slash', () => {
      assert(!isMatch('ef', '/*'));
      assert(isMatch('/ef', '/*'));
    });

    it('should match files with the given extension', () => {
      assert(!isMatch('.c.md', '*.md'));
      assert(!isMatch('.md', '*.md'));
      assert(!isMatch('a/b/c.md', 'a/*.md'));
      assert(!isMatch('a/b/c/c.md', '*.md'));
      assert(isMatch('.c.md', '.*.md'));
      assert(isMatch('.md', '.md'));
      assert(isMatch('a/b/c.js', 'a/**/*.*'));
      assert(isMatch('a/b/c.md', '**/*.md'));
      assert(isMatch('a/b/c.md', 'a/*/*.md'));
      assert(isMatch('c.md', '*.md'));
      assert(isMatch('c.md', '*.md'));
    });

    it('should match wildcards', () => {
      assert(!isMatch('a/b/c/z.js', '*.js'));
      assert(!isMatch('a/b/z.js', '*.js'));
      assert(!isMatch('a/z.js', '*.js'));
      assert(isMatch('z.js', '*.js'));

      assert(isMatch('z.js', 'z*.js'));
      assert(isMatch('a/z.js', 'a/z*.js'));
      assert(isMatch('a/z.js', '*/z*.js'));
      assert(isMatch('a/b', 'a/b*'));
      assert(isMatch('a/b', 'a/b*', { dot: true }));
    });

    it('should match globstars', () => {
      assert(isMatch('a/b/c/z.js', '**/*.js'));
      assert(isMatch('a/b/z.js', '**/*.js'));
      assert(isMatch('a/z.js', '**/*.js'));
      assert(isMatch('a/b/c/d/e/z.js', 'a/b/**/*.js'));
      assert(isMatch('a/b/c/d/z.js', 'a/b/**/*.js'));
      assert(isMatch('a/b/c/z.js', 'a/b/c/**/*.js'));
      assert(isMatch('a/b/c/z.js', 'a/b/c**/*.js'));
      assert(isMatch('a/b/c/z.js', 'a/b/**/*.js'));
      assert(isMatch('a/b/z.js', 'a/b/**/*.js'));

      assert(!isMatch('a/z.js', 'a/b/**/*.js'));
      assert(!isMatch('z.js', 'a/b/**/*.js'));

      // https://github.com/micromatch/micromatch/issues/15
      assert(isMatch('z.js', 'z*'));
      assert(isMatch('z.js', '**/z*'));
      assert(isMatch('z.js', '**/z*.js'));
      assert(isMatch('z.js', '**/*.js'));
      assert(isMatch('foo', '**/foo'));
    });

    it('issue #23', () => {
      assert(!isMatch('zzjs', 'z*.js'));
      assert(!isMatch('zzjs', '*z.js'));
    });

    it('issue #24', () => {
      assert(isMatch('a', '**'));
      assert(isMatch('a', 'a/**'));
      assert(isMatch('a/', '**'));
      assert(isMatch('a/b/c/d', '**'));
      assert(isMatch('a/b/c/d/', '**'));
      assert(isMatch('a/b/c/d/', '**/**'));
      assert(isMatch('a/b/c/d/', '**/b/**'));
      assert(isMatch('a/b/c/d/', 'a/b/**'));
      assert(isMatch('a/b/c/d/', 'a/b/**/'));
      assert(isMatch('a/b/c/d/', 'a/b/**/c/**/'));
      assert(isMatch('a/b/c/d/', 'a/b/**/c/**/d/'));
      assert(!isMatch('a/b/c/d/', 'a/b/**/f'));
      assert(isMatch('a/b/c/d/e.f', 'a/b/**/**/*.*'));
      assert(isMatch('a/b/c/d/e.f', 'a/b/**/*.*'));
      assert(isMatch('a/b/c/d/e.f', 'a/b/**/c/**/d/*.*'));
      assert(isMatch('a/b/c/d/e.f', 'a/b/**/d/**/*.*'));
      assert(isMatch('a/b/c/d/g/e.f', 'a/b/**/d/**/*.*'));
      assert(isMatch('a/b/c/d/g/g/e.f', 'a/b/**/d/**/*.*'));
      assert(isMatch('a/b-c/z.js', 'a/b-*/**/z.js'));
      assert(isMatch('a/b-c/d/e/z.js', 'a/b-*/**/z.js'));
    });

    it('should match slashes', () => {
      assert(!isMatch('bar/baz/foo', '*/foo'));
      assert(!isMatch('deep/foo/bar', '**/bar/*'));
      assert(!isMatch('deep/foo/bar/baz/x', '*/bar/**'));
      assert(!isMatch('foo/bar', 'foo?bar'));
      assert(!isMatch('foo/bar/baz', '**/bar*'));
      assert(!isMatch('foo/bar/baz', '**/bar**'));
      assert(!isMatch('foo/baz/bar', 'foo**bar'));
      assert(!isMatch('foo/baz/bar', 'foo*bar'));
      assert(isMatch('foo', 'foo/**'));
      assert(isMatch('a/b/j/c/z/x.md', 'a/**/j/**/z/*.md'));
      assert(isMatch('a/j/z/x.md', 'a/**/j/**/z/*.md'));
      assert(isMatch('bar/baz/foo', '**/foo'));
      assert(isMatch('deep/foo/bar/', '**/bar/**'));
      assert(isMatch('deep/foo/bar/baz', '**/bar/*'));
      assert(isMatch('deep/foo/bar/baz/', '**/bar/*/'));
      assert(isMatch('deep/foo/bar/baz/', '**/bar/**'));
      assert(isMatch('deep/foo/bar/baz/x', '**/bar/*/*'));
      assert(isMatch('foo/b/a/z/bar', 'foo/**/**/bar'));
      assert(isMatch('foo/b/a/z/bar', 'foo/**/bar'));
      assert(isMatch('foo/bar', 'foo/**/**/bar'));
      assert(isMatch('foo/bar', 'foo/**/bar'));
      assert(isMatch('foo/bar', 'foo[/]bar'));
      assert(isMatch('foo/bar/baz/x', '*/bar/**'));
      assert(isMatch('foo/baz/bar', 'foo/**/**/bar'));
      assert(isMatch('foo/baz/bar', 'foo/**/bar'));
      assert(isMatch('foobazbar', 'foo**bar'));
      assert(isMatch('XXX/foo', '**/foo'));

      // https://github.com/micromatch/micromatch/issues/89
      assert(isMatch('foo//baz.md', 'foo//baz.md'));
      assert(isMatch('foo//baz.md', 'foo//*baz.md'));
      assert(!isMatch('foo//baz.md', 'foo/baz.md'));
      assert(!isMatch('foo/baz.md', 'foo//baz.md'));
    });

    it('question marks should not match slashes', () => {
      assert(!isMatch('aaa/bbb', 'aaa?bbb'));
    });

    it('should not match dotfiles when `dot` or `dotfiles` are not set', () => {
      assert(!isMatch('.c.md', '*.md'));
      assert(!isMatch('a/.c.md', '*.md'));
      assert(isMatch('a/.c.md', 'a/.c.md'));
      assert(!isMatch('.a', '*.md'));
      assert(!isMatch('.verb.txt', '*.md'));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(isMatch('.md', '.md'));
      assert(!isMatch('.txt', '.md'));
      assert(isMatch('.md', '.md'));
      assert(isMatch('.a', '.a'));
      assert(isMatch('.b', '.b*'));
      assert(isMatch('.ab', '.a*'));
      assert(isMatch('.ab', '.*'));
      assert(!isMatch('.ab', '*.*'));
      assert(!isMatch('.md', 'a/b/c/*.md'));
      assert(!isMatch('.a.md', 'a/b/c/*.md'));
      assert(isMatch('a/b/c/d.a.md', 'a/b/c/*.md'));
      assert(!isMatch('a/b/d/.md', 'a/b/c/*.md'));
    });

    it('should match dotfiles when `dot` or `dotfiles` is set', () => {
      assert(isMatch('.c.md', '*.md', { dot: true }));
      assert(isMatch('.c.md', '.*', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/*.md', { dot: true }));
    });

    it('should match file paths', () => {
      assert(isMatch('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(isMatch('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(isMatch('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
    });

    it('should match full file paths', () => {
      assert(!isMatch('a/.b', 'a/**/z/*.md'));
      assert(isMatch('a/.b', 'a/.*'));
      assert(!isMatch('a/b/z/.a', 'a/**/z/*.a'));
      assert(!isMatch('a/b/z/.a', 'a/*/z/*.a'));
      assert(isMatch('a/b/z/.a', 'a/*/z/.a'));
      assert(isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(isMatch('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
      assert(!isMatch('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md'));
    });

    it('should match paths with leading `./` when pattern has `./`', () => {
      let format = str => str.replace(/^\.\//, '');
      assert(isMatch('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', './a/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/z/.a', './a/**/z/.a', { format }));
      assert(!isMatch('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(!isMatch('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md', { format }));
    });

    it('should match paths with leading `./`', () => {
      let format = str => str.replace(/^\.\//, '');
      assert(!isMatch('./.a', '*.a', { format }));
      assert(!isMatch('./.a', './*.a', { format }));
      assert(!isMatch('./.a', 'a/**/z/*.md', { format }));
      assert(!isMatch('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(!isMatch('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md', { format }));
      assert(!isMatch('a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./.a', './.a', { format }));
      assert(isMatch('./a/b/c.md', 'a/**/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', '**/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', './a/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', 'a/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/j/e/z/c.md', '?(./)a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/z/.a', './a/**/z/.a', { format }));
      assert(isMatch('./a/b/z/.a', '?(./)a/**/z/.a', { format }));
      assert(isMatch('.a', './.a', { format }));
      assert(isMatch('a/b/c.md', './a/**/*.md', { format }));
      assert(isMatch('a/b/c.md', 'a/**/*.md', { format }));
      assert(isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md', { format }));
      assert(isMatch('a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md', { format }));
    });
  });

  describe('errors', () => {
    it('should throw an error when value is not a string', () => {
      assert.throws(() => isMatch());
    });
  });

  describe('empty patterns', () => {
    it('should throw an error when empty patterns are defined', () => {
      assert.throws(() => isMatch('', ''));
      assert.throws(() => isMatch('', ['']));
      assert.throws(() => isMatch('.', ''));
      assert.throws(() => isMatch('.', ['']));
      assert.throws(() => isMatch('a', ''));
      assert.throws(() => isMatch('a', ['']));
      assert.throws(() => isMatch('ab', ''));
      assert.throws(() => isMatch('ab', ['']));
      assert.throws(() => isMatch('./', ''));
      assert.throws(() => isMatch('./', ['']));
    });
  });

  describe('non-globs', () => {
    it('should match literal paths', () => {
      assert(!isMatch('aaa', 'aa'));
      assert(isMatch('aaa', 'aaa'));
      assert(isMatch('aaa', ['aa', 'aaa']));
      assert(isMatch('aaa/bbb', 'aaa/bbb'));
      assert(isMatch('aaa/bbb', 'aaa[/]bbb'));
      assert(isMatch('aaa/bbb', ['aaa\\bbb', 'aaa/bbb']));
      assert(isMatch('aaa\\bbb', ['aaa\\bbb', 'aaa/bbb']));
    });
  });

  describe('dots', () => {
    it('should match a dots with dots in the pattern', () => {
      assert(isMatch('.', '.'));
    });
  });

  describe('stars (single pattern)', () => {
    it('should return true when one of the given patterns matches the string', () => {
      assert(!isMatch('a/.b', 'a/'));
      assert(!isMatch('a/b/c/d/e/z/c.md', 'b/c/d/e'));
      assert(!isMatch('a/b/z/.a', 'b/z'));
      assert(isMatch('/ab', '*/*'));
      assert(isMatch('/ab', '*/*'));
      assert(isMatch('/ab', '/*'));
      assert(isMatch('/cd', '/*'));
      assert(isMatch('a', 'a'));
      assert(isMatch('a/.b', 'a/.*'));
      assert(isMatch('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
      assert(isMatch('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(isMatch('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(isMatch('a/b/c/xyz.md', ['foo', 'a/b/c/*.md']));
      assert(isMatch('a/b/z/.a', 'a/*/z/.a'));
      assert(isMatch('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(isMatch('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(isMatch('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(isMatch('aaa', ['foo', '*']));
      assert(isMatch('ab', '*'));
      assert(isMatch('ab', './*'));
      assert(isMatch('ab', 'ab'));
      assert(isMatch('ab/', './*/'));
    });

    it('should return false when the path does not match the pattern', () => {
      assert(!isMatch('ab/', '*/*'));
      assert(!isMatch('/ab', '*/'));
      assert(!isMatch('/ab', '*/a'));
      assert(!isMatch('/ab', '/'));
      assert(!isMatch('/ab', '/a'));
      assert(!isMatch('/ab', 'a/*'));
      assert(!isMatch('a/.b', 'a/'));
      assert(!isMatch('a/b/c', 'a/*'));
      assert(!isMatch('a/b/c', 'a/b'));
      assert(!isMatch('a/b/c/d/e/z/c.md', 'b/c/d/e'));
      assert(!isMatch('a/b/z/.a', 'b/z'));
      assert(!isMatch('ab', '*/*'));
      assert(!isMatch('ab', '/a'));
      assert(!isMatch('ab', 'a'));
      assert(!isMatch('ab', 'b'));
      assert(!isMatch('ab', 'c'));
      assert(!isMatch('abcd', 'ab'));
      assert(!isMatch('abcd', 'bc'));
      assert(!isMatch('abcd', 'c'));
      assert(!isMatch('abcd', 'cd'));
      assert(!isMatch('abcd', 'd'));
      assert(!isMatch('abcd', 'f'));
      assert(!isMatch('ef', '/*'));
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

    it('should regard non-exclusive double-stars as single stars', () => {
      assert(!isMatch('aaa/bba/ccc', 'aaa/**ccc'));
      assert(!isMatch('aaa/bba/ccc', 'aaa/**z'));
    });

    it('should return false when full file paths are not matched', () => {
      assert(!isMatch('a/b/z/.a', 'a/**/z/*.a'));
      assert(!isMatch('a/b/z/.a', 'a/*/z/*.a'));
      assert(!isMatch('a/.b', 'a/**/z/*.md'));
      assert(!isMatch('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md'));
      assert(!isMatch('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
      assert(!isMatch('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
      assert(!isMatch('a/b/z/.a', 'b/a'));
    });
  });

  describe('stars (multiple patterns)', () => {
    it('should return true when any of the patterns match', () => {
      assert(isMatch('.', ['.', 'foo']));
      assert(isMatch('a', ['a', 'foo']));
      assert(isMatch('ab', ['*', 'foo', 'bar']));
      assert(isMatch('ab', ['*b', 'foo', 'bar']));
      assert(isMatch('ab', ['./*', 'foo', 'bar']));
      assert(isMatch('ab', ['a*', 'foo', 'bar']));
      assert(isMatch('ab', ['ab', 'foo']));
    });

    it('should return false when none of the patterns match', () => {
      assert(!isMatch('/ab', ['/a', 'foo']));
      assert(!isMatch('a/b/c', ['a/b', 'foo']));
      assert(!isMatch('ab', ['*/*', 'foo', 'bar']));
      assert(!isMatch('ab', ['/a', 'foo', 'bar']));
      assert(!isMatch('ab', ['a', 'foo']));
      assert(!isMatch('ab', ['b', 'foo']));
      assert(!isMatch('ab', ['c', 'foo', 'bar']));
      assert(!isMatch('abcd', ['ab', 'foo']));
      assert(!isMatch('abcd', ['bc', 'foo']));
      assert(!isMatch('abcd', ['c', 'foo']));
      assert(!isMatch('abcd', ['cd', 'foo']));
      assert(!isMatch('abcd', ['d', 'foo']));
      assert(!isMatch('abcd', ['f', 'foo', 'bar']));
      assert(!isMatch('ef', ['/*', 'foo', 'bar']));
    });
  });

  describe('file extensions', () => {
    it('should match files that contain the given extension', () => {
      assert(isMatch('.c.md', '.*.md'));
      assert(isMatch('a/b/c.md', '**/*.md'));
      assert(isMatch('a/b/c.md', 'a/*/*.md'));
      assert(isMatch('c.md', '*.md'));
    });

    it('should not match files that do not contain the given extension', () => {
      assert(!isMatch('.c.md', '*.md'));
      assert(!isMatch('.c.md', '.c.'));
      assert(!isMatch('.c.md', '.md'));
      assert(!isMatch('.md', '*.md'));
      assert(!isMatch('.md', '.m'));
      assert(!isMatch('a/b/c.md', '*.md'));
      assert(!isMatch('a/b/c.md', '.md'));
      assert(!isMatch('a/b/c.md', 'a/*.md'));
      assert(!isMatch('a/b/c/c.md', '*.md'));
      assert(!isMatch('a/b/c/c.md', 'c.js'));
    });
  });

  describe('dot files', () => {
    it('should match dotfiles when a dot is explicitly defined in the pattern', () => {
      assert(isMatch('.a', '.a'));
      assert(isMatch('.ab', '.*'));
      assert(isMatch('.ab', '.a*'));
      assert(isMatch('.b', '.b*'));
      assert(isMatch('.md', '.md'));
      assert(isMatch('a/.c.md', 'a/.c.md'));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(isMatch('a/b/c/d.a.md', 'a/b/c/*.md'));
    });

    it('should not match dotfiles when a dot is not defined in the pattern', () => {
      assert(!isMatch('.abc', '.a'));
      assert(!isMatch('.c.md', '*.md'));
      assert(!isMatch('a/.c.md', '*.md'));
    });

    it('should match dotfiles when `dot` is set', () => {
      assert(!isMatch('a/b/c/.xyz.md', '.*.md', { dot: true }));
      assert(isMatch('.c.md', '*.md', { dot: true }));
      assert(isMatch('.c.md', '.*', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', '**/*.md', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', '**/.*.md', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/*.md', { dot: true }));
      assert(isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md', { dot: true }));
    });

    it('should not match dotfiles when `dot` is not set', () => {
      assert(!isMatch('.a', '*.md'));
      assert(!isMatch('.ba', '.a'));
      assert(!isMatch('.a.md', 'a/b/c/*.md'));
      assert(!isMatch('.ab', '*.*'));
      assert(!isMatch('.md', 'a/b/c/*.md'));
      assert(!isMatch('.txt', '.md'));
      assert(!isMatch('.verb.txt', '*.md'));
      assert(!isMatch('a/b/d/.md', 'a/b/c/*.md'));
    });
  });

  describe('dot-slash', () => {
    it('should match paths with leading `./`', () => {
      let format = str => str.replace(/^\.\//, '');

      assert(isMatch('./a', ['a', '?(./)*'], { format }));
      assert(isMatch('a', ['a', '?(./)*'], { format }));
      assert(isMatch('a', ['?(./)*'], { format }));
      assert(!isMatch('./.a', 'a/**/z/*.md', { format }));
      assert(!isMatch('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(!isMatch('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', './a/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/d/e/z/c.md', '?(./)a/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/c/j/e/z/c.md', '?(./)a/**/j/**/z/*.md', { format }));
      assert(isMatch('./a/b/z/.a', './a/**/z/.a', { format }));
      assert(isMatch('./a/b/z/.a', '?(./)a/**/z/.a', { format }));
    });
  });
});
