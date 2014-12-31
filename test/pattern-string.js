/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

var files = ['a', 'b', 'c', 'd', 'a/a', 'a/b', 'a/b.js', 'a/c.js', 'a/b/c/d.js', '.a/.js', 'a/b/.js', 'a/b.md', 'a/b.txt']

describe('micromatch string patterns', function () {
  it('should unixify file paths', function () {
    path.sep = '\\';
    mm.match(['a\\b\\c.md'], '**/*.md').should.eql(['a/b/c.md']);
    mm.match(['a/b/c.md'], '**/*.md').should.eql(['a/b/c.md']);
    mm.match(['E:/a/b/c.md'], 'E:/**/*.md').should.eql(['//a/b/c.md']);
    mm.match(['E:\\a\\b\\c.md'], 'E:**/*.md').should.eql(['/a/b/c.md']);
  });

  describe('file extensions:', function () {
    it('should match extensions:', function () {
      mm(['.md'], '.md').should.eql(['.md']);
      mm(['.txt'], '.md').should.eql([]);
      mm(['.gitignore'], '.md').should.eql([]);
    });
  });

  describe('common patterns:', function () {
    it('should match directories:', function () {
      mm.match(['a/'], 'a/*').should.eql([]);
      mm.match(['a/'], 'a/').should.eql(['a/']);
    });

    it('should match files:', function () {
      mm.match(files, 'a/*').should.eql(['a/a', 'a/b', 'a/b.js',  'a/c.js', 'a/b.md', 'a/b.txt']);
      mm.match(files, 'a*').should.eql(['a']);
    });
  });

  describe('file names:', function () {
    it('should match files with the given extension:', function () {
      mm(['.md', '.txt'], '.md').should.eql(['.md']);
      mm(['a.md', 'b.js', 'c.txt'], '*.{js,txt}').should.eql(['b.js', 'c.txt']);
      mm(['.d.md'], '.*.md').should.eql(['.d.md']);
      mm(['d.md'], '*.md').should.eql(['d.md']);
      mm(['a/b/c/d.md'], '*.md').should.eql([]);
    });

    it('should match files with the given extension:', function () {
      mm(['a.md', 'b.js', 'c.txt'], '!*.{js,txt}').should.eql(['a.md']);
      mm(['a.md', 'b.js', 'c.txt'], '!**/*.{js,txt}').should.eql(['a.md']);
      mm(['a.md', 'b.js', 'c.txt', 'd.json'], ['*.*', '!*.{js,txt}']).should.eql(['a.md', 'd.json']);
    });

    it('should not match dotfiles, even if the dotfile name equals the extension:', function () {
      mm(['.gitignore'], '*.md').should.eql([]);
      mm(['.verb.txt'], '*.md').should.eql([]);
    });
  });

  describe('file paths:', function () {
    it('should create a regular expression for file paths:', function () {
      mm(['.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm(['.gitignore.md'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/d.gitignore.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.gitignore.md']);
      mm(['a/b/d/.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/xyz.md'], 'a/b/c/*.md').should.eql(['a/b/c/xyz.md']);
      mm(['a/b/c/.xyz.md'], 'a/b/c/.*.md').should.eql(['a/b/c/.xyz.md']);
      mm(['a/bb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bb/c/xyz.md']);
      mm(['a/bbbb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bbbb/c/xyz.md']);
      mm(['a/bb.bb/c/xyz.md'], 'a/*/c/*.md').should.eql(['a/bb.bb/c/xyz.md']);
      mm(['a/bb.bb/aa/bb/aa/c/xyz.md'], 'a/**/c/*.md').should.eql(['a/bb.bb/aa/bb/aa/c/xyz.md']);
      mm(['a/bb.bb/aa/b.b/aa/c/xyz.md'], 'a/**/c/*.md').should.eql(['a/bb.bb/aa/b.b/aa/c/xyz.md']);
    });
  });

  describe('brace expansion:', function () {
    it('should create a regular brace expansion:', function () {
      mm(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/d/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/c/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/cd/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/iii.md']);
      mm(['a/b/ce/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/iii.md']);

      mm(['xyz.md'], 'a/b/c{d,e}/xyz.md').should.eql([]);
      mm(['a/b/d/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/c/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/cd/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/xyz.md']);
      mm(['a/b/ce/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/xyz.md']);
      mm(['a/b.js', 'a/c.js', 'a/d.js', 'a/e.js'], 'a/{c..e}.js').should.eql(['a/c.js', 'a/d.js', 'a/e.js']);
    });
  });

  describe('double stars:', function () {
    it('should create a regular expression for double stars:', function () {
      mm(['.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm(['a/b/z/.gitignore'], 'a/**/z/*.md').should.eql([]);
      mm(['a/b/c/d/e/z/d.md'], 'a/**/z/*.md').should.eql(['a/b/c/d/e/z/d.md']);

      mm(['a/b/c/d/e/z/d.md'], 'a/**/j/**/z/*.md').should.eql([]);
      mm(['a/b/c/j/e/z/d.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/j/e/z/d.md']);
      mm(['a/b/c/d/e/j/n/p/o/z/d.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/d/e/j/n/p/o/z/d.md']);
      mm(['a/b/c/j/e/z/d.txt'], 'a/**/j/**/z/*.md').should.eql([]);

      mm(['a/b/d/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm(['a/b/c/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm(['a/b/d/cd/e/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/d/cd/e/xyz.md']);
      mm(['a/b/baz/ce/fez/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/baz/ce/fez/xyz.md']);
    });
  });

  describe('negation', function () {
    it('should create a regular expression for negating extensions:', function () {
      mm(['.md'], '!.md').should.eql([]);
      mm(['d.md'], '!.md').should.eql(['d.md']);
      mm(['d.md'], ['!.md']).should.eql([]);
      mm(['d.md'], ['*', '!.md']).should.eql(['d.md']);
    });

    it('should negate basenames based on extension:', function () {
      mm(['abc.md'], '!*.md').should.eql([]);
      mm(['abc.txt'], '!*.md').should.eql(['abc.txt']);
      mm(['.dotfile.md'], '!*.md').should.eql(['.dotfile.md']);
      mm(['.dotfile.txt'], '!*.md').should.eql(['.dotfile.txt']);
    });

    it('should match full paths:', function () {
      mm(['.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/.gitignore'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/d.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.md']);
      mm(['a/b/c/e.md'], 'a/b/c/*.md').should.eql(['a/b/c/e.md']);
      mm(['a/b.md', 'a/c.txt'], 'a/*.md').should.eql(['a/b.md']);
      mm(['a/b.md', 'a/c.txt'], 'a/*.txt').should.eql(['a/c.txt']);
    });

    it('should create a regex for brace expansion:', function () {
      mm(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/d/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/c/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/cd/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/iii.md']);
      mm(['a/b/ce/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/iii.md']);

      mm(['xyz.md'], 'a/b/c{d,e}/xyz.md').should.eql([]);
      mm(['a/b/d/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/c/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
      mm(['a/b/cd/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/xyz.md']);
      mm(['a/b/ce/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/xyz.md']);
      mm(['a/b/cef/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cef/xyz.md']);
      mm(['a/b/ceg/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/ceg/xyz.md']);
      mm(['a/b/cd/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cd/xyz.md']);
    });

    it('should create a regular expression for double stars:', function () {
      mm(['.gitignore'], 'a/**/z/*.md').should.eql([]);

      mm(['a/b/z/.dotfile.md'], 'a/**/z/.*.md').should.eql(['a/b/z/.dotfile.md']);
      mm(['a/b/z/.dotfile'], 'a/**/z/*.md').should.eql([]);
      mm(['a/b/c/d/e/z/d.md'], 'a/**/z/*.md').should.eql(['a/b/c/d/e/z/d.md']);

      mm(['a/b/c/d/e/z/d.md'], 'a/**/j/**/z/*.md').should.eql([]);
      mm(['a/b/c/j/e/z/d.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/j/e/z/d.md']);
      mm(['a/b/c/d/e/j/n/p/o/z/d.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/d/e/j/n/p/o/z/d.md']);
      mm(['a/b/c/j/e/z/d.txt'], 'a/**/j/**/z/*.md').should.eql([]);

      mm(['a/b/d/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm(['a/b/c/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm(['a/b/d/cd/e/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/d/cd/e/xyz.md']);
      mm(['a/b/baz/ce/fez/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/baz/ce/fez/xyz.md']);
    });
  });


  describe('options', function () {
    it('should support the `matchBase` option:', function () {
      mm(['a/b/c/d.md'], '*.md').should.eql([]);
      mm(['a/b/c/d.md'], '*.md', {matchBase: true}).should.eql(['a/b/c/d.md']);
    });

    it('should support the `nocase` option:', function () {
      mm(['a/b/d/e.md'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/e.md'], 'A/b/C/*.md').should.eql([]);
      mm(['a/b/c/e.md'], 'A/b/C/*.md', {nocase: true}).should.eql(['a/b/c/e.md']);
      mm(['a/b/c/e.md'], 'A/b/C/*.MD', {nocase: true}).should.eql(['a/b/c/e.md']);
    });

    it('should match dotfiles when `dotfile` is true:', function () {
      mm(['.gitignore'], '.gitignore', {dot: true}).should.eql(['.gitignore']);
      mm(['d.md'], '*.md', {dot: true}).should.eql(['d.md']);
      mm(['.verb.txt'], '*.md', {dot: true}).should.eql([]);
      mm(['a/b/c/.gitignore'], '*.md', {dot: true}).should.eql([]);
      mm(['a/b/c/.gitignore.md'], '*.md', {dot: true}).should.eql([]);
      mm(['.verb.txt'], '*.md', {dot: true}).should.eql([]);
      mm(['.gitignore'], '*.md', {dot: true}).should.eql([]);
      mm(['.gitignore'], '*.*', {dot: true}).should.eql(['.gitignore']);
      mm(['.gitignore.md'], '*.md', {dot: true}).should.eql(['.gitignore.md']);
      mm(['a/b/c/.gitignore.md'], '*.md').should.eql([]);
      mm(['a/b/c/.gitignore.md'], '**/.*.md').should.eql(['a/b/c/.gitignore.md']);
      mm(['a/b/c/.gitignore.md'], '**/.*').should.eql(['a/b/c/.gitignore.md']);
      mm(['a/b/c/.verb.md'], '**/*.md', {dot: true}).should.eql(['a/b/c/.verb.md']);
    });
  });
});
