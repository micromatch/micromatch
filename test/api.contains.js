'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const sep = path.sep;

describe('.contains()', () => {
  afterEach(() => (path.sep = sep));
  after(() => (path.sep = sep));

  describe('errors', () => {
    it('should throw an error arguments are invalid', () => {
      assert.throws(() => mm.contains());
    });
  });

  describe('patterns', () => {
    it('should correctly deal with empty patterns', () => {
      assert(!mm.contains('ab', ''));
      assert(!mm.contains('a', ''));
      assert(!mm.contains('.', ''));
    });

    it('should return true when the path contains the pattern', () => {
      assert(mm.contains('ab', 'b'));
      assert(mm.contains('.', '.'));
      assert(mm.contains('a/b/c', 'a/b'));
      assert(mm.contains('/ab', '/a'));
      assert(mm.contains('a', 'a'));
      assert(mm.contains('ab', 'a'));
      assert(mm.contains('ab', 'ab'));
      assert(mm.contains('abcd', 'd'));
      assert(mm.contains('abcd', 'c'));
      assert(mm.contains('abcd', 'cd'));
      assert(mm.contains('abcd', 'bc'));
      assert(mm.contains('abcd', 'ab'));
    });

    it('should be true when a glob pattern partially matches the path', () => {
      assert(mm.contains('a/b/c', 'a/*'));
      assert(mm.contains('/ab', '/a'));
      assert(mm.contains('/ab', '/*'));
      assert(mm.contains('/cd', '/*'));
      assert(mm.contains('ab', '*'));
      assert(mm.contains('ab', 'ab'));
      assert(mm.contains('/ab', '*/a'));
      assert(mm.contains('/ab', '*/'));
      assert(mm.contains('/ab', '*/*'));
      assert(mm.contains('/ab', '/'));
      assert(mm.contains('/ab', '/??'));
      assert(mm.contains('/ab', '/?b'));
      assert(mm.contains('/ab', '/?'));
      assert(mm.contains('a/b', '?/?'));
    });

    it('should return false when the path does not contain the pattern', () => {
      assert(!mm.contains('/ab', '?/?'));
      assert(!mm.contains('ab', '*/*'));
      assert(!mm.contains('abcd', 'f'));
      assert(!mm.contains('ab', 'c'));
      assert(!mm.contains('ab', '/a'));
      assert(!mm.contains('/ab', 'a/*'));
      assert(!mm.contains('ef', '/*'));
    });

    it('should match files that contain the given extension', () => {
      assert(mm.contains('ab', './*'));
      assert(mm.contains('.c.md', '*.md'));
      assert(mm.contains('.c.md', '.*.md'));
      assert(mm.contains('.c.md', '.c.'));
      assert(mm.contains('.c.md', '.md'));
      assert(mm.contains('.md', '.m'));
      assert(mm.contains('a/b/c.md', '**/*.md'));
      assert(mm.contains('a/b/c.md', '*.md'));
      assert(mm.contains('a/b/c.md', '.md'));
      assert(mm.contains('a/b/c.md', 'a/*/*.md'));
      assert(mm.contains('a/b/c/c.md', '*.md'));
      assert(mm.contains('c.md', '*.md'));
    });

    it('should not match files that do not contain the given extension', () => {
      assert(!mm.contains('.md', '*.md'));
      assert(!mm.contains('a/b/c/c.md', 'c.js'));
      assert(!mm.contains('a/b/c.md', 'a/*.md'));
    });

    it('should match dotfiles when a dot is explicitly defined in the pattern', () => {
      assert(mm.contains('.a', '.a'));
      assert(mm.contains('.ab', '.*'));
      assert(mm.contains('.ab', '.a*'));
      assert(mm.contains('.abc', '.a'));
      assert(mm.contains('.b', '.b*'));
      assert(mm.contains('.c.md', '*.md'));
      assert(mm.contains('.md', '.md'));
      assert(mm.contains('a/.c.md', '*.md'));
      assert(mm.contains('a/.c.md', 'a/.c.md'));
      assert(mm.contains('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(mm.contains('a/b/c/d.a.md', 'a/b/c/*.md'));
    });

    it('should match dotfiles when `dot` or `dotfiles` is set', () => {
      assert(mm.contains('.c.md', '*.md', { dot: true }));
      assert(mm.contains('.c.md', '.*', { dot: true }));
      assert(mm.contains('a/b/c/.xyz.md', '**/*.md', { dot: true }));
      assert(mm.contains('a/b/c/.xyz.md', '**/.*.md', { dot: true }));
      assert(mm.contains('a/b/c/.xyz.md', '.*.md', { dot: true }));
      assert(mm.contains('a/b/c/.xyz.md', 'a/b/c/*.md', { dot: true }));
      assert(mm.contains('a/b/c/.xyz.md', 'a/b/c/.*.md', { dot: true }));
    });

    it('should not match dotfiles when `dot` or `dotfiles` is not set', () => {
      assert(!mm.contains('.a', '*.md'));
      assert(!mm.contains('.ba', '.a'));
      assert(!mm.contains('.a.md', 'a/b/c/*.md'));
      assert(!mm.contains('.ab', '*.*'));
      assert(!mm.contains('.md', 'a/b/c/*.md'));
      assert(!mm.contains('.txt', '.md'));
      assert(!mm.contains('.verb.txt', '*.md'));
      assert(!mm.contains('a/b/d/.md', 'a/b/c/*.md'));
    });

    it('should match file paths', () => {
      assert(mm.contains('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(mm.contains('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(mm.contains('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
    });

    it('should return true when full file paths are matched', () => {
      assert(mm.contains('a/.b', 'a/.*'));
      assert(mm.contains('a/.b', 'a/'));
      assert(mm.contains('a/b/z/.a', 'b/z'));
      assert(mm.contains('a/b/z/.a', 'a/*/z/.a'));
      assert(mm.contains('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.contains('a/b/c/d/e/z/c.md', 'b/c/d/e'));
      assert(mm.contains('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
    });

    it('should match path segments', () => {
      assert(mm.contains('aaa', 'aaa'));
      assert(mm.contains('aaa', 'aa'));
      assert(mm.contains('aaa/bbb', 'aaa/bbb'));
      assert(mm.contains('aaa/bbb', 'aaa/*'));
      assert(mm.contains('aaa/bba/ccc', '**/*/ccc'));
      assert(mm.contains('aaa/bba/ccc', '*/*a'));
      assert(mm.contains('aaa/bba/ccc', 'aaa*'));
      assert(mm.contains('aaa/bba/ccc', 'aaa**'));
      assert(mm.contains('aaa/bba/ccc', 'aaa/*'));
      assert(mm.contains('aaa/bba/ccc', 'aaa/**'));
      assert(mm.contains('aaa/bba/ccc', 'aaa/*/ccc'));
      assert(mm.contains('aaa/bba/ccc', 'bb'));
      assert(mm.contains('aaa/bba/ccc', 'bb*'));
      assert(!mm.contains('aaa/bba/ccc', 'aaa/*ccc'));
      assert(!mm.contains('aaa/bba/ccc', 'aaa/**ccc'));
      assert(!mm.contains('aaa/bba/ccc', 'aaa/*z'));
      assert(!mm.contains('aaa/bba/ccc', 'aaa/**z'));
      assert(mm.contains('aaa/bbb', 'aaa[/]bbb'));
      assert(!mm.contains('aaa', '*/*/*'));
      assert(!mm.contains('aaa/bbb', '*/*/*'));
      assert(mm.contains('aaa/bba/ccc', '*/*/*'));
      assert(mm.contains('aaa/bb/aa/rr', '*/*/*'));
      assert(mm.contains('abzzzejklhi', '*j*i'));
      assert(mm.contains('ab/zzz/ejkl/hi', '*/*z*/*/*i'));
      assert(mm.contains('ab/zzz/ejkl/hi', '*/*jk*/*i'));
    });

    it('should return false when full file paths are not matched', () => {
      assert(!mm.contains('a/b/z/.a', 'b/a'));
      assert(!mm.contains('a/.b', 'a/**/z/*.md'));
      assert(!mm.contains('a/b/z/.a', 'a/**/z/*.a'));
      assert(!mm.contains('a/b/z/.a', 'a/*/z/*.a'));
      assert(!mm.contains('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md'));
    });

    it('should match paths with leading `./`', () => {
      assert(!mm.contains('./.a', 'a/**/z/*.md'));
      assert(mm.contains('./a/b/z/.a', 'a/**/z/.a'));
      assert(mm.contains('./a/b/z/.a', './a/**/z/.a'));
      assert(mm.contains('./a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.contains('./a/b/c/d/e/z/c.md', './a/**/z/*.md'));
      assert(!mm.contains('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.contains('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.contains('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md'));
      assert(mm.contains('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md'));
      assert(!mm.contains('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md'));
    });
  });

  describe('windows paths', () => {
    beforeEach(() => {
      path.sep = '\\';
    });
    afterEach(() => {
      path.sep = sep;
    });

    it('should match with common glob patterns', () => {
      assert(mm.contains('\\ab', '*/'));
      assert(mm.contains('ab\\', '*/'));
      assert(mm.contains('\\ab', '*/*'));
      assert(mm.contains('\\ab', '*/[a-z]*'));
      assert(mm.contains('\\ab', '*/*[a-z]'));
      assert(mm.contains('\\ab', '*/a'));
      assert(mm.contains('\\ab', '/'));
      assert(mm.contains('\\ab', '/*'));
      assert(mm.contains('\\ab', '/?'));
      assert(mm.contains('\\ab', '/??'));
      assert(mm.contains('\\ab', '/?b'));
      assert(mm.contains('\\ab', '/a'));
      assert(mm.contains('\\cd', '/*'));
      assert(mm.contains('a\\b', '?/?'));
      assert(mm.contains('a\\b\\c', 'a/*'));

      assert(!mm.contains('\\ab', '*/', { windows: false }));
      assert(!mm.contains('\\ab', '*/*', { windows: false }));
      assert(!mm.contains('\\ab', '*/[a-z]*', { windows: false }));
      assert(!mm.contains('\\ab', '*/a', { windows: false }));
      assert(!mm.contains('\\ab', '/', { windows: false }));
      assert(!mm.contains('\\ab', '/*', { windows: false }));
      assert(!mm.contains('\\ab', '/?', { windows: false }));
      assert(!mm.contains('\\ab', '/??', { windows: false }));
      assert(!mm.contains('\\ab', '/?b', { windows: false }));
      assert(!mm.contains('\\ab', '/a', { windows: false }));
      assert(!mm.contains('\\cd', '/*', { windows: false }));
      assert(!mm.contains('a\\b', '?/?', { windows: false }));
      assert(!mm.contains('a\\b\\c', 'a/*', { windows: false }));
    });

    it('should match files that contain the given extension', () => {
      assert(mm.contains('a\\b\\c.md', '**/*.md'));
      assert(mm.contains('a\\b\\c.md', '*.md'));
      assert(mm.contains('a\\b\\c.md', '.md'));
      assert(mm.contains('a\\b\\c.md', 'a/*/*.md'));
      assert(mm.contains('a\\b\\c\\c.md', '*.md'));
    });

    it('should match dotfiles when `dot` is true', () => {
      assert(mm.contains('a\\b\\c\\.xyz.md', '.*.md', { windows: true, dot: true }));
      assert(mm.contains('a\\b\\c\\.xyz.md', '**/*.md', { windows: true, dot: true }));
      assert(mm.contains('a\\b\\c\\.xyz.md', '**/.*.md', { windows: true, dot: true }));
      assert(mm.contains('a\\b\\c\\.xyz.md', 'a/b/c/*.md', { windows: true, dot: true }));
      assert(mm.contains('a\\b\\c\\.xyz.md', 'a/b/c/.*.md', { windows: true, dot: true }));
    });

    it('should not match dotfiles when `dot` or `dotfiles` is not set', () => {
      assert(!mm.contains('a\\b\\d\\.md', 'a/b/c/*.md'));
    });

    it('should match file paths', () => {
      assert(mm.contains('a\\b\\c\\xyz.md', 'a/b/c/*.md'));
      assert(mm.contains('a\\bb\\c\\xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a\\bbbb\\c\\xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a\\bb.bb\\c\\xyz.md', 'a/*/c/*.md'));
      assert(mm.contains('a\\bb.bb\\aa\\bb\\aa\\c\\xyz.md', 'a/**/c/*.md'));
      assert(mm.contains('a\\bb.bb\\aa\\b.b\\aa\\c\\xyz.md', 'a/**/c/*.md'));
    });

    it('should return true when full file paths are matched', () => {
      assert(mm.contains('a\\.b', 'a/.*'));
      assert(mm.contains('a\\.b', 'a/'));
      assert(mm.contains('a\\b\\z\\.a', 'b/z'));
      assert(mm.contains('a\\b\\z\\.a', 'a/*/z/.a'));
      assert(mm.contains('a\\b\\c\\d\\e\\z\\c.md', 'a/**/z/*.md'));
      assert(mm.contains('a\\b\\c\\d\\e\\z\\c.md', 'b/c/d/e'));
      assert(mm.contains('a\\b\\c\\d\\e\\j\\n\\p\\o\\z\\c.md', 'a/**/j/**/z/*.md'));
    });

    it('should match path segments', () => {
      assert(mm.contains('aaa\\bbb', 'aaa/bbb'));
      assert(mm.contains('aaa\\bbb', 'aaa/*'));
      assert(mm.contains('aaa\\bba\\ccc', '**/*/ccc'));
      assert(mm.contains('aaa\\bba\\ccc', '*/*a'));
      assert(mm.contains('aaa\\bba\\ccc', 'aaa*'));
      assert(mm.contains('aaa\\bba\\ccc', 'aaa**'));
      assert(mm.contains('aaa\\bba\\ccc', 'aaa/*'));
      assert(mm.contains('aaa\\bba\\ccc', 'aaa/**'));
      assert(mm.contains('aaa\\bba\\ccc', 'aaa/*/ccc'));
      assert(mm.contains('aaa\\bba\\ccc', 'bb'));
      assert(mm.contains('aaa\\bba\\ccc', 'bb*'));
      assert(mm.contains('aaa\\bbb', 'aaa[/]bbb'));
      assert(mm.contains('aaa\\bbb', 'aaa[\\\\/]bbb'));
      assert(!mm.contains('aaa\\bba\\ccc', 'aaa/*ccc'));
      assert(!mm.contains('aaa\\bba\\ccc', 'aaa/**ccc'));
      assert(!mm.contains('aaa\\bba\\ccc', 'aaa/*z'));
      assert(!mm.contains('aaa\\bba\\ccc', 'aaa/**z'));
      assert(!mm.contains('\\aaa', '*/*/*'));
      assert(!mm.contains('aaa\\bbb', '*/*/*'));
      assert(mm.contains('aaa\\bba\\ccc', '*/*/*'));
      assert(mm.contains('aaa\\bb\\aa\\rr', '*/*/*'));
      assert(mm.contains('ab\\zzz\\ejkl\\hi', '*/*z*/*/*i'));
      assert(mm.contains('ab\\zzz\\ejkl\\hi', '*/*jk*/*i'));
    });

    it('should return false when full file paths are not matched', () => {
      assert(!mm.contains('a\\b\\z\\.a', 'b/a'));
      assert(!mm.contains('a\\.b', 'a/**/z/*.md'));
      assert(!mm.contains('a\\b\\z\\.a', 'a/**/z/*.a'));
      assert(!mm.contains('a\\b\\z\\.a', 'a/*/z/*.a'));
      assert(!mm.contains('a\\b\\c\\j\\e\\z\\c.txt', 'a/**/j/**/z/*.md'));
    });

    it('should match dotfiles when a dot is explicitly defined in the pattern', () => {
      assert(mm.contains('a\\.c.md', 'a/.c.md'));
      assert(mm.contains('a\\b\\c\\.xyz.md', 'a/b/c/.*.md'));
      assert(mm.contains('a\\.c.md', '*.md'));
      assert(mm.contains('a\\b\\c\\d.a.md', 'a/b/c/*.md'));
    });

    it('should match paths with leading `./`', () => {
      assert(!mm.contains('.\\.a', 'a/**/z/*.md'));
      assert(!mm.contains('.\\a\\b\\c\\d\\e\\z\\c.md', './a/**/j/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\c\\d\\e\\j\\n\\p\\o\\z\\c.md', './a/**/j/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\c\\d\\e\\z\\c.md', './a/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\c\\d\\e\\z\\c.md', 'a/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\c\\j\\e\\z\\c.md', './a/**/j/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\c\\j\\e\\z\\c.md', 'a/**/j/**/z/*.md'));
      assert(mm.contains('.\\a\\b\\z\\.a', './a/**/z/.a'));
      assert(mm.contains('.\\a\\b\\z\\.a', 'a/**/z/.a'));
    });
  });
});
