/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('..');

if ('multimatch' in argv || 'minimatch' in argv) {
  mm = require('multimatch');
}

var files = ['a', 'b', 'c', 'd', 'a/a', 'a/b', 'a/b.js', 'a/c.js', 'a/b/c/d.js', '.a/.js', 'a/b/.js', 'a/b.md', 'a/b.txt']

describe('micromatch string patterns', function () {
  it('should handle windows paths', function () {
    mm(['a/b/c.md'], '**/*.md').should.eql(['a/b/c.md']);
    mm(['E:/a/b/c.md'], 'E:/**/*.md').should.eql(['E:/a/b/c.md']);
  });

  it('should unixify file paths', function () {
    if (path.sep === '\\') {
      mm(['a\\b\\c.md'], '**/*.md').should.eql(['a/b/c.md']);
    }
    mm(['a\\b\\c.md'], '**/*.md', {unixify: true}).should.eql(['a/b/c.md']);
  });

  it('should unixify absolute paths', function () {
    if (path.sep === '\\') {
      mm(['E:\\a\\b\\c.md'], 'E:/**/*.md').should.eql(['E:/a/b/c.md']);
    }
    mm(['E:\\a\\b\\c.md'], 'E:/**/*.md', {unixify: true}).should.eql(['E:/a/b/c.md']);
  });

  it('should unixify patterns', function () {
    if (path.sep === '\\') {
      mm(['a\\b\\c.md'], '**\\*.md').should.eql(['a/b/c.md']);
      mm(['E:\\a\\b\\c.md'], 'E:\\**\\*.md').should.eql(['E:/a/b/c.md']);
    }
    mm(['a\\b\\c.md'], '**\\*.md', {unixify: true}).should.eql(['a/b/c.md']);
    mm(['E:\\a\\b\\c.md'], 'E:\\**\\*.md', {unixify: true}).should.eql(['E:/a/b/c.md']);
  });

  describe('file extensions:', function () {
    it('should match extensions:', function () {
      mm(['.md'], '.md').should.eql(['.md']);
      mm(['.txt'], '.md').should.eql([]);
      mm(['.dotfile'], '.md').should.eql([]);
    });
  });

  describe('common patterns:', function () {
    it('should match directories:', function () {
      mm(['a/'], 'a/*').should.eql([]);
      mm(['a/'], 'a/').should.eql(['a/']);
    });

    it('should match files:', function () {
      mm(files, 'a/*').should.eql(['a/a', 'a/b', 'a/b.js',  'a/c.js', 'a/b.md', 'a/b.txt']);
      mm(files, 'a*').should.eql(['a']);
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
      mm(['a.md', 'a.min.js', 'b.js', 'c.txt'], '!*.{min.js,txt}').should.eql(['a.md', 'b.js']);
      mm(['a.md', 'b.js', 'c.txt'], '!*.{js,txt}').should.eql(['a.md']);
      mm(['a.md', 'b.js', 'c.txt', 'a/b.js', 'a/b.md'], '!{,**/}*.{js,txt}').should.eql(['a.md', 'a/b.md']);
      mm(['a.md', 'b.js', 'c.txt', 'd.json'], ['*.*', '!*.{js,txt}']).should.eql(['a.md', 'd.json']);
    });

    it('should not match dotfiles, even if the dotfile name equals the extension:', function () {
      mm(['.dotfile'], '*.md').should.eql([]);
      mm(['.verb.txt'], '*.md').should.eql([]);
    });
  });

  describe('file paths:', function () {
    it('should create a regular expression for file paths:', function () {
      mm(['.dotfile'], 'a/b/c/*.md').should.eql([]);
      mm(['.dotfile.md'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/d.dotfile.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.dotfile.md']);
      mm(['a/b/d/.dotfile'], 'a/b/c/*.md').should.eql([]);
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
      mm(['.dotfile'], 'a/**/z/*.md').should.eql([]);
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

  describe('negation', function () {
    it('should create a regular expression for negating extensions:', function () {
      mm(['.md'], '!.md').should.eql([]);
      mm(['d.md'], '!.md').should.eql(['d.md']);
      mm(['d.md'], '!*.md').should.eql([]);
    });

    it('should be inclusive by default when the pattern is a string:', function () {
      mm(['abc.md'], '!*.md').should.eql([]);
      mm(['abc.md', 'abc.txt'], '!*.md').should.eql(['abc.txt']);
      mm(['abc.txt'], '!*.md').should.eql(['abc.txt']);
    });

    it('should not be inclusive of dotfiles by default unless `dot: true` is set:', function () {
      mm(['.dotfile.md'], '!*.md').should.eql(['.dotfile.md']);
      mm(['.dotfile.md'], '!.*.md').should.eql([]);
      mm(['.a.txt', '.a.md'], '!.*.md').should.eql(['.a.txt']);
    });

    it('should be exclusive by default when the pattern is an array:', function () {
      mm(['abc.txt'], ['!*.md']).should.eql([]);
      mm(['abc.txt'], ['*', '!*.md']).should.eql(['abc.txt']);
    });

    it('should match full paths:', function () {
      mm(['.md'], 'a/b/*.md').should.eql([]);
      mm(['a/b.md', 'a/c.txt'], 'a/*.md').should.eql(['a/b.md']);
      mm(['a/b.md', 'a/c.txt'], 'a/*.txt').should.eql(['a/c.txt']);
      mm(['a/b/.md'], 'a/b/*.md').should.eql([]);
      mm(['a/b/a.md'], 'a/b/*.md').should.eql(['a/b/a.md']);
      mm(['a/b/c/.dotfile'], 'a/b/c/*.md').should.eql([]);
      mm(['a/b/c/d.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.md']);
      mm(['a/b/c/e.md'], 'a/b/c/*.md').should.eql(['a/b/c/e.md']);
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
      mm(['.dotfile'], 'a/**/z/*.md').should.eql([]);

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
      mm(['.dotfile'], '*.*', {dot: true}).should.eql(['.dotfile']);
      mm(['.dotfile'], '*.md', {dot: true}).should.eql([]);
      mm(['.dotfile'], '.dotfile', {dot: true}).should.eql(['.dotfile']);
      mm(['.dotfile.md'], '.*.md', {dot: true}).should.eql(['.dotfile.md']);
      mm(['.verb.txt'], '*.md', {dot: true}).should.eql([]);
      mm(['.verb.txt'], '*.md', {dot: true}).should.eql([]);
      mm(['a/b/c/.dotfile'], '*.md', {dot: true}).should.eql([]);
      mm(['a/b/c/.dotfile.md'], '**/*.md', {dot: true}).should.eql(['a/b/c/.dotfile.md']);
      mm(['a/b/c/.dotfile.md'], '**/.*').should.eql(['a/b/c/.dotfile.md']);
      mm(['a/b/c/.dotfile.md'], '**/.*.md').should.eql(['a/b/c/.dotfile.md']);
      mm(['a/b/c/.dotfile.md'], '*.md').should.eql([]);
      mm(['a/b/c/.dotfile.md'], '*.md', {dot: true}).should.eql([]);
      mm(['a/b/c/.verb.md'], '**/*.md', {dot: true}).should.eql(['a/b/c/.verb.md']);
      mm(['d.md'], '*.md', {dot: true}).should.eql(['d.md']);
    });
  });
});
