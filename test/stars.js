'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var mm = require('..');
var matcher = argv.mm ? require('multimatch') : mm;

function match(arr, pattern, expected, options) {
  var actual = matcher(arr, pattern, options);
  assert.deepEqual(actual.sort(), expected.sort());
}

describe('stars', function() {
  it('should match one directory level with a single star (*)', function() {
    var fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    match(fixtures, '*', ['a', 'b']);
    match(fixtures, '*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
    match(fixtures, '*/*/*', ['a/a/a', 'a/a/b']);
    match(fixtures, '*/*/*/*', ['a/a/a/a']);
    match(fixtures, '*/*/*/*/*', ['a/a/a/a/a']);
    match(fixtures, 'a/*', ['a/a', 'a/b', 'a/c', 'a/x']);
    match(fixtures, 'a/*/*', ['a/a/a', 'a/a/b']);
    match(fixtures, 'a/*/*/*', ['a/a/a/a']);
    match(fixtures, 'a/*/*/*/*', ['a/a/a/a/a']);
    match(fixtures, 'a/*/a', ['a/a/a']);
    match(fixtures, 'a/*/b', ['a/a/b']);
  });

  it('should match one or more characters', function() {
    var fixtures = ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    match(fixtures, '*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac']);
    match(fixtures, 'a*', ['a', 'aa', 'aaa', 'aaaa', 'ab']);
    match(fixtures, '*b', ['ab', 'b', 'bb']);
  });

  it('should match one or zero characters', function() {
    var fixtures = ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
    match(fixtures, '*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'b', 'bb', 'c', 'cc', 'cac']);
    match(fixtures, '*a*', ['a', 'aa', 'aaa', 'aaaa', 'ab', 'cac']);
    match(fixtures, '*b*', ['ab', 'b', 'bb']);
    match(fixtures, '*c*', ['c', 'cc', 'cac']);
  });

  it('should respect trailing slashes on paterns', function() {
    var fixtures = ['a', 'a/', 'b', 'b/', 'a/a', 'a/a/', 'a/b', 'a/b/', 'a/c', 'a/c/', 'a/x', 'a/x/', 'a/a/a', 'a/a/b', 'a/a/b/', 'a/a/a/', 'a/a/a/a', 'a/a/a/a/', 'a/a/a/a/a', 'a/a/a/a/a/', 'x/y', 'z/z', 'x/y/', 'z/z/', 'a/b/c/.d/e/'];
    match(fixtures, '*/', ['a/', 'b/']);
    match(fixtures, '*/*/', ['a/a/', 'a/b/', 'a/c/', 'a/x/', 'x/y/', 'z/z/']);
    match(fixtures, '*/*/*/', ['a/a/a/', 'a/a/b/']);
    match(fixtures, '*/*/*/*/', ['a/a/a/a/']);
    match(fixtures, '*/*/*/*/*/', ['a/a/a/a/a/']);
    match(fixtures, 'a/*/', ['a/a/', 'a/b/', 'a/c/', 'a/x/']);
    match(fixtures, 'a/*/*/', ['a/a/a/', 'a/a/b/']);
    match(fixtures, 'a/*/*/*/', ['a/a/a/a/']);
    match(fixtures, 'a/*/*/*/*/', ['a/a/a/a/a/']);
    match(fixtures, 'a/*/a/', ['a/a/a/']);
    match(fixtures, 'a/*/b/', ['a/a/b/']);
  });

  it('should match a literal star when escaped', function() {
    var fixtures = ['.md', 'a**a.md', '**a.md', '**/a.md', '**.md', '.md', '*', '**', '*.md'];
    match(fixtures, '\\*', ['*']);
    match(fixtures, '\\*.md', ['*.md']);
    match(fixtures, '\\**.md', ['**a.md', '**.md', '*.md']);
    match(fixtures, 'a\\**.md', ['a**a.md']);
  });

  it('should match leading `./`', function() {
    var fixtures = ['a', './a', 'b', 'a/a', './a/b', 'a/c', './a/x', './a/a/a', 'a/a/b', './a/a/a/a', './a/a/a/a/a', 'x/y', './z/z'];
    match(fixtures, '*', ['a', 'b']);
    match(fixtures, '**/a/**', ['a/a', 'a/c', 'a/b', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
    match(fixtures, '*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
    match(fixtures, '*/*/*', ['a/a/a', 'a/a/b']);
    match(fixtures, '*/*/*/*', ['a/a/a/a']);
    match(fixtures, '*/*/*/*/*', ['a/a/a/a/a']);
    match(fixtures, './*', ['a', 'b']);
    match(fixtures, './**/a/**', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
    match(fixtures, './a/*/a', ['a/a/a']);
    match(fixtures, 'a/*', ['a/a', 'a/b', 'a/c', 'a/x']);
    match(fixtures, 'a/*/*', ['a/a/a', 'a/a/b']);
    match(fixtures, 'a/*/*/*', ['a/a/a/a']);
    match(fixtures, 'a/*/*/*/*', ['a/a/a/a/a']);
    match(fixtures, 'a/*/a', ['a/a/a']);
  });
});
