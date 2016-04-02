'use strict';

require('should');
var mm = require('..');

describe('.any()', function() {
  describe('errors:', function() {
    it('should throw on undefined args:', function() {
      (function() {
        mm.any();
      }).should.throw('micromatch.any(): patterns should be a string or array.');
    });

    it('should throw on bad args:', function() {
      (function() {
        mm.any({});
      }).should.throw('micromatch.any(): patterns should be a string or array.');
    });
  });

  it('should correctly handle empty patterns', function() {
    mm.any('ab', '').should.be.false();
    mm.any('a', '').should.be.false();
    mm.any('.', '').should.be.false();
  });

  it('should support an array of patterns', function() {
    mm.any('ab', ['']).should.be.false();
    mm.any('a', ['']).should.be.false();
    mm.any('.', ['']).should.be.false();
  });

  it('should return true when the path contains the pattern', function() {
    mm.any('ab', 'b').should.be.false();
    mm.any('.', '.').should.be.true();
    mm.any('a/b/c', 'a/b').should.be.false();
    mm.any('/ab', '/a').should.be.false();
    mm.any('a', 'a').should.be.true();
    mm.any('ab', 'a').should.be.false();
    mm.any('ab', 'ab').should.be.true();
    mm.any('abcd', 'd').should.be.false();
    mm.any('abcd', 'c').should.be.false();
    mm.any('abcd', 'cd').should.be.false();
    mm.any('abcd', 'bc').should.be.false();
    mm.any('abcd', 'ab').should.be.false();
  });

  it('should return true when the path contains any of the patterns', function() {
    mm.any('ab', ['b', 'foo']).should.be.false();
    mm.any('.', ['.', 'foo']).should.be.true();
    mm.any('a/b/c', ['a/b', 'foo']).should.be.false();
    mm.any('/ab', ['/a', 'foo']).should.be.false();
    mm.any('a', ['a', 'foo']).should.be.true();
    mm.any('ab', ['a', 'foo']).should.be.false();
    mm.any('ab', ['ab', 'foo']).should.be.true();
    mm.any('abcd', ['d', 'foo']).should.be.false();
    mm.any('abcd', ['c', 'foo']).should.be.false();
    mm.any('abcd', ['cd', 'foo']).should.be.false();
    mm.any('abcd', ['bc', 'foo']).should.be.false();
    mm.any('abcd', ['ab', 'foo']).should.be.false();
  });

  it('should match with common glob patterns', function() {
    mm.any('a/b/c', 'a/*').should.be.false();
    mm.any('/ab', '/a').should.be.false();
    mm.any('/ab', '/*').should.be.true();
    mm.any('/cd', '/*').should.be.true();
    mm.any('ab', '*').should.be.true();
    mm.any('ab', 'ab').should.be.true();
    mm.any('/ab', '*/a').should.be.false();
    mm.any('/ab', '*/').should.be.false();
    mm.any('/ab', '*/*').should.be.true();
    mm.any('/ab', '/').should.be.false();
    mm.any('/ab', '/??').should.be.true();
    mm.any('/ab', '/?b').should.be.true();
    mm.any('/ab', '/?').should.be.false();
    mm.any('a/b', '?/?').should.be.true();
  });

  it('should return false when the path does not contain the pattern', function() {
    mm.any('/ab', '?/?').should.be.false();
    mm.any('ab', '*/*').should.be.false();
    mm.any('abcd', 'f').should.be.false();
    mm.any('ab', 'c').should.be.false();
    mm.any('ab', '/a').should.be.false();
    mm.any('/ab', 'a/*').should.be.false();
    mm.any('ef', '/*').should.be.false();
    mm.any('ab', './*').should.be.false();
  });

  it('should return false when the path does not contain any pattern', function() {
    mm.any('/ab', ['?/?', 'foo', 'bar']).should.be.false();
    mm.any('ab', ['*/*', 'foo', 'bar']).should.be.false();
    mm.any('abcd', ['f', 'foo', 'bar']).should.be.false();
    mm.any('ab', ['c', 'foo', 'bar']).should.be.false();
    mm.any('ab', ['/a', 'foo', 'bar']).should.be.false();
    mm.any('/ab', ['a/*', 'foo', 'bar']).should.be.false();
    mm.any('ef', ['/*', 'foo', 'bar']).should.be.false();
    mm.any('ab', ['./*', 'foo', 'bar']).should.be.false();
  });

  it('should match files that contain the given extension:', function() {
    mm.any('.md', '.m').should.be.false();
    mm.any('.c.md', '.*.md').should.be.true();
    mm.any('c.md', '*.md').should.be.true();
    mm.any('a/b/c.md', '.md').should.be.false();
    mm.any('a/b/c.md', 'a/*/*.md').should.be.true();
    mm.any('a/b/c.md', '**/*.md').should.be.true();
    mm.any('c.md', '*.md').should.be.true();
    mm.any('.c.md', '.md').should.be.false();
    mm.any('.c.md', '.c.').should.be.false();
    mm.any('a/b/c.md', '*.md').should.be.false();
    mm.any('a/b/c/c.md', '*.md').should.be.false();
    mm.any('.c.md', '*.md').should.be.false();
  });

  it('should not match files that do not contain the given extension:', function() {
    mm.any('.md', '*.md').should.be.false();
    mm.any('a/b/c/c.md', 'c.js').should.be.false();
    mm.any('a/b/c.md', 'a/*.md').should.be.false();
  });

  it('should match dotfiles when a dot is explicitly defined in the pattern:', function() {
    mm.any('.a', '.a').should.be.true();
    mm.any('.ab', '.*').should.be.true();
    mm.any('.ab', '.a*').should.be.true();
    mm.any('.abc', '.a').should.be.false();
    mm.any('.b', '.b*').should.be.true();
    mm.any('.md', '.md').should.be.true();
    mm.any('.c.md', '*.md').should.be.false();
    mm.any('a/.c.md', 'a/.c.md').should.be.true();
    mm.any('a/b/c/.xyz.md', 'a/b/c/.*.md').should.be.true();
    mm.any('a/.c.md', '*.md').should.be.false();
    mm.any('a/b/c/d.a.md', 'a/b/c/*.md').should.be.true();
  });

  it('should match dotfiles when `dot` or `dotfiles` is set:', function() {
    mm.any('a/b/c/.xyz.md', '.*.md', {dot: true}).should.be.false();
    mm.any('.c.md', '*.md', {dot: true}).should.be.true();
    mm.any('.c.md', '.*', {dot: true}).should.be.true();
    mm.any('a/b/c/.xyz.md', '**/*.md', {dot: true}).should.be.true();
    mm.any('a/b/c/.xyz.md', '**/.*.md', {dot: true}).should.be.true();
    mm.any('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}).should.be.true();
    mm.any('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}).should.be.true();
  });

  it('should not match dotfiles when `dot` or `dotfiles` is not set:', function() {
    mm.any('.a', '*.md').should.be.false();
    mm.any('.ba', '.a').should.be.false();
    mm.any('.a.md', 'a/b/c/*.md').should.be.false();
    mm.any('.ab', '*.*').should.be.false();
    mm.any('.md', 'a/b/c/*.md').should.be.false();
    mm.any('.txt', '.md').should.be.false();
    mm.any('.verb.txt', '*.md').should.be.false();
    mm.any('a/b/d/.md', 'a/b/c/*.md').should.be.false();
  });

  it('should match file paths:', function() {
    mm.any('a/b/c/xyz.md', 'a/b/c/*.md').should.be.true();
    mm.any('a/bb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.any('a/bbbb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.any('a/bb.bb/c/xyz.md', 'a/*/c/*.md').should.be.true();
    mm.any('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
    mm.any('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.true();
  });

  it('should return true when full file paths are matched:', function() {
    mm.any('a/.b', 'a/.*').should.be.true();
    mm.any('a/.b', 'a/').should.be.false();
    mm.any('a/b/z/.a', 'b/z').should.be.false();
    mm.any('a/b/z/.a', 'a/*/z/.a').should.be.true();
    mm.any('a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.true();
    mm.any('a/b/c/d/e/z/c.md', 'b/c/d/e').should.be.false();
    mm.any('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md').should.be.true();
    mm.any('a/b/c/cd/bbb/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.any('a/b/baz/ce/fez/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true();
  });

  it('question marks should not match slashes:', function() {
    mm.any('aaa/bbb', 'aaa?bbb').should.be.false();
  });

  it('should match path segments:', function() {
    mm.any('aaa', 'aaa').should.be.true();
    mm.any('aaa', 'aa').should.be.false();
    mm.any('aaa/bbb', 'aaa/bbb').should.be.true();
    mm.any('aaa/bbb', 'aaa/*').should.be.true();
    mm.any('aaa/bba/ccc', 'aaa/*').should.be.false();
    mm.any('aaa/bba/ccc', 'aaa/**').should.be.true();
    mm.any('aaa/bba/ccc', 'aaa*').should.be.false();
    mm.any('aaa/bba/ccc', 'aaa**').should.be.false();
    // mm.any('aaa/bba/ccc', 'aaa/*ccc').should.be.true();
    mm.any('aaa/bba/ccc', 'aaa/**ccc').should.be.true();
    mm.any('aaa/bba/ccc', 'aaa/*z').should.be.false();
    mm.any('aaa/bba/ccc', 'aaa/**z').should.be.false();
    mm.any('aaa/bbb', 'aaa[/]bbb').should.be.true();
    mm.any('aaa', '*/*/*').should.be.false();
    mm.any('aaa/bbb', '*/*/*').should.be.false();
    mm.any('aaa/bba/ccc', '*/*/*').should.be.true();
    mm.any('aaa/bb/aa/rr', '*/*/*').should.be.false();
    mm.any('abzzzejklhi', '*j*i').should.be.true();
    mm.any('ab/zzz/ejkl/hi', '*/*z*/*/*i').should.be.true();
    mm.any('ab/zzz/ejkl/hi', '*/*jk*/*i').should.be.false();
  });

  it('should return false when full file paths are not matched:', function() {
    mm.any('a/b/z/.a', 'b/a').should.be.false();
    mm.any('a/.b', 'a/**/z/*.md').should.be.false();
    mm.any('a/b/z/.a', 'a/**/z/*.a').should.be.false();
    mm.any('a/b/z/.a', 'a/*/z/*.a').should.be.false();
    mm.any('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md').should.be.false();
    mm.any('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false();
    mm.any('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false();
  });

  it('should match paths with leading `./`:', function() {
    mm.any('./.a', 'a/**/z/*.md').should.be.false();
    mm.any('./a/b/z/.a', 'a/**/z/.a').should.be.false();
    mm.any('./a/b/z/.a', './a/**/z/.a').should.be.true();
    mm.any('./a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.false();
    mm.any('./a/b/c/d/e/z/c.md', './a/**/z/*.md').should.be.true();
    mm.any('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md').should.be.false();
    mm.any('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md').should.be.true();
    mm.any('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md').should.be.false();
    mm.any('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md').should.be.true();
    mm.any('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md').should.be.false();
    mm.any('./a/b/d/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false();
    mm.any('./a/b/c/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false();
    mm.any('./a/b/c/cd/bbb/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
    mm.any('./a/b/baz/ce/fez/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true();
  });
});
