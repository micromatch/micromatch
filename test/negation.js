'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var matcher = argv.mm ? require('minimatch') : require('..');

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options);
  assert.deepEqual(actual.sort(), expected.sort());
}

describe('negation', function() {
  it('should negate files with extensions:', function() {
    match(['.md'], '!.md', []);
    match(['a.js', 'b.md', 'c.txt'], '!**/*.md', ['a.js', 'b.md', 'c.txt']);
    match(['a.js', 'b.md', 'c.txt'], '!*.md', ['a.js', 'c.txt']);
    match(['abc.md', 'abc.txt'], '!*.md', ['abc.txt']);
    match(['foo.md'], '!*.md', []);
    match(['foo.md'], '!.md', ['foo.md']);
  });

  it('should negate dotfiles:', function() {
    match(['.dotfile.md'], '!*.md', ['.dotfile.md']);
    match(['.dotfile.txt'], '!*.md', ['.dotfile.txt']);
    match(['.gitignore', 'a', 'b'], '!.gitignore', ['a', 'b']);
  });

  it('should negate files in the immediate directory:', function() {
    match(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!*.md', ['a/b.js', 'a.js', 'a/b.md']);
  });

  it('should negate files in any directory:', function() {
    match(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!**/*.md', ['a/b.js', 'a.md', 'a.js']);
  });
});
