'use strict';

var should = require('should');
var mm = require('..');

describe('.isMatch()', function () {
  it('should correctly deal with empty globs', function () {
    mm.isMatch('ab', '').should.be.false;
    mm.isMatch('a', '').should.be.false;
    mm.isMatch('.', '').should.be.false;
  });

  it('should match with non-glob patterns', function () {
    mm.isMatch('.', '.').should.be.true;
    mm.isMatch('/a', '/a').should.be.true;
    mm.isMatch('/ab', '/a').should.be.false;
    mm.isMatch('a', 'a').should.be.true;
    mm.isMatch('ab', '/a').should.be.false;
    mm.isMatch('ab', 'a').should.be.false;
    mm.isMatch('ab', 'ab').should.be.true;
  });

  it('should match with common glob patterns', function () {
    mm.isMatch('/ab', '/*').should.be.true;
    mm.isMatch('/cd', '/*').should.be.true;
    mm.isMatch('ef', '/*').should.be.false;
    mm.isMatch('ab', './*').should.be.false;
    mm.isMatch('ab', '*').should.be.true;
    mm.isMatch('ab', 'ab').should.be.true;
  });

  it('should match files with the given extension:', function () {
    mm.isMatch('.md', '*.md').should.be.false;
    mm.isMatch('.md', '.md').should.be.true;
    mm.isMatch('.foo.md', '*.md').should.be.false;
    mm.isMatch('.foo.md', '.*.md').should.be.true;
    mm.isMatch('foo.md', '*.md').should.be.true;
    mm.isMatch('a/b/c/foo.md', '*.md').should.be.false;
    mm.isMatch('a/b/foo.md', 'a/*.md').should.be.false;
    mm.isMatch('a/b/foo.md', 'a/*/*.md').should.be.true;
    mm.isMatch('a/b/foo.md', '**/*.md').should.be.true;
  });

  it('should not match dotfiles when `dot` or `dotfiles` are not set:', function () {
    mm.isMatch('.foo.md', '*.md').should.be.false;
    mm.isMatch('a/.foo.md', '*.md').should.be.false;
    mm.isMatch('a/.foo.md', 'a/.foo.md').should.be.true;
    mm.isMatch('.a', '*.md').should.be.false;
    mm.isMatch('.verb.txt', '*.md').should.be.false;
    mm.isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md').should.be.true;
    mm.isMatch('.md', '.md').should.be.true;
    mm.isMatch('.txt', '.md').should.be.false;
    mm.isMatch('.md', '.md').should.be.true;
    mm.isMatch('.a', '.a').should.be.true;
    mm.isMatch('.b', '.b*').should.be.true;
    mm.isMatch('.ab', '.a*').should.be.true;
    mm.isMatch('.ab', '.*').should.be.true;
    mm.isMatch('.ab', '*.*').should.be.false;
    mm.isMatch('.md', 'a/b/c/*.md').should.be.false;
    mm.isMatch('.a.md', 'a/b/c/*.md').should.be.false;
    mm.isMatch('a/b/c/d.a.md', 'a/b/c/*.md').should.be.true;
    mm.isMatch('a/b/d/.md', 'a/b/c/*.md').should.be.false;
  });

  it('should match dotfiles when `dot` or `dotfiles` is set:', function () {
    mm.isMatch('.foo.md', '*.md', {dot: true}).should.be.false;
    mm.isMatch('.foo.md', '.*', {dot: true}).should.be.true;
    mm.isMatch('a/b/c/.xyz.md', 'a/b/c/*.md', {dot: true}).should.be.false;
    mm.isMatch('a/b/c/.xyz.md', 'a/b/c/.*.md', {dot: true}).should.be.true;
  });

  it('should match file paths:', function () {
    mm.isMatch('a/b/c/xyz.md', 'a/b/c/*.md').should.be.true;
    mm.isMatch('a/bb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.isMatch('a/bbbb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.isMatch('a/bb.bb/c/xyz.md', 'a/*/c/*.md').should.be.true;
    mm.isMatch('a/bb.bb/aa/bb/aa/c/xyz.md', 'a/**/c/*.md').should.be.true;
    mm.isMatch('a/bb.bb/aa/b.b/aa/c/xyz.md', 'a/**/c/*.md').should.be.true;
  });

  it('should match full file paths:', function () {
    mm.isMatch('a/.b', 'a/**/z/*.md').should.be.false;
    mm.isMatch('a/.b', 'a/.*').should.be.true;
    mm.isMatch('a/b/z/.a', 'a/**/z/*.a').should.be.false;
    mm.isMatch('a/b/z/.a', 'a/*/z/*.a').should.be.false;
    mm.isMatch('a/b/z/.a', 'a/*/z/.a').should.be.true;
    mm.isMatch('a/b/c/d/e/z/foo.md', 'a/**/z/*.md').should.be.true;
    mm.isMatch('a/b/c/d/e/j/n/p/o/z/foo.md', 'a/**/j/**/z/*.md').should.be.true;
    mm.isMatch('a/b/c/j/e/z/foo.txt', 'a/**/j/**/z/*.md').should.be.false;
    mm.isMatch('a/b/d/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.isMatch('a/b/c/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.isMatch('a/b/foo/cd/bar/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true;
    mm.isMatch('a/b/baz/ce/fez/xyz.md', 'a/b/**/c{d,e}/**/xyz.md').should.be.true;
  });

  it('should match paths with leading `./`:', function () {
    mm.isMatch('./.a', 'a/**/z/*.md').should.be.false;
    mm.isMatch('./a/b/z/.a', 'a/**/z/.a').should.be.false;
    mm.isMatch('./a/b/z/.a', './a/**/z/.a').should.be.true;
    mm.isMatch('./a/b/c/d/e/z/foo.md', 'a/**/z/*.md').should.be.false;
    mm.isMatch('./a/b/c/d/e/z/foo.md', './a/**/z/*.md').should.be.true;
    mm.isMatch('./a/b/c/d/e/z/foo.md', './a/**/j/**/z/*.md').should.be.false;
    mm.isMatch('./a/b/c/j/e/z/foo.md', './a/**/j/**/z/*.md').should.be.true;
    mm.isMatch('./a/b/c/j/e/z/foo.md', 'a/**/j/**/z/*.md').should.be.false;
    mm.isMatch('./a/b/c/d/e/j/n/p/o/z/foo.md', './a/**/j/**/z/*.md').should.be.true;
    mm.isMatch('./a/b/c/j/e/z/foo.txt', './a/**/j/**/z/*.md').should.be.false;
    mm.isMatch('./a/b/d/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.isMatch('./a/b/c/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.false;
    mm.isMatch('./a/b/foo/cd/bar/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true;
    mm.isMatch('./a/b/baz/ce/fez/xyz.md', './a/b/**/c{d,e}/**/xyz.md').should.be.true;
  });
});
