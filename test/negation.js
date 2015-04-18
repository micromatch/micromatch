/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref;
}

describe('negation patterns', function () {
  describe('.match()', function () {
    it('should create a regular expression for negating extensions:', function () {
      mm.match(['.md'], '!.md').should.eql([]);
      mm.match(['foo.md'], '!.md').should.eql(['foo.md']);
      mm.match(['foo.md'], '!*.md').should.eql([]);
    });

    it('should negate files with extensions:', function () {
      mm.match(['abc.md'], '!*.md').should.eql([]);
      mm.match(['abc.txt'], '!*.md').should.eql(['abc.txt']);
      mm.match(['a.js', 'b.md', 'c.txt'], '!**/*.md').should.eql(['a.js', 'c.txt']);
    });

    it('should negate dotfiles:', function () {
      mm.match(['.dotfile.md'], '!*.md').should.eql(['.dotfile.md']);
      mm.match(['.dotfile.txt'], '!*.md').should.eql(['.dotfile.txt']);
      mm.match(['.gitignore', 'a', 'b'], '!.gitignore').should.eql(['a', 'b']);
    });

    it('should negate files in the immediate directory:', function () {
      mm.match(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!*.md').should.eql(['a/b.js', 'a.js', 'a/b.md']);
    });

    it('should negate files in any directory:', function () {
      mm.match(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!**/*.md').should.eql(['a/b.js', 'a.js']);
    });

    it('should create a regular expression for double stars:', function () {
      mm.match(['.gitignore'], 'a/**/z/*.md').should.eql([]);

      mm.match(['a/b/z/.dotfile.md'], 'a/**/z/.*.md').should.eql(['a/b/z/.dotfile.md']);
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
