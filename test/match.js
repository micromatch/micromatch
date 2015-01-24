/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}
if ('wildmatch' in argv) {
  mm = ref.wildmatch;
}

describe('micromatch', function () {
  describe('basic patterns:', function () {
    it('should correctly deal with empty globs', function () {
      mm.match(['ab'], '').should.eql([]);
      mm.match(['a'], '').should.eql([]);
      mm.match(['.'], '').should.eql([]);
    });

    it('should match with non-glob patterns', function () {
      mm.match(['.'], '.').should.eql(['.']);
      mm.match(['ab'], 'ab').should.eql(['ab']);
      mm.match(['ab', 'a'], 'a').should.eql(['a']);
      mm.match(['ab', 'a'], '/a').should.eql([]);
      mm.match(['/ab', '/a'], '/a').should.eql(['/a']);
    });
  });

  describe('paths/extensions', function () {
    it('should match with common glob patterns', function () {
      mm.match(['/ab', '/cd', 'ef'], '/*').should.eql(['/ab', '/cd']);
      mm.match(['ab'], './*').should.eql([]);
      mm.match(['./ab'], './*').should.eql(['./ab']);
      mm.match(['ab'], '*').should.eql(['ab']);
      mm.match(['ab'], 'ab').should.eql(['ab']);
    });

    it('should match one directory level:', function () {
      mm.match(['a/b/c/e', 'a/b/c/d/e'], 'a/b/*/e').should.eql(['a/b/c/e']);
      mm.match(['a/b/c/e', 'b/b/c/e', 'a/b/c/d/e'], '*/b/*/e').should.eql(['a/b/c/e', 'b/b/c/e']);
    });

    it('should match multiple directory levels:', function () {
      mm.match(['a/b/c/e', 'a/b/c/d/e'], 'a/b/**/e').should.eql(['a/b/c/e', 'a/b/c/d/e']);
    });
  });


  describe('paths/filenames:', function () {
    it('should match files with the given extension:', function () {
      mm.match(['.md', '.txt'], '*.md').should.eql([]);
      mm.match(['.md', '.txt'], '.md').should.eql(['.md']);
      mm.match(['.foo.md'], '*.md').should.eql([]);
      mm.match(['foo.md'], '*.md').should.eql(['foo.md']);
      mm.match(['a/b/c/foo.md'], '*.md').should.eql([]);
    });

    it('should not match dotfiles when `dot` or `dotfiles` are not set:', function () {
      mm.match(['.foo.md'], '*.md').should.eql([]);
      mm.match(['a/.foo.md'], '*.md').should.eql([]);
      mm.match(['a/.foo.md'], 'a/.foo.md').should.eql(['a/.foo.md']);
      mm.match(['.a'], '*.md').should.eql([]);
      mm.match(['.verb.txt'], '*.md').should.eql([]);
      mm.match(['a/b/c/.xyz.md'], 'a/b/c/.*.md').should.eql(['a/b/c/.xyz.md']);
      mm.match(['.md'], '.md').should.eql(['.md']);
      mm.match(['.txt'], '.md').should.eql([]);
      mm.match(['.a'], '.md').should.eql([]);
      mm.match(['.a'], '.a').should.eql(['.a']);
      mm.match(['.b'], '.b*').should.eql(['.b']);
      mm.match(['.ab', '.a', '.b'], '.a*').should.eql(['.ab', '.a']);
      mm.match(['.ab', '.a', '.b'], '.*').should.eql(['.ab', '.a', '.b']);
      mm.match(['.ab', '.a', '.b'], '*.*').should.eql([]);
      mm.match(['.a'], 'a/b/c/*.md').should.eql([]);
      mm.match(['.a.md'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/d.a.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.a.md']);
      mm.match(['a/b/d/.a'], 'a/b/c/*.md').should.eql([]);
    });

    it('should match dotfiles when `dot` or `dotfiles` is set:', function () {
      mm.match(['.foo.md'], '*.md', {dot: true}).should.eql(['.foo.md']);
      mm.match(['.foo.md'], '.*', {dot: true}).should.eql(['.foo.md']);
      mm.match(['a/b/c/.xyz.md'], 'a/b/c/*.md', {dot: true}).should.eql(['a/b/c/.xyz.md']);
    });
  });

  describe('paths/filepaths:', function () {
    it('should match file paths:', function () {
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
      mm.match(['.a'], 'a/**/z/*.md').should.eql([]);
      mm.match(['a/b/z/.a'], 'a/**/z/*.md').should.eql([]);
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
      mm.match(['./.a'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/z/.a'], 'a/**/z/*.md').should.eql([]);
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
