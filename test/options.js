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

describe('options.nocase', function () {
  it('should support the `nocase` option:', function () {
    mm.match(['a/b/d/e.md'], 'a/b/D/*.md').should.eql([], 'should not match a dirname');
    mm.match(['a/b/d/e.md'], 'a/b/D/*.md', {nocase: true}).should.eql(['a/b/d/e.md']);
    mm.match(['a/b/c/e.md'], 'A/b/*/E.md').should.eql([], 'should not match a basename');
    mm.match(['a/b/c/e.md'], 'A/b/*/E.md', {nocase: true}).should.eql(['a/b/c/e.md']);
    mm.match(['a/b/c/e.md'], 'A/b/C/*.MD').should.eql([], 'should not match a file extension');
    mm.match(['a/b/c/e.md'], 'A/b/C/*.MD', {nocase: true}).should.eql(['a/b/c/e.md']);
  });
});

describe('options.ignore', function () {
  it('should support the `ignore` option:', function () {
    mm.match(['a/b', 'a/c', 'a/d', 'a/e'], '**').should.eql(['a/b', 'a/c', 'a/d', 'a/e']);
    mm.match(['a/b', 'a/c', 'a/d', 'a/e'], '**', {ignore: ['*/d', '*/e']}).should.eql(['a/b', 'a/c']);
  });
});

describe('options.matchBase', function () {
  it('should support the `matchBase` option:', function () {
    mm.match(['a/b/c/foo.md'], '*.md').should.eql([]);
    mm.match(['a/b/c/foo.md'], '*.md', {matchBase: true}).should.eql(['a/b/c/foo.md']);
  });
});

describe('options.dotfiles:', function () {
  describe('when `dot` or `dotfile` is NOT true:', function () {
    it('should not match dotfiles by default:', function () {
      mm.match(['.dotfile'], '*').should.eql([]);
      mm.match(['.dotfile'], '**').should.eql([]);
      mm.match(['a/b/c/.dotfile.md'], '*.md').should.eql([]);
      mm.match(['a/b', 'a/.b', '.a/b', '.a/.b'], '**').should.eql(['a/b']);
      mm.match(['a/b/c/.dotfile'], '*.*').should.eql([]);
    });

    it('should match dotfiles when a leading dot is defined in the path:', function () {
      mm.match(['a/b/c/.dotfile.md'], '**/.*').should.eql(['a/b/c/.dotfile.md']);
      mm.match(['a/b/c/.dotfile.md'], '**/.*.md').should.eql(['a/b/c/.dotfile.md']);
    });

    it('should use negation patterns on dotfiles:', function () {
      mm.match(['.a', '.b', 'c', 'c.md'], '!.*').should.eql(['c', 'c.md']);
      mm.match(['.a', '.b', 'c', 'c.md'], '!.b').should.eql(['.a', 'c', 'c.md']);
    });
  });

  describe('when `dot` or `dotfile` is true:', function () {
    it('should match dotfiles when there is a leading dot:', function () {
      var opts = { dot: true };

      mm.match(['.dotfile'], '*', opts).should.eql(['.dotfile']);
      mm.match(['.dotfile'], '**', opts).should.eql(['.dotfile']);
      mm.match(['a/b', 'a/.b', '.a/b', '.a/.b'], '**', opts).should.eql(['a/b', 'a/.b', '.a/b', '.a/.b']);
      mm.match(['a/b', 'a/.b', 'a/.b', '.a/.b'], '{.*,**}', opts).should.eql(['a/b', 'a/.b', 'a/.b', '.a/.b']);
      mm.match(['.dotfile'], '.dotfile', opts).should.eql(['.dotfile']);
      mm.match(['.dotfile.md'], '.*.md', opts).should.eql(['.dotfile.md']);
    });

    it('should match dotfiles when there is not a leading dot:', function () {
      var opts = { dot: true };
      mm.match(['.dotfile'], '*.*', opts).should.eql(['.dotfile']);
      mm.match(['.a', '.b', 'c', 'c.md'], '*.*', opts).should.eql(['.a', '.b', 'c.md']);
      mm.match(['.dotfile'], '*.md', opts).should.eql([]);
      mm.match(['.verb.txt'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.dotfile'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.dotfile.md'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.verb.md'], '**/*.md', opts).should.eql(['a/b/c/.verb.md']);
      mm.match(['foo.md'], '*.md', opts).should.eql(['foo.md']);
    });

    it('should match dotfiles when there is not a leading dot:', function () {
      var opts = { dotfiles: true };
      mm.match(['.dotfile'], '*.*', opts).should.eql(['.dotfile']);
      mm.match(['.a', '.b', 'c', 'c.md'], '*.*', opts).should.eql(['.a', '.b', 'c.md']);
      mm.match(['.dotfile'], '*.md', opts).should.eql([]);
      mm.match(['.verb.txt'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.dotfile'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.dotfile.md'], '*.md', opts).should.eql([]);
      mm.match(['a/b/c/.verb.md'], '**/*.md', opts).should.eql(['a/b/c/.verb.md']);
      mm.match(['foo.md'], '*.md', opts).should.eql(['foo.md']);
    });

    it('should use negation patterns on dotfiles:', function () {
      mm.match(['.a', '.b', 'c', 'c.md'], '!*.*').should.eql(['.a', '.b', 'c']);
      mm.match(['.a', '.b', 'c', 'c.md'], '!.*').should.eql(['c', 'c.md']);
    });
  });
});