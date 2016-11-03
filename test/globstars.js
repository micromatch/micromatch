'use strict';

var assert = require('assert');
var nm = require('./support/match');

describe('globstars', function() {
  it('should support globstars (**)', function() {
    var fixtures = ['.a/a', 'a/a', 'aa/a', 'aaa/a', 'aab/a', 'a/.a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z', 'a/../a', 'ab/../ac', '../a', 'a', '../../b', '../c', '../c/d'];

    nm(fixtures, '**', ['a', 'a/a', 'aa/a', 'aaa/a', 'aab/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, '**/**', ['a', 'a/a', 'aa/a', 'aaa/a', 'aab/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, '**/', []);
    nm(fixtures, '**/**/*', ['a', 'a/a', 'aa/a', 'aaa/a', 'aab/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, '**/**/x', ['a/x']);
    nm(fixtures, '**/x', ['a/x']);
    nm(fixtures, '**/x/*', ['a/x/y']);
    nm(fixtures, '*/x/**', ['a/x/y', 'a/x/y/z']);
    nm(fixtures, '**/x/**', ['a/x/y', 'a/x/y/z']);
    nm(fixtures, '**/x/*/*', ['a/x/y/z']);
    nm(fixtures, 'a/**', ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, 'a/**/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, 'a/**/**/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
    nm(fixtures, 'b/**', []);

    assert(!nm.isMatch('a/b', 'a/**/'));
    assert(!nm.isMatch('a/b/.js/c.txt', '**/*'));
    assert(!nm.isMatch('a/b/c/d', 'a/**/'));
    assert(!nm.isMatch('a/bb', 'a/**/'));
    assert(!nm.isMatch('a/cb', 'a/**/'));
    assert(nm.isMatch('a.b', '**/*'));
    assert(nm.isMatch('a.js', '**/*'));
    assert(nm.isMatch('a.js', '**/*.js'));
    assert(nm.isMatch('a.md', '**/*.md'));
    assert(nm.isMatch('a/', 'a/**/'));
    assert(nm.isMatch('a/a.js', '**/*.js'));
    assert(nm.isMatch('a/a/b.js', '**/*.js'));
    assert(nm.isMatch('a/b', 'a/**/b'));
    assert(nm.isMatch('a/b', 'a/**b'));
    assert(nm.isMatch('a/b.md', '**/*.md'));
    assert(nm.isMatch('a/b/c.js', '**/*'));
    assert(nm.isMatch('a/b/c.txt', '**/*'));
    assert(nm.isMatch('a/b/c/d/', 'a/**/'));
    assert(nm.isMatch('a/b/c/d/a.js', '**/*'));
    assert(nm.isMatch('a/b/c/z.js', 'a/b/**/*.js'));
    assert(nm.isMatch('a/b/z.js', 'a/b/**/*.js'));
    assert(nm.isMatch('ab', '**/*'));
    assert(nm.isMatch('ab/a/d', '**/*'));
    assert(nm.isMatch('ab/b', '**/*'));
    assert(nm.isMatch('za.js', '**/*'));
  });

  it('should support multiple globstars in one pattern', function() {
    assert(!nm.isMatch('a/b/c/d/e/z/foo.md', 'a/**/j/**/z/*.md'));
    assert(!nm.isMatch('a/b/c/j/e/z/foo.txt', 'a/**/j/**/z/*.md'));
    assert(nm.isMatch('a/b/c/d/e/j/n/p/o/z/foo.md', 'a/**/j/**/z/*.md'));
    assert(nm.isMatch('a/b/c/d/e/z/foo.md', 'a/**/z/*.md'));
    assert(nm.isMatch('a/b/c/j/e/z/foo.md', 'a/**/j/**/z/*.md'));
  });

  it('should match dotfiles', function() {
    var fixtures = ['.gitignore', 'a/b/z/.dotfile', 'a/b/z/.dotfile.md', 'a/b/z/.dotfile.md', 'a/b/z/.dotfile.md'];
    assert(!nm.isMatch('.gitignore', 'a/**/z/*.md'));
    assert(!nm.isMatch('a/b/z/.dotfile', 'a/**/z/*.md'));
    assert(!nm.isMatch('a/b/z/.dotfile.md', '**/c/.*.md'));
    assert(nm.isMatch('a/b/z/.dotfile.md', '**/.*.md'));
    assert(nm.isMatch('a/b/z/.dotfile.md', 'a/**/z/.*.md'));
    nm(fixtures, 'a/**/z/.*.md', [ 'a/b/z/.dotfile.md' ]);
  });

  it('should match file extensions:', function() {
    nm(['.md', 'a.md', 'a/b/c.md', '.txt'], '**/*.md', ['a.md', 'a/b/c.md']);
    nm(['.md', 'a/b/.md'], '**/.md', ['.md', 'a/b/.md']);
  });

  it('should respect trailing slashes on paterns', function() {
    var fixtures = ['a', 'a/', 'b', 'b/', 'a/a', 'a/a/', 'a/b', 'a/b/', 'a/c', 'a/c/', 'a/x', 'a/x/', 'a/a/a', 'a/a/b', 'a/a/b/', 'a/a/a/', 'a/a/a/a', 'a/a/a/a/', 'a/a/a/a/a', 'a/a/a/a/a/', 'x/y', 'z/z', 'x/y/', 'z/z/', 'a/b/c/.d/e/'];
    nm(fixtures, '**/*/a/', ['a/a/', 'a/a/a/', 'a/a/a/a/', 'a/a/a/a/a/']);
    nm(fixtures, '**/*/a/*/', ['a/a/a/', 'a/a/a/a/', 'a/a/a/a/a/', 'a/a/b/']);
    nm(fixtures, '**/*/x/', ['a/x/']);
    nm(fixtures, '**/*/*/*/*/', ['a/a/a/a/', 'a/a/a/a/a/']);
    nm(fixtures, '**/*/*/*/*/*/', ['a/a/a/a/a/']);
    nm(fixtures, '*a/a/*/', ['a/a/a/', 'a/a/b/']);
    nm(fixtures, '**a/a/*/', ['a/a/a/', 'a/a/b/']);
    nm(fixtures, '**/a/*/*/', ['a/a/a/', 'a/a/b/', 'a/a/a/a/', 'a/a/a/a/a/']);
    nm(fixtures, '**/a/*/*/*/', ['a/a/a/a/', 'a/a/a/a/a/']);
    nm(fixtures, '**/a/*/*/*/*/', ['a/a/a/a/a/']);
    nm(fixtures, '**/a/*/a/', ['a/a/a/', 'a/a/a/a/', 'a/a/a/a/a/']);
    nm(fixtures, '**/a/*/b/', ['a/a/b/']);
  });

  it('should match literal globstars when escaped', function() {
    var fixtures = ['.md', '**a.md', '**.md', '.md', '**'];
    nm(fixtures, '\\*\\**.md', ['**a.md', '**.md']);
    nm(fixtures, '\\*\\*.md', ['**.md']);
  });

  // related to https://github.com/isaacs/minimatch/issues/67
  it('should work consistently with `makeRe` and matcher functions', function() {
    var re = nm.makeRe('node_modules/foobar/**/*.bar');
    assert(re.test('node_modules/foobar/foo.bar'));
    assert(nm.isMatch('node_modules/foobar/foo.bar', 'node_modules/foobar/**/*.bar'));
    nm(['node_modules/foobar/foo.bar'], 'node_modules/foobar/**/*.bar', ['node_modules/foobar/foo.bar']);
  });
});
