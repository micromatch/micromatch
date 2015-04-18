/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref;
}

describe('dotfiles', function () {
  describe('file name', function () {
    it('should not match a dot when the dot is not explicitly defined', function () {
      mm.isMatch('.bashrc', '*bashrc').should.be.false;
      mm.isMatch('.bashrc', '[.]bashrc').should.be.false;
      mm.isMatch('.bashrc', '?bashrc').should.be.false;
    });

    it('should match a dot when the dot is explicitly defined', function () {
      mm.isMatch('.bashrc', '.[b]ashrc').should.be.true;
      mm.isMatch('.bashrc', '.ba?hrc').should.be.true;
      mm.isMatch('.bashrc', '.bashr*').should.be.true;
    });
  });

  describe('multiple directories', function () {
    it('should not match a dot when the dot is not explicitly defined', function () {
      mm.isMatch('/.bashrc', '/*bashrc').should.be.false;
      mm.isMatch('/.bashrc', '/?bashrc').should.be.false;
      mm.isMatch('/.bashrc', '/[.]bashrc').should.be.false;
      mm.isMatch('/.bashrc', '*/*bashrc').should.be.false;
      mm.isMatch('/.bashrc', '*/?bashrc').should.be.false;
      mm.isMatch('/.bashrc', '*/[.]bashrc').should.be.false;
      mm.isMatch('/.bashrc', '**/*bashrc').should.be.false;
      mm.isMatch('/.bashrc', '**/?bashrc').should.be.false;
      mm.isMatch('/.bashrc', '**/[.]bashrc').should.be.false;
      mm.isMatch('a/.bashrc', '*/*bashrc').should.be.false;
      mm.isMatch('a/.bashrc', '*/?bashrc').should.be.false;
      mm.isMatch('a/.bashrc', '*/[.]bashrc').should.be.false;
      mm.isMatch('a/b/.bashrc', '**/*bashrc').should.be.false;
      mm.isMatch('a/b/.bashrc', '**/?bashrc').should.be.false;
      mm.isMatch('a/b/.bashrc', '**/[.]bashrc').should.be.false;
    });

    it('should match a dot when the dot is explicitly defined', function () {
      mm.isMatch('/.bashrc', '**/.[b]ashrc').should.be.true;
      mm.isMatch('/.bashrc', '**/.ba?hrc').should.be.true;
      mm.isMatch('/.bashrc', '**/.bashr*').should.be.true;
      mm.isMatch('a/.bashrc', '*/.[b]ashrc').should.be.true;
      mm.isMatch('a/.bashrc', '*/.ba?hrc').should.be.true;
      mm.isMatch('a/.bashrc', '*/.bashr*').should.be.true;
      mm.isMatch('a/b/.bashrc', '**/.[b]ashrc').should.be.true;
      mm.isMatch('a/b/.bashrc', '**/.ba?hrc').should.be.true;
      mm.isMatch('a/b/.bashrc', '**/.bashr*').should.be.true;
    });
  });
});
