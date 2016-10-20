'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('stars', function() {
  it('should match one directory level with a single star (*)', function() {
    var fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    mm(fixtures, '*', ['a', 'b']);
    mm(fixtures, '*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
    mm(fixtures, '*/*/*', ['a/a/a', 'a/a/b']);
    mm(fixtures, '*/*/*/*', ['a/a/a/a']);
    mm(fixtures, '*/*/*/*/*', ['a/a/a/a/a']);
    mm(fixtures, 'a/*', ['a/a', 'a/b', 'a/c', 'a/x']);
    mm(fixtures, 'a/*/*', ['a/a/a', 'a/a/b']);
    mm(fixtures, 'a/*/*/*', ['a/a/a/a']);
    mm(fixtures, 'a/*/*/*/*', ['a/a/a/a/a']);
    mm(fixtures, 'a/*/a', ['a/a/a']);
    mm(fixtures, 'a/*/b', ['a/a/b']);
  });

  it('should match one or more characters', function() {
    var fixtures = ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    mm(fixtures, '*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac']);
    mm(fixtures, 'a*', ['a', 'aa', 'aaa', 'aaaa', 'ab']);
    mm(fixtures, '*b', ['ab', 'b', 'bb']);
  });

  it('should match one or zero characters', function() {
    var fixtures = ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    mm(fixtures, '*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac']);
    mm(fixtures, '*a*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'cac']);
    mm(fixtures, '*b*', ['ab', 'b', 'bb']);
    mm(fixtures, '*c*', ['c', 'cc', 'cac']);
  });

  it('should respect trailing slashes on paterns', function() {
    var fixtures = ['a', 'a/', 'b', 'b/', 'a/a', 'a/a/', 'a/b', 'a/b/', 'a/c', 'a/c/', 'a/x', 'a/x/', 'a/a/a', 'a/a/b', 'a/a/b/', 'a/a/a/', 'a/a/a/a', 'a/a/a/a/', 'a/a/a/a/a', 'a/a/a/a/a/', 'x/y', 'z/z', 'x/y/', 'z/z/', 'a/b/c/.d/e/'];
    mm(fixtures, '*/', ['a/', 'b/']);
    mm(fixtures, '*/*/', ['a/a/', 'a/b/', 'a/c/', 'a/x/', 'x/y/', 'z/z/']);
    mm(fixtures, '*/*/*/', ['a/a/a/', 'a/a/b/']);
    mm(fixtures, '*/*/*/*/', ['a/a/a/a/']);
    mm(fixtures, '*/*/*/*/*/', ['a/a/a/a/a/']);
    mm(fixtures, 'a/*/', ['a/a/', 'a/b/', 'a/c/', 'a/x/']);
    mm(fixtures, 'a/*/*/', ['a/a/a/', 'a/a/b/']);
    mm(fixtures, 'a/*/*/*/', ['a/a/a/a/']);
    mm(fixtures, 'a/*/*/*/*/', ['a/a/a/a/a/']);
    mm(fixtures, 'a/*/a/', ['a/a/a/']);
    mm(fixtures, 'a/*/b/', ['a/a/b/']);
  });

  it('should match a literal star when escaped', function() {
    var fixtures = ['.md', 'a**a.md', '**a.md', '**/a.md', '**.md', '.md', '*', '**', '*.md'];
    mm(fixtures, '\\*', ['*']);
    mm(fixtures, '\\*.md', ['*.md']);
    mm(fixtures, '\\**.md', ['**a.md', '**.md', '*.md']);
    mm(fixtures, 'a\\**.md', ['a**a.md']);
  });

  it('should match leading `./`', function() {
    var fixtures = ['a', './a', 'b', 'a/a', './a/b', 'a/c', './a/x', './a/a/a', 'a/a/b', './a/a/a/a', './a/a/a/a/a', 'x/y', './z/z'];
    mm(fixtures, '*', ['a', 'b']);
    mm(fixtures, '**/a/**', ['a/a', 'a/c', 'a/b', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
    mm(fixtures, '*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
    mm(fixtures, '*/*/*', ['a/a/a', 'a/a/b']);
    mm(fixtures, '*/*/*/*', ['a/a/a/a']);
    mm(fixtures, '*/*/*/*/*', ['a/a/a/a/a']);
    mm(fixtures, './*', ['a', 'b']);
    mm(fixtures, './**/a/**', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
    mm(fixtures, './a/*/a', ['a/a/a']);
    mm(fixtures, 'a/*', ['a/a', 'a/b', 'a/c', 'a/x']);
    mm(fixtures, 'a/*/*', ['a/a/a', 'a/a/b']);
    mm(fixtures, 'a/*/*/*', ['a/a/a/a']);
    mm(fixtures, 'a/*/*/*/*', ['a/a/a/a/a']);
    mm(fixtures, 'a/*/a', ['a/a/a']);
  });
});
