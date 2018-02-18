'use strict';

var assert = require('assert');
var path = require('path');
var matcher = require('./support/match');
var mm = require('..');
var sep = path.sep;

describe('micromatch', function() {
  after(function() {
    path.sep = sep;
  });

  describe('empty list', function() {
    it('should return an empty array', function() {
      matcher([], '*', []);
    });
  });

  describe('options.nodupes', function() {
    it('should return an array with duplicates', function() {
      matcher(['a', 'a', 'a'], ['*', 'a*'], {nodupes: false}, ['a', 'a', 'a', 'a', 'a', 'a']);
    });
  });

  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      matcher(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], '(a/b)', ['a/b']);
      matcher(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], 'a/b', ['a/b']);
    });

    it('should return an array of matches for an array of literal strings', function() {
      matcher(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['(a/b)', 'a/c'], ['a/b', 'a/c']);
      matcher(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['a/b', 'b/b'], ['a/b', 'b/b']);
    });

    it('should support regex logical or', function() {
      matcher(['a/a', 'a/b', 'a/c'], ['a/(a|c)'], ['a/a', 'a/c']);
      matcher(['a/a', 'a/b', 'a/c'], ['a/(a|b|c)', 'a/b'], ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      matcher(['a/a', 'a/b', 'a/c'], 'a/[b-c]', ['a/b', 'a/c']);
      matcher(['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'], 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support single globs (*)', function() {
      var fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
      matcher(fixtures, ['*'], ['a', 'b']);
      matcher(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      matcher(fixtures, ['*/*/*'], ['a/a/a', 'a/a/b']);
      matcher(fixtures, ['*/*/*/*'], ['a/a/a/a']);
      matcher(fixtures, ['*/*/*/*/*'], ['a/a/a/a/a']);
      matcher(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      matcher(fixtures, ['a/*/*'], ['a/a/a', 'a/a/b']);
      matcher(fixtures, ['a/*/*/*'], ['a/a/a/a']);
      matcher(fixtures, ['a/*/*/*/*'], ['a/a/a/a/a']);
      matcher(fixtures, ['a/*/a'], ['a/a/a']);
      matcher(fixtures, ['a/*/b'], ['a/a/b']);
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a', 'a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      matcher(fixtures, ['*'], ['a', 'a/']);
      matcher(fixtures, ['*/'], ['a/']);
      matcher(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      matcher(fixtures, ['**'], fixtures);
      matcher(fixtures, ['**/a'], ['a', 'a/', 'a/a']);
      matcher(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      matcher(fixtures, ['a/**'], ['a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      matcher(fixtures, ['a/**/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      matcher(fixtures, ['a/**/**/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      matcher(['a/b/foo/bar/baz.qux'], 'a/b/**/bar/**/*.*', ['a/b/foo/bar/baz.qux']);
      matcher(['a/b/bar/baz.qux'], 'a/b/**/bar/**/*.*', ['a/b/bar/baz.qux']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      matcher(fixtures, ['!a/b'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['*/*', '!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      matcher(fixtures, ['*/*', '!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      matcher(fixtures, ['*/*', '!a/b', '!a/c'], ['a/a', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['!a/(b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['!(a/b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support multiple patterns', function() {
      var dirs = ['foo.js', 'bar.js', 'baz.js', 'main.js', 'other.js', 'foo/a/b/c.js', 'bar/a/b/d.js', 'baz/a/b/e.js', 'a/a/a.js', 'a/a/b.js', 'a/a/c.js', 'a/a/file.js'];

      var actual = mm(dirs, ['a/**', '!a/a/file.js', 'main.js']);
      assert.deepEqual(actual, ['a/a/a.js', 'a/a/b.js', 'a/a/c.js', 'main.js']);
      assert.deepEqual(mm('foo', ['a/**', '!a/a/file.js', 'main.js']), []);
      assert.deepEqual(mm(['foo'], ['a/**', '!a/a/file.js', 'main.js']), []);
    });

    it('should work with file extensions', function() {
      var fixtures = ['a.txt', 'a/b.txt', 'a/x/y.txt', 'a/x/y/z'];
      matcher(fixtures, ['a/**/*.txt'], ['a/b.txt', 'a/x/y.txt']);
      matcher(fixtures, ['a/*.txt'], ['a/b.txt']);
      matcher(fixtures, ['a*.txt'], ['a.txt']);
      matcher(fixtures, ['*.txt'], ['a.txt']);
    });

    it('should match literal brackets', function() {
      matcher(['a [b]'], 'a \\[b\\]', ['a [b]']);
      matcher(['a [b] c'], 'a [b] c', ['a [b] c']);
      matcher(['a [b]'], 'a \\[b\\]*', ['a [b]']);
      matcher(['a [bc]'], 'a \\[bc\\]*', ['a [bc]']);
      matcher(['a [b]', 'a [b].js'], 'a \\[b\\].*', ['a [b].js']);
    });
  });

  describe('windows paths', function() {
    beforeEach(function() {
      path.sep = '\\';
    });
    afterEach(function() {
      path.sep = sep;
    });

    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      matcher(fixtures, '(a/b)', ['a/b']);
      matcher(fixtures, 'a/b', ['a/b']);
      matcher(fixtures, '(a/b)', ['a\\b'], {unixify: false});
      matcher(fixtures, 'a/b', ['a\\b'], {unixify: false});
    });

    it('should return an array of matches for an array of literal strings', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      matcher(fixtures, ['(a/b)', 'a/c'], ['a/b', 'a/c']);
      matcher(fixtures, ['a/b', 'b/b'], ['a/b', 'b/b']);
      matcher(fixtures, ['(a/b)', 'a/c'], ['a\\b', 'a\\c'], {unixify: false});
      matcher(fixtures, ['a/b', 'b/b'], ['a\\b', 'b\\b'], {unixify: false});
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      matcher(fixtures, ['a/(a|c)'], ['a/a', 'a/c']);
      matcher(fixtures, ['a/(a|b|c)', 'a/b'], ['a/a', 'a/b', 'a/c']);
      matcher(fixtures, ['a/(a|c)'], ['a\\a', 'a\\c'], {unixify: false});
      matcher(fixtures, ['a/(a|b|c)', 'a/b'], ['a\\a', 'a\\b', 'a\\c'], {unixify: false});
    });

    it('should support regex ranges', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      matcher(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      matcher(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
      matcher(fixtures, 'a/[b-c]', ['a\\b', 'a\\c'], {unixify: false});
      matcher(fixtures, 'a/[a-z]', ['a\\a', 'a\\b', 'a\\c', 'a\\x'], {unixify: false});
    });

    it('should support single globs (*)', function() {
      var fixtures = ['a', 'b', 'a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\a\\a', 'a\\a\\b', 'a\\a\\a\\a', 'a\\a\\a\\a\\a', 'x\\y', 'z\\z'];
      matcher(fixtures, ['*'], ['a', 'b']);
      matcher(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      matcher(fixtures, ['*/*/*'], ['a/a/a', 'a/a/b']);
      matcher(fixtures, ['*/*/*/*'], ['a/a/a/a']);
      matcher(fixtures, ['*/*/*/*/*'], ['a/a/a/a/a']);
      matcher(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      matcher(fixtures, ['a/*/*'], ['a/a/a', 'a/a/b']);
      matcher(fixtures, ['a/*/*/*'], ['a/a/a/a']);
      matcher(fixtures, ['a/*/*/*/*'], ['a/a/a/a/a']);
      matcher(fixtures, ['a/*/a'], ['a/a/a']);
      matcher(fixtures, ['a/*/b'], ['a/a/b']);

      matcher(fixtures, ['*/*'], ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'x\\y', 'z\\z'], {unixify: false});
      matcher(fixtures, ['*/*/*'], ['a\\a\\a', 'a\\a\\b'], {unixify: false});
      matcher(fixtures, ['*/*/*/*'], ['a\\a\\a\\a'], {unixify: false});
      matcher(fixtures, ['*/*/*/*/*'], ['a\\a\\a\\a\\a'], {unixify: false});
      matcher(fixtures, ['a/*'], ['a\\a', 'a\\b', 'a\\c', 'a\\x'], {unixify: false});
      matcher(fixtures, ['a/*/*'], ['a\\a\\a', 'a\\a\\b'], {unixify: false});
      matcher(fixtures, ['a/*/*/*'], ['a\\a\\a\\a'], {unixify: false});
      matcher(fixtures, ['a/*/*/*/*'], ['a\\a\\a\\a\\a'], {unixify: false});
      matcher(fixtures, ['a/*/a'], ['a\\a\\a'], {unixify: false});
      matcher(fixtures, ['a/*/b'], ['a\\a\\b'], {unixify: false});
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      var expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      matcher(fixtures, ['a/**'], expected);
      matcher(fixtures, ['a/**/*'], expected);
      matcher(fixtures, ['a/**/**/*'], expected);

      matcher(fixtures, ['a/**'], fixtures, {unixify: false});
      matcher(fixtures, ['a/**/*'], fixtures, {unixify: false});
      matcher(fixtures, ['a/**/**/*'], fixtures, {unixify: false});
    });

    it('should work with file extensions', function() {
      var fixtures = ['a.txt', 'a\\b.txt', 'a\\x\\y.txt', 'a\\x\\y\\z'];
      matcher(fixtures, ['a/**/*.txt'], ['a\\b.txt', 'a\\x\\y.txt'], {unixify: false});
      matcher(fixtures, ['a/*/*.txt'], ['a\\x\\y.txt'], {unixify: false});
      matcher(fixtures, ['a/*.txt'], ['a\\b.txt'], {unixify: false});
      matcher(fixtures, ['a/**/*.txt'], ['a/b.txt', 'a/x/y.txt']);
      matcher(fixtures, ['a/*/*.txt'], ['a/x/y.txt']);
      matcher(fixtures, ['a/*.txt'], ['a/b.txt']);
      matcher(fixtures, ['a*.txt'], ['a.txt']);
      matcher(fixtures, ['a.txt'], ['a.txt']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      matcher(fixtures, ['!a/b'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['*/*', '!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      matcher(fixtures, ['!*/c'], ['a', 'a/a', 'a/b', 'b/a', 'b/b']);
      matcher(fixtures, ['**', '!a/b', '!*/c'], ['a', 'a/a', 'b/a', 'b/b']);
      matcher(fixtures, ['**', '!a/b', '!a/c'], ['a', 'a/a', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['!a/(b)'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      matcher(fixtures, ['!(a/b)'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);

      matcher(fixtures, ['!a/b'], ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c'], {unixify: false});
      matcher(fixtures, ['*/*', '!a/b', '!*/c'], ['a\\a', 'b\\a', 'b\\b'], {unixify: false});
      matcher(fixtures, ['!*/c'], ['a', 'a\\a', 'a\\b', 'b\\a', 'b\\b'], {unixify: false});
      matcher(fixtures, ['**', '!a/b', '!*/c'], ['a', 'a\\a', 'b\\a', 'b\\b'], {unixify: false});
      matcher(fixtures, ['**', '!a/b', '!a/c'], ['a', 'a\\a', 'b\\a', 'b\\b', 'b\\c'], {unixify: false});
      matcher(fixtures, ['**', '!a/(b)'], ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c'], {unixify: false});
      matcher(fixtures, ['**', '!(a/b)'], ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c'], {unixify: false});
    });
  });
});
