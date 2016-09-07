'use strict';

var assert = require('assert');
var mm = require('..');

describe('dotfiles', function() {
  describe('file name', function() {
    it('should not match a dot when the dot is not explicitly defined', function() {
      assert(!mm.isMatch('.bashrc', '*bashrc'));
      assert(!mm.isMatch('.bashrc', '?bashrc'));
    });

    it('should match a dot when the dot is explicitly defined', function() {
      assert(mm.isMatch('.bashrc', '[.]bashrc'));
      assert(mm.isMatch('.bashrc', '.[b]ashrc'));
      assert(mm.isMatch('.bashrc', '.bashr*'));
      assert(!mm.isMatch('.bashrc', '.ba?hrc'));
    });
  });

  describe('multiple directories', function() {
    it('should not match a dot when the dot is not explicitly defined', function() {
      assert(!mm.isMatch('/.bashrc', '**/*bashrc'));
      assert(!mm.isMatch('/.bashrc', '**/?bashrc'));
      assert(!mm.isMatch('/.bashrc', '*/*bashrc'));
      assert(!mm.isMatch('/.bashrc', '*/?bashrc'));
      assert(!mm.isMatch('/.bashrc', '/*bashrc'));
      assert(!mm.isMatch('/.bashrc', '/?bashrc'));
      assert(!mm.isMatch('a/.bashrc', '*/*bashrc'));
      assert(!mm.isMatch('a/.bashrc', '*/?bashrc'));
      assert(!mm.isMatch('a/b/.bashrc', '**/*bashrc'));
      assert(!mm.isMatch('a/b/.bashrc', '**/?bashrc'));
      assert(mm.isMatch('/.bashrc', '**/[.]bashrc'));
      assert(mm.isMatch('/.bashrc', '*/[.]bashrc'));
      assert(mm.isMatch('/.bashrc', '/[.]bashrc'));
      assert(mm.isMatch('a/.bashrc', '*/[.]bashrc'));
      assert(mm.isMatch('a/b/.bashrc', '**/[.]bashrc'));
    });

    it('should match a dot when the dot is explicitly defined', function() {
      assert(mm.isMatch('/.bashrc', '**/.[b]ashrc'));
      assert(mm.isMatch('/.bashrc', '**/.bashr*'));
      assert(mm.isMatch('a/.bashrc', '*/.[b]ashrc'));
      assert(mm.isMatch('a/.bashrc', '*/.bashr*'));
      assert(mm.isMatch('a/b/.bashrc', '**/.[b]ashrc'));
      assert(mm.isMatch('a/b/.bashrc', '**/.bashr*'));
    });
  });

  describe('options.dot', function() {
    it('should match dotfiles when `options.dot` is true', function() {
      assert(mm.isMatch('.bashrc', '*bashrc', {dot: true}));
      assert(mm.isMatch('.bashrc', '[.]bashrc', {dot: true}));
      assert(mm.isMatch('.bashrc', '?bashrc', {dot: true}));

      assert(mm.isMatch('a/b/.bashrc', '*bashrc', {dot: true, matchBase: true}));
      assert(mm.isMatch('a/b/.bashrc', '[.]bashrc', {dot: true, matchBase: true}));
      assert(mm.isMatch('a/b/.bashrc', '?bashrc', {dot: true, matchBase: true}));

      assert(mm.isMatch('a/b/.bashrc', '**/*bashrc', {dot: true}));
      assert(mm.isMatch('a/b/.bashrc', '**/.[b]ashrc', {dot: true}));
      assert(mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dot: true}));
      assert(mm.isMatch('a/b/.bashrc', '**/?bashrc', {dot: true}));
    });

    it('should not match dotfiles when `options.dot` is false', function() {
      assert(mm.isMatch('a/b/.bashrc', '[.]bashrc', {dot: false, matchBase: true}));
      assert(mm.isMatch('a/b/.bashrc', '**/[.]bashrc', {dot: false}));

      assert(!mm.isMatch('a/b/.bashrc', '*bashrc', {dot: false, matchBase: true}));
      assert(!mm.isMatch('a/b/.bashrc', '?bashrc', {dot: false, matchBase: true}));

      assert(!mm.isMatch('a/b/.bashrc', '**/*bashrc', {dot: false}));
      assert(!mm.isMatch('a/b/.bashrc', '**/?bashrc', {dot: false}));
    });
  });

  describe('options.dot', function() {
    it('should match a dot `options.dot` is true', function() {
      assert(mm.isMatch('.bashrc', '*bashrc', {dot: true}));
      assert(mm.isMatch('.bashrc', '[.]bashrc', {dot: true}));
      assert(mm.isMatch('.bashrc', '?bashrc', {dot: true}));
    });
  });
});
