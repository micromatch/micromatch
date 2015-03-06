/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var argv = require('minimist')(process.argv.slice(2));
var minimatch = require('./support/reference');
var mm = require('..');
require('should');

if ('minimatch' in argv) {
  mm = minimatch;
}

describe('.match()', function () {
  describe('errors:', function () {
    it('should throw on undefined args:', function () {
      (function () {
        mm.match();
      }).should.throw('micromatch.match(): files should be a string or array.');
    });

    it('should throw on bad args:', function () {
      (function () {
        mm.match({});
      }).should.throw('micromatch.match(): files should be a string or array.');
    });
  });

  describe('basic patterns:', function () {
    it('should correctly deal with empty globs', function () {
      mm.match(['ab'], '').should.eql([]);
      mm.match(['a'], '').should.eql([]);
      mm.match(['.'], '').should.eql([]);
    });

    it('should support matching with non-glob patterns', function () {
      mm.match(['.'], '.').should.eql(['.']);
      mm.match(['ab'], 'ab').should.eql(['ab']);
      mm.match(['ab', 'a'], 'a').should.eql(['a']);
      mm.match(['ab', 'a'], '/a').should.eql([]);
      mm.match(['ab', 'a'], 'aa').should.eql([]);
      mm.match(['/ab', '/a'], '/a').should.eql(['/a']);
    });

    it('should support matching with glob patterns', function () {
      mm.match(['.'], '{.,*}').should.eql(['.']);
      mm.match(['ab'], '*').should.eql(['ab']);
      mm.match(['ab', 'a'], '?').should.eql(['a']);
      mm.match(['ab', 'a'], '*b').should.eql(['ab']);
      mm.match(['ab', 'a', 'bb'], '[ab][ab]').should.eql(['ab', 'bb']);
      mm.match(['/ab', '/a'], '/*').should.eql(['/ab', '/a']);
    });

    it('should support matching with regex', function () {
      mm.match(['.'], /\./).should.eql(['.']);
      mm.match(['ab'], /ab/).should.eql(['ab']);
      mm.match(['ab', 'a'], /a$/).should.eql(['a']);
      mm.match(['ab', 'a'], /\/a/).should.eql([]);
      mm.match(['ab', 'a'], /aa/).should.eql([]);
      mm.match(['/ab', '/a'], /\/a$/).should.eql(['/a']);
    });

    it('should support matching with a function:', function () {
      var matches = mm.match(['a', 'aa', 'aaa', 'aaaa'], function (fp) {
        return fp.length >= 3;
      })
      matches.should.eql(['aaa', 'aaaa']);
    });
  });

  describe('characters:', function () {
    it('should match question marks', function () {
      mm.match(['ab', 'a/b', 'bb', 'b/c'], '?a').should.eql([]);
      mm.match(['ab', 'a/b', 'bb', 'b/c'], '?/?').should.eql(['a/b', 'b/c']);
      mm.match(['ab', 'a/b', 'bb', 'b/c'], 'a?b').should.eql([]);
      mm.match(['ab', 'a/b', 'bb', 'b/c'], '?b').should.eql(['ab', 'bb']);
    });

    it('should match one character per question mark', function () {
      var files = ['ab', 'a/bc', 'bb', 'bbc', 'b/c', 'a/b/c.js', 'a/b/c.md', 'a/bb/c.js', 'a/bb/c.md', 'a/bbb/c.js', 'a/bbb/c.md', 'a/bbbb/c.js', 'a/bbbb/c.md', 'a/b/c/d/eeeeeee/f.js', 'a/b/c/d/eeeeeee/f.md', 'a/b/c/d/e.js', 'a/b/c/d/e.md', 'a/b/c/ddd/e.js', 'a/b/c/ddd/e.md'];
      mm.match(files, '?').should.eql([]);
      mm.match(files, '??').should.eql(['ab', 'bb']);
      mm.match(files, '???').should.eql(['bbc']);
      mm.match(files, 'a/?/c.js').should.eql(['a/b/c.js']);
      mm.match(files, 'a/?/c.md').should.eql(['a/b/c.md']);
      mm.match(files, 'a/?/c/?/*/f.js').should.eql(['a/b/c/d/eeeeeee/f.js']);
      mm.match(files, 'a/?/c/?/*/f.md').should.eql(['a/b/c/d/eeeeeee/f.md']);
      mm.match(files, 'a/?/c/?/e.js').should.eql(['a/b/c/d/e.js']);
      mm.match(files, 'a/?/c/?/e.md').should.eql(['a/b/c/d/e.md']);
      mm.match(files, 'a/?/c/???/e.js').should.eql(['a/b/c/ddd/e.js']);
      mm.match(files, 'a/?/c/???/e.md').should.eql(['a/b/c/ddd/e.md']);
      mm.match(files, 'a/??/c.js').should.eql(['a/bb/c.js']);
      mm.match(files, 'a/??/c.md').should.eql(['a/bb/c.md']);
      mm.match(files, 'a/???/c.js').should.eql(['a/bbb/c.js']);
      mm.match(files, 'a/???/c.md').should.eql(['a/bbb/c.md']);
      mm.match(files, 'a/????/c.js').should.eql(['a/bbbb/c.js']);
      mm.match(files, 'a/????/c.md').should.eql(['a/bbbb/c.md']);
    });
  });

  describe('paths/extensions', function () {
    it('should match with common glob patterns', function () {
      mm.match(['/ab', '/cd', 'ef'], '/*').should.eql(['/ab', '/cd']);
      mm.match(['a/b/c/d', 'a/c/d', 'a/f/jjj/acd'], '**/d').should.eql(['a/b/c/d', 'a/c/d']);
      mm.match(['ab'], './*').should.eql([]);
      mm.match(['./ab'], './*').should.eql(['./ab']);
      mm.match(['ab'], '*').should.eql(['ab']);
      mm.match(['ab'], 'ab').should.eql(['ab']);
    });

    it('should match one directory level:', function () {
      var dirs = ['a/b/c/e', 'a/b/c/d/e'];
      mm.match(dirs, 'a/b/c/*').should.eql(['a/b/c/e']);
      mm.match(dirs, 'a/b/*/e').should.eql(['a/b/c/e']);
      mm.match(dirs, 'a/*/*/e').should.eql(['a/b/c/e']);
      mm.match(dirs, '*/*/*/e').should.eql(['a/b/c/e']);
      mm.match(dirs, '*/*/*/*').should.eql(['a/b/c/e']);
      mm.match(dirs, 'b/*/*/*').should.eql([]);
      mm.match(['a/b/c/e', 'b/b/c/e', 'a/b/c/d/e'], '*/b/*/e').should.eql(['a/b/c/e', 'b/b/c/e']);
    });

    it('should match multiple directory levels:', function () {
      var dirs = ['a/b/c/e', 'a/b/c/d/e'];
      mm.match(dirs, 'a/***').should.eql(['a/b/c/e', 'a/b/c/d/e']);
      mm.match(dirs, 'a/**c*').should.eql([]);
      mm.match(dirs, 'a/**c/*').should.eql(['a/b/c/e']);
      mm.match(dirs, 'a/**/c/*').should.eql(['a/b/c/e']);
      mm.match(dirs, 'a/**/e').should.eql(dirs);
      mm.match(dirs, 'a/b/**/e').should.eql(dirs);
    });
  });

  describe('paths/filenames:', function () {
    it('should match files with the given extension:', function () {
      mm.match(['.md', '.txt'], '*.md').should.eql([]);
      mm.match(['.md', '.txt'], '.md').should.eql(['.md']);
      mm.match(['x.md'], '*.md').should.eql(['x.md']);
      mm.match(['x.js.min'], '*.js').should.eql([]);
      mm.match(['a/b/c/x.md'], '*.md').should.eql([]);
    });

    it('should not match dotfiles when `dot` or `dotfiles` are not set:', function () {
      mm.match(['.a'], '*.md').should.eql([]);
      mm.match(['.a'], 'a/b/c/*.md').should.eql([]);
      mm.match(['.a.md'], 'a/b/c/*.md').should.eql([]);
      mm.match(['.x.md'], '*.md').should.eql([]);
      mm.match(['.y.txt'], '*.md').should.eql([]);
      mm.match(['a/.x.md'], '*.md').should.eql([]);
      mm.match(['a/.x.md'], 'a/.x.md').should.eql(['a/.x.md']);
      mm.match(['a/b/c/.xyz.md'], 'a/b/c/.*.md').should.eql(['a/b/c/.xyz.md']);
      mm.match(['a/b/c/d.a.md'], 'a/b/c/*.md').should.eql(['a/b/c/d.a.md']);
      mm.match(['a/b/d/.a'], 'a/b/c/*.md').should.eql([]);
    });

    it('should match dotfiles when the filename pattern begins with a dot:', function () {
      mm.match(['.b'], '.b*').should.eql(['.b']);
      mm.match(['.md', '.txt'], '.md').should.eql(['.md']);
      mm.match(['.a', 'a'], '.a').should.eql(['.a']);
      mm.match(['.ab', '.a', '.b', 'a', 'b'], '.*').should.eql(['.ab', '.a', '.b']);
      mm.match(['.ab', '.a', '.b'], '.a*').should.eql(['.ab', '.a']);
    });

    it('should match dotfiles when `dot` or `dotfiles` is set:', function () {
      mm.match(['.ab', '.a', '.b'], '*.*', {dot: true}).should.eql(['.ab', '.a', '.b']);
      mm.match(['.x.md'], '*.md', {dot: true}).should.eql(['.x.md']);
      mm.match(['.x.md'], '.*', {dot: true}).should.eql(['.x.md']);
      mm.match(['a/b/c/.xyz.md'], 'a/b/c/*.md', {dot: true}).should.eql(['a/b/c/.xyz.md']);
      mm.match(['c/.dotfile', 'c/a', 'c/b'], '**/.*', {dot: true}).should.eql(['c/.dotfile']);
    });
  });

  describe('paths/filepaths:', function () {
    it('should match file paths:', function () {
      mm.match(['a/b/c/xyz.md'], '**/*.md').should.eql(['a/b/c/xyz.md']);
      mm.match(['c/.dotfile', 'c/a', 'c/b'], '**/.*').should.eql(['c/.dotfile']);
      mm.match(['a/b/c/xyz.min.md'], '**/*.md').should.eql(['a/b/c/xyz.min.md']);
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
      mm.match(['a/b/c/d/e/z/x.md'], 'a/**/z/*.md').should.eql(['a/b/c/d/e/z/x.md']);

      mm.match(['a/b/c/d/e/z/x.md'], 'a/**/j/**/z/*.md').should.eql([]);
      mm.match(['a/b/c/j/e/z/x.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/j/e/z/x.md']);
      mm.match(['a/b/c/d/e/j/n/p/o/z/x.md'], 'a/**/j/**/z/*.md').should.eql(['a/b/c/d/e/j/n/p/o/z/x.md']);
      mm.match(['a/b/c/j/e/z/x.txt'], 'a/**/j/**/z/*.md').should.eql([]);

      mm.match(['a/b/d/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['a/b/c/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql([]);
      mm.match(['a/b/x/cd/bar/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/x/cd/bar/xyz.md']);
      mm.match(['a/b/baz/ce/fez/xyz.md'], 'a/b/**/c{d,e}/**/xyz.md').should.eql(['a/b/baz/ce/fez/xyz.md']);
    });

    it('should match paths with leading `./`:', function () {
      mm.match(['./.a'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/z/.a'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/d/e/z/x.md'], 'a/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/d/e/z/x.md'], './a/**/z/*.md').should.eql(['./a/b/c/d/e/z/x.md']);

      mm.match(['./a/b/c/d/e/z/x.md'], './a/**/j/**/z/*.md').should.eql([]);
      mm.match(['./a/b/c/j/e/z/x.md'], './a/**/j/**/z/*.md').should.eql(['./a/b/c/j/e/z/x.md']);
      mm.match(['./a/b/c/d/e/j/n/p/o/z/x.md'], './a/**/j/**/z/*.md').should.eql(['./a/b/c/d/e/j/n/p/o/z/x.md']);
      mm.match(['./a/b/c/j/e/z/x.txt'], './a/**/j/**/z/*.md').should.eql([]);
    });
  });
});
