'use strict';

require('mocha');
var assert = require('assert');
var mm = require('..');

describe('.any()', function() {
  describe('empty patterns', function() {
    it('should correctly handle empty patterns', function() {
      assert(!mm.any('ab', ''));
      assert(!mm.any('a', ''));
      assert(!mm.any('.', ''));
      assert(!mm.any('ab', ['']));
      assert(!mm.any('a', ['']));
      assert(!mm.any('.', ['']));
    });
  });

  describe('non-globs', function() {
    it('should match literal paths', function() {
      assert(!mm.any('aaa', 'aa'));
      assert(mm.any('aaa', 'aaa'));
      assert(mm.any('aaa/bbb', 'aaa/bbb'));
      assert(mm.any('aaa/bbb', 'aaa[/]bbb'));
    });
  });

  describe('stars (single pattern)', function() {
    it('should return true when full file paths are matched:', function() {
      assert(mm.any('a/b/c/xyz.md', 'a/b/c/*.md'));
      assert(mm.any('a/bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.any('a/bbbb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.any('a/bb.bb/c/xyz.md', 'a/*/c/*.md'));
      assert(mm.any('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(mm.any('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md'));
      assert(!mm.any('a/.b', 'a/'));
      assert(!mm.any('a/b/c/d/e/z/c.md', 'b/c/d/e'));
      assert(!mm.any('a/b/z/.a', 'b/z'));
      assert(mm.any('a/.b', 'a/.*'));
      assert(mm.any('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md'));
      assert(mm.any('a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.any('a/b/z/.a', 'a/*/z/.a'));
      assert(mm.any('.', '.'));
      assert(mm.any('/ab', '*/*'));
      assert(mm.any('/ab', '/*'));
      assert(mm.any('/ab', '/??'));
      assert(mm.any('/ab', '/?b'));
      assert(mm.any('/cd', '/*'));
      assert(mm.any('a', 'a'));
      assert(mm.any('ab', './*'));
      assert(mm.any('ab/', './*/'));
      assert(mm.any('a/b', '?/?'));
      assert(mm.any('ab', '*'));
      assert(mm.any('ab', 'ab'));
    });

    it('should return false when the path does not match the pattern', function() {
      assert(!mm.any('/ab', '*/'));
      assert(!mm.any('/ab', '*/a'));
      assert(!mm.any('/ab', '/'));
      assert(!mm.any('/ab', '/?'));
      assert(!mm.any('/ab', '/a'));
      assert(!mm.any('/ab', '?/?'));
      assert(!mm.any('/ab', 'a/*'));
      assert(!mm.any('a/b/c', 'a/*'));
      assert(!mm.any('a/b/c', 'a/b'));
      assert(!mm.any('ab', '*/*'));
      assert(!mm.any('ab/', '*/*'));
      assert(!mm.any('ab', '/a'));
      assert(!mm.any('ab', 'a'));
      assert(!mm.any('ab', 'b'));
      assert(!mm.any('ab', 'c'));
      assert(!mm.any('abcd', 'ab'));
      assert(!mm.any('abcd', 'bc'));
      assert(!mm.any('abcd', 'c'));
      assert(!mm.any('abcd', 'cd'));
      assert(!mm.any('abcd', 'd'));
      assert(!mm.any('abcd', 'f'));
      assert(!mm.any('ef', '/*'));
    });

    it('should match a path segment for each single star', function() {
      assert(!mm.any('aaa', '*/*/*'));
      assert(!mm.any('aaa/bb/aa/rr', '*/*/*'));
      assert(!mm.any('aaa/bba/ccc', 'aaa*'));
      assert(!mm.any('aaa/bba/ccc', 'aaa**'));
      assert(!mm.any('aaa/bba/ccc', 'aaa/*'));
      assert(!mm.any('aaa/bba/ccc', 'aaa/*ccc'));
      assert(!mm.any('aaa/bba/ccc', 'aaa/*z'));
      assert(!mm.any('aaa/bbb', '*/*/*'));
      assert(!mm.any('ab/zzz/ejkl/hi', '*/*jk*/*i'));
      assert(mm.any('aaa/bba/ccc', '*/*/*'));
      assert(mm.any('aaa/bba/ccc', 'aaa/**'));
      assert(mm.any('aaa/bbb', 'aaa/*'));
      assert(mm.any('ab/zzz/ejkl/hi', '*/*z*/*/*i'));
      assert(mm.any('abzzzejklhi', '*j*i'));
    });

    it('should regard non-exclusive double-stars as single stars', function() {
      assert(!mm.any('aaa/bba/ccc', 'aaa/**ccc'));
      assert(!mm.any('aaa/bba/ccc', 'aaa/**z'));
    });

    it('should return false when full file paths are not matched:', function() {
      assert(!mm.any('a/b/z/.a', 'b/a'));
      assert(!mm.any('a/.b', 'a/**/z/*.md'));
      assert(!mm.any('a/b/z/.a', 'a/**/z/*.a'));
      assert(!mm.any('a/b/z/.a', 'a/*/z/*.a'));
      assert(!mm.any('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md'));
      assert(!mm.any('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
      assert(!mm.any('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md'));
    });
  });

  describe('stars (multiple patterns)', function() {
    it('should return true when any of the patterns match', function() {
      assert(mm.any('.', ['.', 'foo']));
      assert(mm.any('a', ['a', 'foo']));
      assert(mm.any('ab', ['ab', 'foo']));
      assert(mm.any('ab', ['./*', 'foo', 'bar']));
      assert(mm.any('ab', ['*', 'foo', 'bar']));
      assert(mm.any('ab', ['*b', 'foo', 'bar']));
      assert(mm.any('ab', ['a*', 'foo', 'bar']));
    });

    it('should return false when none of the patterns match', function() {
      assert(!mm.any('/ab', ['/a', 'foo']));
      assert(!mm.any('/ab', ['?/?', 'foo', 'bar']));
      assert(!mm.any('/ab', ['a/*', 'foo', 'bar']));
      assert(!mm.any('a/b/c', ['a/b', 'foo']));
      assert(!mm.any('ab', ['*/*', 'foo', 'bar']));
      assert(!mm.any('ab', ['/a', 'foo', 'bar']));
      assert(!mm.any('ab', ['a', 'foo']));
      assert(!mm.any('ab', ['b', 'foo']));
      assert(!mm.any('ab', ['c', 'foo', 'bar']));
      assert(!mm.any('abcd', ['ab', 'foo']));
      assert(!mm.any('abcd', ['bc', 'foo']));
      assert(!mm.any('abcd', ['c', 'foo']));
      assert(!mm.any('abcd', ['cd', 'foo']));
      assert(!mm.any('abcd', ['d', 'foo']));
      assert(!mm.any('abcd', ['f', 'foo', 'bar']));
      assert(!mm.any('ef', ['/*', 'foo', 'bar']));
    });
  });

  describe('file extensions', function() {
    it('should match files that contain the given extension:', function() {
      assert(mm.any('.c.md', '.*.md'));
      assert(mm.any('a/b/c.md', '**/*.md'));
      assert(mm.any('a/b/c.md', 'a/*/*.md'));
      assert(mm.any('c.md', '*.md'));
    });

    it('should not match files that do not contain the given extension:', function() {
      assert(!mm.any('.c.md', '*.md'));
      assert(!mm.any('.c.md', '.c.'));
      assert(!mm.any('.c.md', '.md'));
      assert(!mm.any('.md', '*.md'));
      assert(!mm.any('.md', '.m'));
      assert(!mm.any('a/b/c.md', '*.md'));
      assert(!mm.any('a/b/c.md', '.md'));
      assert(!mm.any('a/b/c.md', 'a/*.md'));
      assert(!mm.any('a/b/c/c.md', '*.md'));
      assert(!mm.any('a/b/c/c.md', 'c.js'));
    });
  });

  describe('dot files', function() {
    it('should match dotfiles when a dot is explicitly defined in the pattern:', function() {
      assert(mm.any('.a', '.a'));
      assert(mm.any('.ab', '.*'));
      assert(mm.any('.ab', '.a*'));
      assert(mm.any('.b', '.b*'));
      assert(mm.any('.md', '.md'));
      assert(mm.any('a/.c.md', 'a/.c.md'));
      assert(mm.any('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(mm.any('a/b/c/d.a.md', 'a/b/c/*.md'));
    });

    it('should match leading `./` when `**` is in the pattern', function() {
      assert(mm.any('./a', 'a'));
      assert(mm.any('.ab', '.*'));
      assert(mm.any('.ab', '.a*'));
      assert(mm.any('.b', '.b*'));
      assert(mm.any('.md', '.md'));
      assert(mm.any('a/.c.md', 'a/.c.md'));
      assert(mm.any('a/b/c/.xyz.md', 'a/b/c/.*.md'));
      assert(mm.any('a/b/c/d.a.md', 'a/b/c/*.md'));
    });

    it('should not match dotfiles when a dot is not defined in the pattern:', function() {
      assert(!mm.any('.abc', '.a'));
      assert(!mm.any('.c.md', '*.md'));
      assert(!mm.any('a/.c.md', '*.md'));
    });

    it('should match dotfiles when `dot` is set:', function() {
      assert(!mm.any('a/b/c/.xyz.md', '.*.md', {dot: true}));
      assert(mm.any('.c.md', '*.md', {dot: true}));
      assert(mm.any('.c.md', '.*', {dot: true}));
      assert(mm.any('a/b/c/.xyz.md', '**/*.md', {dot: true}));
      assert(mm.any('a/b/c/.xyz.md', '**/.*.md', {dot: true}));
      assert(mm.any('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}));
      assert(mm.any('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}));
    });

    it('should not match dotfiles when `dot` is not set:', function() {
      assert(!mm.any('.a', '*.md'));
      assert(!mm.any('.ba', '.a'));
      assert(!mm.any('.a.md', 'a/b/c/*.md'));
      assert(!mm.any('.ab', '*.*'));
      assert(!mm.any('.md', 'a/b/c/*.md'));
      assert(!mm.any('.txt', '.md'));
      assert(!mm.any('.verb.txt', '*.md'));
      assert(!mm.any('a/b/d/.md', 'a/b/c/*.md'));
    });
  });

  describe('qmarks', function() {
    it('question marks should not match slashes:', function() {
      assert(!mm.any('aaa/bbb', 'aaa?bbb'));
    });
  });

  describe('dot-slash', function() {
    it('should match paths with leading `./`:', function() {
      assert(!mm.any('./.a', 'a/**/z/*.md'));
      assert(!mm.any('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(!mm.any('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md'));
      assert(mm.any('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.any('./a/b/c/d/e/z/c.md', './a/**/z/*.md'));
      assert(mm.any('./a/b/c/d/e/z/c.md', 'a/**/z/*.md'));
      assert(mm.any('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md'));
      assert(mm.any('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md'));
      assert(mm.any('./a/b/z/.a', './a/**/z/.a'));
      assert(mm.any('./a/b/z/.a', 'a/**/z/.a'));
    });
  });
});
