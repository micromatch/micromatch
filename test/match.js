/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

describe('micromatch', function () {
  describe('file extensions:', function () {
    it('should create a regular expression for matching extensions:', function () {
      mm.match(['.md'], '.md').should.eql(['.md']);
      mm.match(['.txt'], '.md').should.eql([]);
      mm.match(['.gitignore'], '.md').should.eql([]);
    });
  });

  describe('file names:', function () {
    it('should match files with the given extension:', function () {
      mm.match(['.md', '.txt'], '*.md').should.eql([]);
      mm.match(['.foo.md'], '*.md').should.eql([]);
      mm.match(['foo.md'], '*.md').should.eql(['foo.md']);
      mm.match(['a/b/c/foo.md'], '*.md').should.eql([]);
    });

    it('should not match dotfiles, even if the dotfile name equals the extension:', function () {
      mm.match(['.foo.md'], '*.md', {dot: true}).should.eql(['.foo.md']);
      mm.match(['.foo.md'], '.*', {dot: true}).should.eql(['.foo.md']);
      mm.match(['.gitignore'], '*.md').should.eql([]);
      mm.match(['.verb.txt'], '*.md').should.eql([]);
      // mm.match(['a/b/c/.xyz.md'], 'a/b/c/*.md').should.eql(['a/b/c/.xyz.md']);
    });
  });

  describe('file paths:', function () {
    it('should create a regular expression for file paths:', function () {
      mm.match(['.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm.match(['.gitignore.md'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/d.gitignore.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.gitignore.md']);
      mm.match(['a/b/d/.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/xyz.md'], 'a/b/c/*.md').should.eql(['a/b/c/xyz.md']);
      mm.match(['a/bb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bb/c/xyz.md']);
      mm.match(['a/bbbb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bbbb/c/xyz.md']);
      mm.match(['a/bb.bb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bb.bb/c/xyz.md']);
      mm.match(['a/bb.bb/aa/bb/aa/c/xyz.md'], 'a/**/c/*.md').should.eql(['a/bb.bb/aa/bb/aa/c/xyz.md']);
      mm.match(['a/bb.bb/aa/b.b/aa/c/xyz.md'], 'a/**/c/*.md').should.eql(['a/bb.bb/aa/b.b/aa/c/xyz.md']);
    });
  });

  describe('double stars:', function () {
    it('should match full file paths:', function () {
      mm.match(['.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm.match(['a/b/z/.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm.match(['a/b/c/d/e/z/foo.md'], 'a/**/z/*.md').should.eql(['a/b/c/d/e/z/foo.md']);

      mm.match(['a/b/c/d/e/z/foo.md'], 'a/**/j/**/z/*.md').should.eql([]);
      mm.match(['a/b/c/j/e/z/foo.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/j/e/z/foo.md']);
      mm.match(['a/b/c/d/e/j/n/p/o/z/foo.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/d/e/j/n/p/o/z/foo.md']);
      mm.match(['a/b/c/j/e/z/foo.txt'], 'a/**/j/**/z/*.md').should.eql([]);

      mm.match(['a/b/d/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['a/b/c/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['a/b/foo/cd/bar/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/foo/cd/bar/xyz.md']);
      mm.match(['a/b/baz/ce/fez/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/baz/ce/fez/xyz.md']);
    });

    it('should match paths with leading `./`:', function () {
      mm.match(['./.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/z/.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/d/e/z/foo.md'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/d/e/z/foo.md'], './a/**/z/*.md').should.eql(['./a/b/c/d/e/z/foo.md']);

      mm.match(['./a/b/c/d/e/z/foo.md'], './a/**/j/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/j/e/z/foo.md'], './a/**/j/**/z/*.md').should.eql(['./a/b/c/j/e/z/foo.md']);
      mm.match(['./a/b/c/d/e/j/n/p/o/z/foo.md'], './a/**/j/**/z/*.md').should.eql(['./a/b/c/d/e/j/n/p/o/z/foo.md']);
      mm.match(['./a/b/c/j/e/z/foo.txt'], './a/**/j/**/z/*.md').should.eql([]);

      mm.match(['./a/b/d/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['./a/b/c/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['./a/b/foo/cd/bar/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql(['./a/b/foo/cd/bar/xyz.md']);
      mm.match(['./a/b/baz/ce/fez/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql(['./a/b/baz/ce/fez/xyz.md']);
    });
  });
});
