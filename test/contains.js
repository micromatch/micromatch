'use strict';

require('should');
var mm = require('..');

describe('.contains()', function () {
  it('should correctly deal with empty patterns', function () {
    mm.contains('ab', '').should.be.false;
    mm.contains('a', '').should.be.false;
    mm.contains('.', '').should.be.false;
  });

  it('should return true when the path contains the pattern', function () {
    mm.contains('ab', 'b').should.be.true;
    mm.contains('.', '.').should.be.true;
    mm.contains('a/b/c', 'a/b').should.be.true;
    mm.contains('/ab', '/a').should.be.true;
    mm.contains('a', 'a').should.be.true;
    mm.contains('ab', 'a').should.be.true;
    mm.contains('ab', 'ab').should.be.true;
    mm.contains('abcd', 'd').should.be.true;
    mm.contains('abcd', 'c').should.be.true;
    mm.contains('abcd', 'cd').should.be.true;
    mm.contains('abcd', 'bc').should.be.true;
    mm.contains('abcd', 'ab').should.be.true;
  });

  it('should match with common glob patterns', function () {
    mm.contains('a/b/c', 'a/*').should.be.true;
    mm.contains('/ab', '/a').should.be.true;
    mm.contains('/ab', '/*').should.be.true;
    mm.contains('/cd', '/*').should.be.true;
    mm.contains('ab', '*').should.be.true;
    mm.contains('ab', 'ab').should.be.true;
    mm.contains('/ab', '*/a').should.be.true;
    mm.contains('/ab', '*/').should.be.true;
    mm.contains('/ab', '*/*').should.be.true;
    mm.contains('/ab', '/').should.be.true;
    mm.contains('/ab', '/??').should.be.true;
    mm.contains('/ab', '/?b').should.be.true;
    mm.contains('/ab', '/?').should.be.true;
    mm.contains('a/b', '?/?').should.be.true;
  });

  it('should return false when the path does not contain the pattern', function () {
    mm.contains('/ab', '?/?').should.be.false;
    mm.contains('ab', '*/*').should.be.false;
    mm.contains('abcd', 'f').should.be.false;
    mm.contains('ab', 'c').should.be.false;
    mm.contains('ab', '/a').should.be.false;
    mm.contains('/ab', 'a/*').should.be.false;
    mm.contains('ef', '/*').should.be.false;
    mm.contains('ab', './*').should.be.false;
  });

  it('should match files that contain the given extension:', function () {
    mm.contains('.md', '.m').should.be.true;
    mm.contains('.c.md', '.*.md').should.be.true;
    mm.contains('c.md', '*.md').should.be.true;
    mm.contains('a/b/c.md', '.md').should.be.true;
    mm.contains('a/b/c.md', 'a/*/*.md').should.be.true;
    mm.contains('a/b/c.md', '**/*.md').should.be.true;
    mm.contains('c.md', '*.md').should.be.true;
    mm.contains('.c.md', '.md').should.be.true;
    mm.contains('.c.md', '.c.').should.be.true;
    mm.contains('a/b/c.md', '*.md').should.be.true;
    mm.contains('a/b/c/c.md', '*.md').should.be.true;
    mm.contains('.c.md', '*.md').should.be.true;
  });

  it('should not match files that do not contain the given extension:', function () {
    mm.contains('.md', '*.md').should.be.false;
    mm.contains('a/b/c/c.md', 'c.js').should.be.false;
    mm.contains('a/b/c.md', 'a/*.md').should.be.false;
  });

  it('should match dotfiles when a dot is explicitly defined in the pattern:', function () {
    mm.contains('.a', '.a').should.be.true;
    mm.contains('.ab', '.*').should.be.true;
    mm.contains('.ab', '.a*').should.be.true;
    mm.contains('.abc', '.a').should.be.true;
    mm.contains('.b', '.b*').should.be.true;
    mm.contains('.md', '.md').should.be.true;
    mm.contains('.c.md', '*.md').should.be.true;
    mm.contains('a/.c.md', 'a/.c.md').should.be.true;
    mm.contains('a/b/c/.xyz.md', 'a/b/c/.*.md').should.be.true;
    mm.contains('a/.c.md', '*.md').should.be.true;
    mm.contains('a/b/c/d.a.md', 'a/b/c/*.md').should.be.true;
  });

  it('should match dotfiles when `dot` or `dotfiles` is set:', function () {
    mm.contains('a/b/c/.xyz.md', '.*.md', {dot: true}).should.be.true;
    mm.contains('.c.md', '*.md', {dot: true}).should.be.true;
    mm.contains('.c.md', '.*', {dot: true}).should.be.true;
    mm.contains('a/b/c/.xyz.md', '**/*.md', {dot: true}).should.be.true;
    mm.contains('a/b/c/.xyz.md', '**/.*.md', {dot: true}).should.be.true;
    mm.contains('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}).should.be.true;
    mm.contains('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}).should.be.true;
  });

  it('should not match dotfiles when `dot` or `dotfiles` is not set:', function () {
    mm.contains('.a', '*.md').should.be.false;
    mm.contains('.ba', '.a').should.be.false;
    mm.contains('.a.md', 'a/b/c/*.md').should.be.false;
    mm.contains('.ab', '*.*').should.be.false;
    mm.contains('.md', 'a/b/c/*.md').should.be.false;
    mm.contains('.txt', '.md').should.be.false;
    mm.contains('.verb.txt', '*.md').should.be.false;
    mm.contains('a/b/d/.md', 'a/b/c/*.md').should.be.false;
  });

  it('should match file paths:', function () {
    mm.contains('a/b/c/xyz.md', 'a/b/c/*.md').should.be.true;
    mm.contains('a/bb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.contains('a/bbbb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.contains('a/bb.bb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.contains('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md').should.be.true;
    mm.contains('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.true;
  });

  it('should return true when full file paths are matched:', function () {
    mm.contains('a/.b', 'a/.*').should.be.true;
    mm.contains('a/.b', 'a/').should.be.true;
    mm.contains('a/b/z/.a', 'b/z').should.be.true;
    mm.contains('a/b/z/.a', 'a/*/z/.a').should.be.true;
    mm.contains('a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.true;
    mm.contains('a/b/c/d/e/z/c.md', 'b/c/d/e').should.be.true;
    mm.contains('a/b/c/d/e/j/n/p/o/z/c.md', 'a/**/j/**/z/*.md').should.be.true;
    mm.contains('a/b/c/cd/bbb/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true;
    mm.contains('a/b/baz/ce/fez/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true;
  });

  it('question marks should not match slashes:', function () {
    mm.contains('aaa/bbb', 'aaa?bbb').should.be.false;
  });

  it('should match path segments:', function () {
    mm.contains('aaa', 'aaa').should.be.true;
    mm.contains('aaa', 'aa').should.be.true;
    mm.contains('aaa/bbb', 'aaa/bbb').should.be.true;
    mm.contains('aaa/bbb', 'aaa/*').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa/*').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa/**').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa*').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa**').should.be.true;
    // mm.contains('aaa/bba/ccc', 'aaa/*ccc').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa/**ccc').should.be.true;
    mm.contains('aaa/bba/ccc', 'aaa/*z').should.be.false;
    mm.contains('aaa/bba/ccc', 'aaa/**z').should.be.false;
    mm.contains('aaa/bbb', 'aaa[/]bbb').should.be.true;
    mm.contains('aaa', '*/*/*').should.be.false;
    mm.contains('aaa/bbb', '*/*/*').should.be.false;
    mm.contains('aaa/bba/ccc', '*/*/*').should.be.true;
    mm.contains('aaa/bb/aa/rr', '*/*/*').should.be.true;
    mm.contains('abzzzejklhi', '*j*i').should.be.true;
    mm.contains('ab/zzz/ejkl/hi', '*/*z*/*/*i').should.be.true;
    mm.contains('ab/zzz/ejkl/hi', '*/*jk*/*i').should.be.true;
  });

  it('should return false when full file paths are not matched:', function () {
    mm.contains('a/b/z/.a', 'b/a').should.be.false;
    mm.contains('a/.b', 'a/**/z/*.md').should.be.false;
    mm.contains('a/b/z/.a', 'a/**/z/*.a').should.be.false;
    mm.contains('a/b/z/.a', 'a/*/z/*.a').should.be.false;
    mm.contains('a/b/c/j/e/z/c.txt', 'a/**/j/**/z/*.md').should.be.false;
    mm.contains('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.contains('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false;
  });

  it('should match paths with leading `./`:', function () {
    mm.contains('./.a', 'a/**/z/*.md').should.be.false;
    mm.contains('./a/b/z/.a', 'a/**/z/.a').should.be.true;
    mm.contains('./a/b/z/.a', './a/**/z/.a').should.be.true;
    mm.contains('./a/b/c/d/e/z/c.md', 'a/**/z/*.md').should.be.true;
    mm.contains('./a/b/c/d/e/z/c.md', './a/**/z/*.md').should.be.true;
    mm.contains('./a/b/c/d/e/z/c.md', './a/**/j/**/z/*.md').should.be.false;
    mm.contains('./a/b/c/j/e/z/c.md', './a/**/j/**/z/*.md').should.be.true;
    mm.contains('./a/b/c/j/e/z/c.md', 'a/**/j/**/z/*.md').should.be.true;
    mm.contains('./a/b/c/d/e/j/n/p/o/z/c.md', './a/**/j/**/z/*.md').should.be.true;
    mm.contains('./a/b/c/j/e/z/c.txt', './a/**/j/**/z/*.md').should.be.false;
    mm.contains('./a/b/d/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.contains('./a/b/c/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.contains('./a/b/c/cd/bbb/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true;
    mm.contains('./a/b/baz/ce/fez/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true;
  });
});
