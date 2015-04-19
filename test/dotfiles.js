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

  describe('options.dot', function () {
    it('should match dotfiles when `options.dot` is true', function () {
      mm.isMatch('.bashrc', '*bashrc', {dot: true}).should.be.true;
      mm.isMatch('.bashrc', '[.]bashrc', {dot: true}).should.be.true;
      mm.isMatch('.bashrc', '?bashrc', {dot: true}).should.be.true;

      mm.isMatch('a/b/.bashrc', '*bashrc', {dot: true, matchBase: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '[.]bashrc', {dot: true, matchBase: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '?bashrc', {dot: true, matchBase: true}).should.be.true;

      mm.isMatch('a/b/.bashrc', '**/*bashrc', {dot: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/.[b]ashrc', {dot: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dot: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/?bashrc', {dot: true}).should.be.true;
    });

    it('should not match dotfiles when `options.dot` is false', function () {
      mm.isMatch('a/b/.bashrc', '*bashrc', {dot: false, matchBase: true}).should.be.false;
      mm.isMatch('a/b/.bashrc', '[.]bashrc', {dot: false, matchBase: true}).should.be.false;
      mm.isMatch('a/b/.bashrc', '?bashrc', {dot: false, matchBase: true}).should.be.false;

      mm.isMatch('a/b/.bashrc', '**/*bashrc', {dot: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dot: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '**/?bashrc', {dot: false}).should.be.false;
    });
  });

  describe('options.dotfiles', function () {
    it('should match a dotfile when `options.dotfiles` is true', function () {
      mm.isMatch('.bashrc', '*bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('.bashrc', '[.]bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('.bashrc', '?bashrc', {dotfiles: true}).should.be.true;

      mm.isMatch('a/b/.bashrc', '*bashrc', {dotfiles: true, matchBase: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '[.]bashrc', {dotfiles: true, matchBase: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '?bashrc', {dotfiles: true, matchBase: true}).should.be.true;

      mm.isMatch('a/b/.bashrc', '**/*bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/.[b]ashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('a/b/.bashrc', '**/?bashrc', {dotfiles: true}).should.be.true;
    });

    it('should not match a dotfile when `options.dotfiles` is false', function () {
      mm.isMatch('.bashrc', '*bashrc', {dotfiles: false}).should.be.false;
      mm.isMatch('.bashrc', '[.]bashrc', {dotfiles: false}).should.be.false;
      mm.isMatch('.bashrc', '?bashrc', {dotfiles: false}).should.be.false;

      mm.isMatch('a/b/.bashrc', '*bashrc', {dotfiles: false, matchBase: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '[.]bashrc', {dotfiles: false, matchBase: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '?bashrc', {dotfiles: false, matchBase: false}).should.be.false;

      mm.isMatch('a/b/.bashrc', '**/*bashrc', {dotfiles: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dotfiles: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '**/?bashrc', {dotfiles: false}).should.be.false;
    });

    it('should not match a dotfile when `options.dotdirs` is true', function () {
      // mm.isMatch('.bashrc', '*bashrc', {dotdirs: true}).should.be.false;
      // mm.isMatch('.bashrc', '[.]bashrc', {dotdirs: true}).should.be.false;
      // mm.isMatch('.bashrc', '?bashrc', {dotdirs: true}).should.be.false;

      mm.isMatch('a/b/.bashrc', '*bashrc', {dotdirs: true, matchBase: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '[.]bashrc', {dotdirs: true, matchBase: false}).should.be.false;
      mm.isMatch('a/b/.bashrc', '?bashrc', {dotdirs: true, matchBase: false}).should.be.false;

      // mm.isMatch('a/b/.bashrc', '**/*bashrc', {dotdirs: true}).should.be.false;
      // mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dotdirs: true}).should.be.false;
      // mm.isMatch('a/b/.bashrc', '**/?bashrc', {dotdirs: true}).should.be.false;
    });
  });

  describe('options.dot / options.dotfiles', function () {
    it('should match a dot `options.dot` is true', function () {
      mm.isMatch('.bashrc', '*bashrc', {dot: true}).should.be.true;
      mm.isMatch('.bashrc', '[.]bashrc', {dot: true}).should.be.true;
      mm.isMatch('.bashrc', '?bashrc', {dot: true}).should.be.true;

      mm.isMatch('.bashrc', '*bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('.bashrc', '[.]bashrc', {dotfiles: true}).should.be.true;
      mm.isMatch('.bashrc', '?bashrc', {dotfiles: true}).should.be.true;
    });
  });
});
