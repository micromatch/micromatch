/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var mm = require('..');

describe('negation patterns', function () {
  describe('.match()', function () {
    it.skip('should create a regular expression for negating extensions:', function () {
      mm.match(['.md'], '!.md').should.eql([]);
      mm.match(['foo.md'], '!.md').should.eql(['foo.md']);
    });

    it('should create a regular expression for negating files with extensions:', function () {
      mm.match(['abc.md'], '!*.md').should.eql([]);
      // mm.match(['abc.txt'], '!*.md').should.eql(['abc.txt']);
      // mm.match(['.dotfile.md'], '!*.md').should.eql(['.dotfile.md']);
      // mm.match(['.dotfile.txt'], '!*.md').should.eql(['.dotfile.txt']);
    });

    it('should create a regular expression for slashes:', function () {
      mm.match(['.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/foo.md'], 'a/b/c/*.md').should.eql(['a/b/c/foo.md']);
      mm.match(['a/b/c/bar.md'], 'a/b/c/*.md').should.eql(['a/b/c/bar.md']);
    });

    it('should create a regex for brace expansion:', function () {
      mm.match(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm.match(['a/b/d/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm.match(['a/b/c/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm.match(['a/b/cd/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/iii.md']);
      mm.match(['a/b/ce/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/iii.md']);

      mm.match(['xyz.md'], 'a/b/c{d,e}/xyz.md').should.eql([]);
      mm.match(['a/b/d/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm.match(['a/b/c/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm.match(['a/b/cd/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/xyz.md']);
      mm.match(['a/b/ce/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/xyz.md']);
      mm.match(['a/b/cef/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cef/xyz.md']);
      mm.match(['a/b/ceg/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/ceg/xyz.md']);
      mm.match(['a/b/cd/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cd/xyz.md']);
    });

    it('should create a regular expression for double stars:', function () {
      mm.match(['.gitignore'], 'a/**/z/*.md').should.eql([]);

      mm.match(['a/b/z/.dotfile.md'], 'a/**/z/*.md').should.eql(['a/b/z/.dotfile.md']);
      mm.match(['a/b/z/.dotfile'], 'a/**/z/*.md').should.eql([]);
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
  });
});
