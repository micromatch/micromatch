'use strict';

var path = require('path');
var sep = path.sep;
var mm = require('./support/match');

describe('micromatch', function() {
  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], '(a/b)', ['a/b']);
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], 'a/b', ['a/b']);
    });

    it('should return an array of matches for an array of literal strings', function() {
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['(a/b)', 'a/c'], ['a/b', 'a/c']);
      mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['a/b', 'b/b'], ['a/b', 'b/b']);
    });

    it('should support regex logical or', function() {
      mm(['a/a', 'a/b', 'a/c'], ['a/(a|c)'], ['a/a', 'a/c']);
      mm(['a/a', 'a/b', 'a/c'], ['a/(a|b|c)', 'a/b'], ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      mm(['a/a', 'a/b', 'a/c'], 'a/[b-c]', ['a/b', 'a/c']);
      mm(['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'], 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support single globs (*)', function() {
      var fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
      mm(fixtures, ['*'], ['a', 'b']);
      mm(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      mm(fixtures, ['*/*/*'], ['a/a/a', 'a/a/b']);
      mm(fixtures, ['*/*/*/*'], ['a/a/a/a']);
      mm(fixtures, ['*/*/*/*/*'], ['a/a/a/a/a']);
      mm(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      mm(fixtures, ['a/*/*'], ['a/a/a', 'a/a/b']);
      mm(fixtures, ['a/*/*/*'], ['a/a/a/a']);
      mm(fixtures, ['a/*/*/*/*'], ['a/a/a/a/a']);
      mm(fixtures, ['a/*/a'], ['a/a/a']);
      mm(fixtures, ['a/*/b'], ['a/a/b']);
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a', 'a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      mm(fixtures, ['*'], ['a', 'a/']);
      mm(fixtures, ['*/'], ['a/']);
      mm(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      mm(fixtures, ['**'], fixtures);
      mm(fixtures, ['**/a'], ['a', 'a/', 'a/a']);
      mm(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      mm(fixtures, ['a/**'], ['a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      mm(fixtures, ['a/**/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      mm(fixtures, ['a/**/**/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      mm(['a/b/foo/bar/baz.qux'], 'a/b/**/bar/**/*.*', ['a/b/foo/bar/baz.qux']);
      mm(['a/b/bar/baz.qux'], 'a/b/**/bar/**/*.*', ['a/b/bar/baz.qux']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm(fixtures, ['!a/b'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['*/*', '!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      mm(fixtures, ['!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      mm(fixtures, ['!a/b', '!a/c'], ['a/a', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['!a/(b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['!(a/b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should work with file extensions', function() {
      var fixtures = ['a.txt', 'a/b.txt', 'a/x/y.txt', 'a/x/y/z'];
      mm(fixtures, ['a/**/*.txt'], ['a/b.txt', 'a/x/y.txt']);
      mm(fixtures, ['a/*.txt'], ['a/b.txt']);
      mm(fixtures, ['a*.txt'], ['a.txt']);
      mm(fixtures, ['*.txt'], ['a.txt']);
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
      mm(fixtures, '(a/b)', ['a/b']);
      mm(fixtures, 'a/b', ['a/b']);
    });

    it('should return an array of matches for an array of literal strings', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      mm(fixtures, ['(a/b)', 'a/c'], ['a/b', 'a/c']);
      mm(fixtures, ['a/b', 'b/b'], ['a/b', 'b/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      mm(fixtures, ['a/(a|c)'], ['a/a', 'a/c']);
      mm(fixtures, ['a/(a|b|c)', 'a/b'], ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      mm(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      mm(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support single globs (*)', function() {
      var fixtures = ['a', 'b', 'a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\a\\a', 'a\\a\\b', 'a\\a\\a\\a', 'a\\a\\a\\a\\a', 'x\\y', 'z\\z'];
      mm(fixtures, ['*'], ['a', 'b']);
      mm(fixtures, ['*/*'], ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      mm(fixtures, ['*/*/*'], ['a/a/a', 'a/a/b']);
      mm(fixtures, ['*/*/*/*'], ['a/a/a/a']);
      mm(fixtures, ['*/*/*/*/*'], ['a/a/a/a/a']);
      mm(fixtures, ['a/*'], ['a/a', 'a/b', 'a/c', 'a/x']);
      mm(fixtures, ['a/*/*'], ['a/a/a', 'a/a/b']);
      mm(fixtures, ['a/*/*/*'], ['a/a/a/a']);
      mm(fixtures, ['a/*/*/*/*'], ['a/a/a/a/a']);
      mm(fixtures, ['a/*/a'], ['a/a/a']);
      mm(fixtures, ['a/*/b'], ['a/a/b']);
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      var expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      mm(fixtures, ['a/**'], expected);
      mm(fixtures, ['a/**/*'], expected);
      mm(fixtures, ['a/**/**/*'], expected);
    });

    it('should work with file extensions', function() {
      var fixtures = ['a.txt', 'a\\b.txt', 'a\\x\\y.txt', 'a\\x\\y\\z'];
      mm(fixtures, ['a/**/*.txt'], ['a/b.txt', 'a/x/y.txt']);
      mm(fixtures, ['a/*/*.txt'], ['a/x/y.txt']);
      mm(fixtures, ['a/*.txt'], ['a/b.txt']);
      mm(fixtures, ['a*.txt'], ['a.txt']);
      mm(fixtures, ['a.txt'], ['a.txt']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      mm(fixtures, ['!a/b'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['*/*', '!a/b', '!*/c'], ['a/a', 'b/a', 'b/b']);
      mm(fixtures, ['!*/c'], ['a', 'a/a', 'a/b', 'b/a', 'b/b']);
      mm(fixtures, ['!a/b', '!*/c'], ['a', 'a/a', 'b/a', 'b/b']);
      mm(fixtures, ['!a/b', '!a/c'], ['a', 'a/a', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['!a/(b)'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, ['!(a/b)'], ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });
});
