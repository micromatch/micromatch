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

console.log(mm.makeRe('**', {dot: true}))

describe('options', function () {
  describe('.match()', function () {
    it('should support the `matchBase` option:', function () {
      mm.match(['a/b/c/foo.md'], '*.md').should.eql([]);
      mm.match(['a/b/c/foo.md'], '*.md', {matchBase: true}).should.eql(['a/b/c/foo.md']);
    });

    it('should support the `nocase` option:', function () {
      mm.match(['a/b/d/e.md'], 'a/b/c/*.md').should.eql([]);
      mm.match(['a/b/c/e.md'], 'A/b/C/*.md').should.eql([]);
      mm.match(['a/b/c/e.md'], 'A/b/C/*.md', {nocase: true}).should.eql(['a/b/c/e.md']);
      mm.match(['a/b/c/e.md'], 'A/b/C/*.MD', {nocase: true}).should.eql(['a/b/c/e.md']);
    });

    it('should match dotfiles when `dotfile` is true:', function () {
      mm.match(['a/b', 'a/.b', '.a/b', '.a/.b'], '**').should.eql(['a/b']);
      mm.match(['a/b', 'a/.b', 'a/.b', '.a/.b'], '**', {dot: true}).should.eql(['a/b', 'a/.b', 'a/.b', '.a/.b']);
      mm.match(['.gitignore'], '*.*', {dot: true}).should.eql(['.gitignore']);
      mm.match(['.gitignore'], '*.md', {dot: true}).should.eql([]);
      mm.match(['.gitignore'], '.gitignore', {dot: true}).should.eql(['.gitignore']);
      mm.match(['.gitignore.md'], '*.md', {dot: true}).should.eql(['.gitignore.md']);
      mm.match(['.verb.txt'], '*.md', {dot: true}).should.eql([]);
      mm.match(['a/b/c/.gitignore'], '*.md', {dot: true}).should.eql([]);
      mm.match(['a/b/c/.gitignore.md'], '**/.*').should.eql(['a/b/c/.gitignore.md']);
      mm.match(['a/b/c/.gitignore.md'], '**/.*.md').should.eql(['a/b/c/.gitignore.md']);
      mm.match(['a/b/c/.gitignore.md'], '*.md').should.eql([]);
      mm.match(['a/b/c/.gitignore.md'], '*.md', {dot: true}).should.eql([]);
      mm.match(['a/b/c/.verb.md'], '**/*.md', {dot: true}).should.eql(['a/b/c/.verb.md']);
      mm.match(['foo.md'], '*.md', {dot: true}).should.eql(['foo.md']);
    });
  });
});
