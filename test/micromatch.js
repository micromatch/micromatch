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
var mm = require('..');

if ('multimatch' in argv) {
  mm = require('multimatch');
}

describe('micromatch array patterns', function () {
  it('should match file extensions:', function () {
    mm(['.md'], ['.md']).should.eql(['.md']);
    mm(['.txt'], ['.md']).should.eql([]);
    mm(['.gitignore'], ['.md']).should.eql([]);
  });

  it('should match files with the given extension:', function () {
    mm(['a.md', 'a.txt'], ['*.md']).should.eql(['a.md']);
    mm(['.d.md'], ['.*.md']).should.eql(['.d.md']);
    mm(['d.md'], ['*.md']).should.eql(['d.md']);
    mm(['a/b/c/d.md'], ['*.md']).should.eql([]);
  });
  it('should not match dotfiles by default:', function () {
    mm(['.gitignore'], ['*.md']).should.eql([]);
    mm(['.verb.txt'], ['*.md']).should.eql([]);
  });

  describe('file paths:', function () {
    it('should match full file paths using an array of patterns:', function () {
      mm(['a/b/c.md', 'a/b/c.txt'], '!**/*.txt').should.eql(['a/b/c.md']);
      mm(['.gitignore'], ['a/b/c/*.md']).should.eql([]);
      mm(['.gitignore.md'], ['a/b/c/*.md']).should.eql([]);
      mm(['a.js'], ['*.js']).should.eql(['a.js']);
      mm(['a.js', 'b.js', 'a/b.js'], ['**/*.js']).should.eql(['a.js', 'b.js', 'a/b.js']);
      mm(['a/b/c/d.gitignore.md'], ['a/b/c/*.md']).should.eql(['a/b/c/d.gitignore.md']);
      mm(['a/b/d/.gitignore'], ['a/b/c/*.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/*/c/*.md']).should.eql(['a/b/c/xyz.md']);
      mm(['a/b/c/xyz.md'], ['a/**/*.md']).should.eql(['a/b/c/xyz.md']);
      mm(['a/b/c/d/e/f/xyz.md'], ['a/**/*.md']).should.eql(['a/b/c/d/e/f/xyz.md']);
      mm(['a/b/c/.xyz.md'], ['a/b/c/.*.md']).should.eql(['a/b/c/.xyz.md']);
      mm(['a/bb/c/xyz.md'], ['a/*/c/*.md']).should.eql(['a/bb/c/xyz.md']);
      mm(['a/bbbb/c/xyz.md'], ['a/*/c/*.md']).should.eql(['a/bbbb/c/xyz.md']);
      mm(['a/bb.bb/c/xyz.md'], ['a/*/c/*.md']).should.eql(['a/bb.bb/c/xyz.md']);
      mm(['a/bb.bb/aa/bb/aa/c/xyz.md'], ['a/**/c/*.md']).should.eql(['a/bb.bb/aa/bb/aa/c/xyz.md']);
      mm(['a/bb.bb/aa/b.b/aa/c/xyz.md'], ['a/**/c/*.md']).should.eql(['a/bb.bb/aa/b.b/aa/c/xyz.md']);
    });

    it('matchBase / negation:', function () {
      mm(['a/b/c.md', 'a/b/c.txt'], ['*', '!*.md'], {matchBase: true}).should.eql(['a/b/c.txt']);
    });
  });


  describe('special characters:', function () {
    it('should match one character per question mark:', function () {
      mm(['a/b/c.md'], ['a/?/c.md']).should.eql(['a/b/c.md']);
      mm(['a/bb/c.md'], ['a/?/c.md']).should.eql([]);
      mm(['a/bb/c.md'], ['a/??/c.md']).should.eql(['a/bb/c.md']);
      mm(['a/bbb/c.md'], ['a/??/c.md']).should.eql([]);
      mm(['a/bbb/c.md'], ['a/???/c.md']).should.eql(['a/bbb/c.md']);
      mm(['a/bbbb/c.md'], ['a/????/c.md']).should.eql(['a/bbbb/c.md']);
    });

    it('should match multiple groups of question marks:', function () {
      mm(['a/bb/c/dd/e.md'], ['a/?/c/?/e.md']).should.eql([]);
      mm(['a/b/c/d/e.md'], ['a/?/c/?/e.md']).should.eql(['a/b/c/d/e.md']);
      mm(['a/b/c/d/e.md'], ['a/?/c/???/e.md']).should.eql([]);
      mm(['a/b/c/zzz/e.md'], ['a/?/c/???/e.md']).should.eql(['a/b/c/zzz/e.md']);
    });

    it('should use special characters and glob stars together:', function () {
      mm(['a/b/c/d/e.md'], ['a/?/c/?/*/e.md']).should.eql([]);
      mm(['a/b/c/d/e/e.md'], ['a/?/c/?/*/e.md']).should.eql(['a/b/c/d/e/e.md']);
      mm(['a/b/c/d/efghijk/e.md'], ['a/?/c/?/*/e.md']).should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/b/c/d/efghijk/e.md'], ['a/?/**/e.md']).should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/bb/c/d/efghijk/e.md'], ['a/?/**/e.md']).should.eql([]);
      mm(['a/b/c/d/efghijk/e.md'], ['a/*/?/**/e.md']).should.eql(['a/b/c/d/efghijk/e.md']);
      mm(['a/b/c/d/efgh.ijk/e.md'], ['a/*/?/**/e.md']).should.eql(['a/b/c/d/efgh.ijk/e.md']);
      mm(['a/b.bb/c/d/efgh.ijk/e.md'], ['a/*/?/**/e.md']).should.eql(['a/b.bb/c/d/efgh.ijk/e.md']);
      mm(['a/bbb/c/d/efgh.ijk/e.md'], ['a/*/?/**/e.md']).should.eql(['a/bbb/c/d/efgh.ijk/e.md']);
    });
  });

  describe('brace expansion:', function () {
    it('should expand braces:', function () {
      mm(['iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/d/iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/c/iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/cd/iii.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/cd/iii.md']);
      mm(['a/b/ce/iii.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/ce/iii.md']);

      mm(['xyz.md'], ['a/b/c{d,e}/xyz.md']).should.eql([]);
      mm(['a/b/d/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/cd/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/cd/xyz.md']);
      mm(['a/b/ce/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/ce/xyz.md']);
    });
  });

  describe('double stars:', function () {
    it('should match path segments:', function () {
      mm(['.gitignore'], ['a/**/z/*.md']).should.eql([]);
      mm(['a/b/z/.gitignore'], ['a/**/z/*.md']).should.eql([]);
      mm(['a/b/c/d/e/z/d.md'], ['a/**/z/*.md']).should.eql(['a/b/c/d/e/z/d.md']);

      mm(['a/b/c/d/e/z/d.md'], ['a/**/j/**/z/*.md']).should.eql([]);
      mm(['a/b/c/j/e/z/d.md'], ['a/**/j/**/z/*.md']).should.eql(['a/b/c/j/e/z/d.md']);
      mm(['a/b/c/d/e/j/n/p/o/z/d.md'], ['a/**/j/**/z/*.md']).should.eql(['a/b/c/d/e/j/n/p/o/z/d.md']);
      mm(['a/b/c/j/e/z/d.txt'], ['a/**/j/**/z/*.md']).should.eql([]);

      mm(['a/b/d/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/b/**/c{d,e}/**/*.md'])
      mm(['a/b/c/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md'])
      mm(['a/b/c/xyz.md'], ['a/b/**/c{d,e}/**/.*.md'])
      mm(['a/b/d/cd/e/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql(['a/b/d/cd/e/xyz.md']);
      mm(['a/b/baz/ce/fez/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql(['a/b/baz/ce/fez/xyz.md']);
    });
  });

  describe('negation', function () {
    it('should create a regular expression for negating extensions:', function () {
      mm(['.md'], ['!.md']).should.eql([]);
      mm(['d.md'], ['!.md']).should.eql([]);
      mm(['d.md'], ['*', '!.md']).should.eql(['d.md']);
      mm(['d.md', 'c.txt'], ['*', '!.md']).should.eql(['d.md', 'c.txt']);
      mm(['d.md', 'c.txt'], ['*', '!*.md']).should.eql(['c.txt']);
    });

    it('should negate files:', function () {
      mm(['abc.md'], ['!*.md']).should.eql([]);
      mm(['abc.md'], ['!**/*.md']).should.eql([]);
      mm(['abc.txt'], ['*', '!*.md']).should.eql(['abc.txt']);
      mm(['.dotfile.md'], ['!*.md']).should.eql([]);
      mm(['.dotfile.txt'], ['.*', '!*.md']).should.eql(['.dotfile.txt']);
    });

    it('should match on full paths:', function () {
      mm(['.gitignore'], ['a/b/c/*.md']).should.eql([]);
      mm(['a/b/c/.gitignore'], ['a/b/c/*.md']).should.eql([]);
      mm(['a/b/c/d.md'], ['a/b/c/*.md']).should.eql(['a/b/c/d.md']);
      mm(['a/b/c/e.md'], ['a/b/c/*.md']).should.eql(['a/b/c/e.md']);
    });

    it('should expand braces:', function () {
      mm(['iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/d/iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/c/iii.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/cd/iii.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/cd/iii.md']);
      mm(['a/b/ce/iii.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/ce/iii.md']);

      mm(['xyz.md'], ['a/b/c{d,e}/xyz.md']).should.eql([]);
      mm(['a/b/d/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql([]);
      mm(['a/b/cd/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/cd/xyz.md']);
      mm(['a/b/ce/xyz.md'], ['a/b/c{d,e}/*.md']).should.eql(['a/b/ce/xyz.md']);
      mm(['a/b/cef/xyz.md'], ['a/b/c{d,e{f,g}}/*.md']).should.eql(['a/b/cef/xyz.md']);
      mm(['a/b/ceg/xyz.md'], ['a/b/c{d,e{f,g}}/*.md']).should.eql(['a/b/ceg/xyz.md']);
      mm(['a/b/cd/xyz.md'], ['a/b/c{d,e{f,g}}/*.md']).should.eql(['a/b/cd/xyz.md']);
    });

    it('should create a regular expression for double stars:', function () {
      mm(['.gitignore'], ['a/**/z/*.md']).should.eql([]);

      mm(['a/b/z/.dotfile.md'], ['a/**/z/.*.md']).should.eql(['a/b/z/.dotfile.md']);
      mm(['a/b/z/.dotfile'], ['a/**/z/*.md']).should.eql([]);
      mm(['a/b/c/d/e/z/d.md'], ['a/**/z/*.md']).should.eql(['a/b/c/d/e/z/d.md']);

      mm(['a/b/c/d/e/z/d.md'], ['a/**/j/**/z/*.md']).should.eql([]);
      mm(['a/b/c/j/e/z/d.md'], ['a/**/j/**/z/*.md']).should.eql(['a/b/c/j/e/z/d.md']);
      mm(['a/b/c/d/e/j/n/p/o/z/d.md'], ['a/**/j/**/z/*.md']).should.eql(['a/b/c/d/e/j/n/p/o/z/d.md']);
      mm(['a/b/c/j/e/z/d.txt'], ['a/**/j/**/z/*.md']).should.eql([]);

      mm(['a/b/d/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql([]);
      mm(['a/b/c/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql([]);
      mm(['a/b/d/cd/e/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql(['a/b/d/cd/e/xyz.md']);
      mm(['a/b/baz/ce/fez/xyz.md'], ['a/b/**/c{d,e}/**/xyz.md']).should.eql(['a/b/baz/ce/fez/xyz.md']);
    });
  });


  describe('options', function () {
    it('should support the `matchBase` option:', function () {
      mm(['a/b/c.md'], ['*.md']).should.eql([]);
      mm(['a/b/c.md'], ['*.md'], {matchBase: true}).should.eql(['a/b/c.md']);
      mm(['a/b.md', 'a/b.txt'], ['*.txt'], {matchBase: true}).should.eql(['a/b.txt']);
    });

    it('should support the `nocase` option:', function () {
      mm(['a/b/d/e.md'], ['a/b/c/*.md']).should.eql([]);
      mm(['a/b/c/e.md'], ['A/b/C/*.md']).should.eql([]);
      mm(['a/b/c/e.md'], ['A/b/C/*.md'], {nocase: true}).should.eql(['a/b/c/e.md']);
      mm(['a/b/c/e.md'], ['A/b/C/*.MD'], {nocase: true}).should.eql(['a/b/c/e.md']);
      mm(['a/b/c.d/e.md'], ['A/b/C.d/*.MD'], {nocase: true}).should.eql(['a/b/c.d/e.md']);
    });

    it('should match dotfiles when `dotfile` is true:', function () {
      var opts = { dot: true };

      mm(['.gitignore'], ['.gitignore'], opts).should.eql(['.gitignore']);
      mm(['d.md'], ['*.md'], opts).should.eql(['d.md']);
      mm(['.verb.txt'], ['*.md'], opts).should.eql([]);
      mm(['a/b/c/.gitignore'], ['*.md'], opts).should.eql([]);
      mm(['a/b/c/.gitignore.md'], ['*.md'], opts).should.eql([]);
      mm(['a/b/c/.gitignore.md'], ['**/*.md'], opts).should.eql(['a/b/c/.gitignore.md']);
      mm(['.verb.txt'], ['*.md'], opts).should.eql([]);
      mm(['.gitignore'], ['*.md'], opts).should.eql([]);
      mm(['.gitignore'], ['*.*'], opts).should.eql(['.gitignore']);
      mm(['.gitignore.md'], ['.*.md'], opts).should.eql(['.gitignore.md']);
      mm(['.gitignore.md'], ['*.md'], opts).should.eql(['.gitignore.md']);
      mm(['a/b/c/.verb.md'], ['**/*.md'], opts).should.eql(['a/b/c/.verb.md']);

      mm(['a/b/c/.gitignore.md'], ['*.md']).should.eql([]);
      mm(['a/b/c/.gitignore.md'], ['**/.*.md']).should.eql(['a/b/c/.gitignore.md']);
      mm(['a/b/c/.gitignore.md'], ['**/.*']).should.eql(['a/b/c/.gitignore.md']);
    });
  });
});

