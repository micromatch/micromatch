/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

describe('micromatch.matchRe', function () {
  describe('file extensions:', function () {
    it('should create a regular expression for matching extensions:', function () {
      // mm.makeRe('.md').should.eql(/^\.md$/);
      mm.makeRe('.md').test('.md').should.be.true;
      mm.makeRe('.md').test('.txt').should.be.false;
      mm.makeRe('.md').test('.gitignore').should.be.false;
    });
  });

  describe('file names:', function () {
    it('should match files with the given extension:', function () {
      // mm.makeRe('*.md').should.eql(/^[^\/]*?\.md$/);
      mm.makeRe('*.md').test('foo.md').should.be.true;
      mm.makeRe('*.md').test('a/b/c/foo.md').should.be.false;
    });

    it.skip('should not match dotfiles, even if the dotfile name equals the extension:', function () {
      mm.makeRe('*.md').test('.md').should.be.true;
      mm.makeRe('*.md').test('.foo.md').should.be.true;
      mm.makeRe('*.md').test('.gitignore').should.be.false;
      mm.makeRe('*.md').test('.verb.txt').should.be.false;
      // mm.makeRe('a/b/c/*.md').test('a/b/c/.xyz.md').should.be.true;
    });
  });

  describe('file paths:', function () {
    it('should create a regular expression for file paths:', function () {
      // mm.makeRe('a/b/c/*.md').should.eql(/^a\/b\/c\/[^\/]*?\.md$/);
      mm.makeRe('a/b/c/*.md').test('.gitignore').should.be.false;
      mm.makeRe('a/b/c/*.md').test('.gitignore.md').should.be.false;
      mm.makeRe('a/b/c/*.md').test('a/b/c/d.gitignore.md').should.be.true;
      mm.makeRe('a/b/c/*.md').test('a/b/d/.gitignore').should.be.false;
      mm.makeRe('a/b/c/*.md').test('a/b/c/xyz.md').should.be.true;
      mm.makeRe('a/*/c/*.md').test('a/bb/c/xyz.md').should.be.true;
      mm.makeRe('a/*/c/*.md').test('a/bbbb/c/xyz.md').should.be.true;
      mm.makeRe('a/*/c/*.md').test('a/bb.bb/c/xyz.md').should.be.true;
      mm.makeRe('a/**/c/*.md').test('a/bb.bb/aa/bb/aa/c/xyz.md').should.be.true;
      mm.makeRe('a/**/c/*.md').test('a/bb.bb/aa/b.b/aa/c/xyz.md').should.be.true;
    });
  });

  describe('special characters:', function () {
    it('should match one character per question mark:', function () {
      // mm.makeRe('a/?/c.md').should.eql(/^a\/.\/c\.md$/);
      mm.makeRe('a/?/c.md').test('a/b/c.md').should.be.true;
      mm.makeRe('a/?/c.md').test('a/bb/c.md').should.be.false;
      mm.makeRe('a/??/c.md').test('a/bb/c.md').should.be.true;
      mm.makeRe('a/??/c.md').test('a/bbb/c.md').should.be.false;
      mm.makeRe('a/???/c.md').test('a/bbb/c.md').should.be.true;
      // mm.makeRe('a/????/c.md').should.eql(/^a\/....\/c\.md$/);
      mm.makeRe('a/????/c.md').test('a/bbbb/c.md').should.be.true;
    });

    it('should match multiple groups of question marks:', function () {
      // mm.makeRe('a/?/c/?/e.md').should.eql(/^a\/.\/c\/.\/e\.md$/);
      mm.makeRe('a/?/c/?/e.md').test('a/bb/c/dd/e.md').should.be.false;
      mm.makeRe('a/?/c/?/e.md').test('a/b/c/d/e.md').should.be.true;
      mm.makeRe('a/?/c/???/e.md').test('a/b/c/d/e.md').should.be.false;
      mm.makeRe('a/?/c/???/e.md').test('a/b/c/zzz/e.md').should.be.true;
    });

    it('should use special characters and glob stars together:', function () {
      // mm.makeRe('a/?/c/?/*/e.md').should.eql(/^a\/.\/c\/.\/[^\/]*?\/e\.md$/);
      mm.makeRe('a/?/c/?/*/e.md').test('a/b/c/d/e.md').should.be.false;
      mm.makeRe('a/?/c/?/*/e.md').test('a/b/c/d/e/e.md').should.be.true;
      mm.makeRe('a/?/c/?/*/e.md').test('a/b/c/d/efghijk/e.md').should.be.true;
      mm.makeRe('a/?/**/e.md').test('a/b/c/d/efghijk/e.md').should.be.true;
      mm.makeRe('a/?/**/e.md').test('a/bb/c/d/efghijk/e.md').should.be.false;
      // mm.makeRe('a/*/?/**/e.md').should.eql(/^a\/[^\/]*?\/.\/[\s\S]+\/e\.md$/);
      mm.makeRe('a/*/?/**/e.md').test('a/b/c/d/efghijk/e.md').should.be.true;
      mm.makeRe('a/*/?/**/e.md').test('a/b/c/d/efgh.ijk/e.md').should.be.true;
      mm.makeRe('a/*/?/**/e.md').test('a/b.bb/c/d/efgh.ijk/e.md').should.be.true;
      mm.makeRe('a/*/?/**/e.md').test('a/bbb/c/d/efgh.ijk/e.md').should.be.true;
    });
  });

  describe('brace expansion:', function () {
    it('should create a regular brace expansion:', function () {
      // mm.makeRe('a/b/c{d,e}/*.md').should.eql(/^a\/b\/c(d|e)\/[^\/]*?\.md$/);
      mm.makeRe('a/b/c{d,e}/*.md').test('iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/iii.md').should.be.true;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/iii.md').should.be.true;

      // mm.makeRe('a/b/c{d,e}/xyz.md').should.eql(/^a\/b\/c(d|e)\/xyz\.md$/);
      mm.makeRe('a/b/c{d,e}/xyz.md').test('xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/xyz.md').should.be.true;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/xyz.md').should.be.true;
    });
  });

  describe('double stars:', function () {
    it('should create a regular expression for double stars:', function () {
      // mm.makeRe('a/**/z/*.md').should.eql(/^a\/[\s\S]+\/z\/[^\/]*?\.md$/);
      mm.makeRe('a/**/z/*.md').test('.gitignore').should.be.false;
      mm.makeRe('a/**/z/*.md').test('a/b/z/.gitignore').should.be.false;
      mm.makeRe('a/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.true;

      // mm.makeRe('a/**/j/**/z/*.md').should.eql(/^a\/[\s\S]+\/j\/[\s\S]+\/z\/[^\/]*?\.md$/);
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.false;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.md').should.be.true;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/j/n/p/o/z/foo.md').should.be.true;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.txt').should.be.false;

      var re = /^a\/b\/[\s\S]+\/c(d|e)\/[\s\S]+\/xyz\.md$/;
      // mm.makeRe('a/b/**/c{d,e}/**/xyz.md').should.eql(re);
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/d/xyz.md').should.be.false;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/c/xyz.md').should.be.false;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/foo/cd/bar/xyz.md').should.be.true;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/baz/ce/fez/xyz.md').should.be.true;
    });
  });

  describe('negation', function () {
    it.skip('should create a regular expression for negating extensions:', function () {
      // mm.makeRe('!.md').should.eql(/^(?!\.md)$/);
      mm.makeRe('!.md').test('.md').should.be.false;
      mm.makeRe('!.md').test('foo.md').should.be.true;
    });

    it('should create a regular expression for negating files with extensions:', function () {
      // mm.makeRe('!*.md').should.eql(/^(?!((?!\.)[^\/]*?\.md)$)/);
      mm.makeRe('!*.md').test('abc.md').should.be.false;
      mm.makeRe('!*.md').test('abc.txt').should.be.true;
      mm.makeRe('!*.md').test('.dotfile.md').should.be.true;
      mm.makeRe('!*.md').test('.dotfile.txt').should.be.true;
    });

    it('should create a regular expression for slashes:', function () {
      // mm.makeRe('a/b/c/*.md').should.eql(/^a\/b\/c\/[^\/]*?\.md$/);
      mm.makeRe('a/b/c/*.md').test('.gitignore').should.be.false;
      mm.makeRe('a/b/c/*.md').test('a/b/c/.gitignore').should.be.false;
      mm.makeRe('a/b/c/*.md').test('a/b/c/foo.md').should.be.true;
      mm.makeRe('a/b/c/*.md').test('a/b/c/bar.md').should.be.true;
    });

    it('should create a regular brace expansion:', function () {
      // mm.makeRe('a/b/c{d,e}/*.md').should.eql(/^a\/b\/c(d|e)\/[^\/]*?\.md$/);
      mm.makeRe('a/b/c{d,e}/*.md').test('iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/iii.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/iii.md').should.be.true;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/iii.md').should.be.true;

      // mm.makeRe('a/b/c{d,e}/xyz.md').should.eql(/^a\/b\/c(d|e)\/xyz\.md$/);
      mm.makeRe('a/b/c{d,e}/xyz.md').test('xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/xyz.md').should.be.false;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/xyz.md').should.be.true;
      mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/xyz.md').should.be.true;
      mm.makeRe('a/b/c{d,e{f,g}}/*.md').test('a/b/cef/xyz.md').should.be.true;
      mm.makeRe('a/b/c{d,e{f,g}}/*.md').test('a/b/ceg/xyz.md').should.be.true;
      mm.makeRe('a/b/c{d,e{f,g}}/*.md').test('a/b/cd/xyz.md').should.be.true;
    });

    it.skip('should match dotfiles:', function () {
      mm.makeRe('a/**/z/*.md').test('a/b/z/.dotfile.md').should.be.true;
      mm.makeRe('a/**/z/*.md').test('a/b/z/.dotfile').should.be.false;
    });

    it('should create a regular expression for double stars:', function () {
      // mm.makeRe('a/**/z/*.md').should.eql(/^a\/[\s\S]+\/z\/[^\/]*?\.md$/);
      mm.makeRe('a/**/z/*.md').test('.gitignore').should.be.false;
      mm.makeRe('a/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.true;

      // mm.makeRe('a/**/j/**/z/*.md').should.eql(/^a\/[\s\S]+\/j\/[\s\S]+\/z\/[^\/]*?\.md$/);
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.false;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.md').should.be.true;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/j/n/p/o/z/foo.md').should.be.true;
      mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.txt').should.be.false;

      var re1 = /^a\/b\/[\s\S]+\/c(d|e)\/[\s\S]+\/xyz\.md$/;
      // mm.makeRe('a/b/**/c{d,e}/**/xyz.md').should.eql(re1);
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/d/xyz.md').should.be.false;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/c/xyz.md').should.be.false;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/foo/cd/bar/xyz.md').should.be.true;
      mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/baz/ce/fez/xyz.md').should.be.true;

      var re2 = /^a\/b\/[\s\S]+\/c(d|e)(f|g)\/[\s\S]+\/xyz\.md$/;
      // mm.makeRe('a/b/**/c{d,e}{f,g}/**/xyz.md').should.eql(re2);
    });
  });


  describe('options', function () {
    it('should support the `matchBase` option:', function () {
      mm.makeRe('*.md').test('a/b/c/foo.md').should.be.false;
      // mm.makeRe('*.md', {matchBase: true}).test('a/b/c/foo.md').should.be.true;
    });

    it('should support the `nocase` option:', function () {
      mm.makeRe('a/b/c/*.md').test('a/b/d/e.md').should.be.false;
      mm.makeRe('A/b/C/*.md').test('a/b/c/e.md').should.be.false;
      mm.makeRe('A/b/C/*.md', {nocase: true}).test('a/b/c/e.md').should.be.true;
      mm.makeRe('A/b/C/*.MD', {nocase: true}).test('a/b/c/e.md').should.be.true;
    });

    it('should match dotfiles when `dotfile` is true:', function () {
      // mm.makeRe('*.md', {dot: true}).should.eql(/^[^\/]*?[^\/]*?\.md$/);
      mm.makeRe('.gitignore', {dot: true}).test('.gitignore').should.be.true;
      mm.makeRe('*.md', {dot: true}).test('foo.md').should.be.true;
      mm.makeRe('*.md', {dot: true}).test('.verb.txt').should.be.false;
      mm.makeRe('*.md', {dot: true}).test('a/b/c/.gitignore').should.be.false;
      mm.makeRe('*.md', {dot: true}).test('a/b/c/.gitignore.md').should.be.false;
      mm.makeRe('*.md', {dot: true}).test('.verb.txt').should.be.false;
      mm.makeRe('*.md', {dot: true}).test('.gitignore').should.be.false;
      mm.makeRe('*.*', {dot: true}).test('.gitignore').should.be.true;
      mm.makeRe('*.md', {dot: true}).test('.gitignore.md').should.be.true;
      mm.makeRe('*.md').test('a/b/c/.gitignore.md').should.be.false;
      // mm.makeRe('**/*.md').test('a/b/c/.gitignore.md').should.be.false;
      mm.makeRe('**/.*.md').test('a/b/c/.gitignore.md').should.be.true;
      mm.makeRe('**/.*').test('a/b/c/.gitignore.md').should.be.true;
      mm.makeRe('**/*.md', {dot: true}).test('a/b/c/.verb.md').should.be.true;
    });
  });
});
