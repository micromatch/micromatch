'use strict';

var path = require('path');
var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var matcher = argv.mm ? require('minimatch') : require('..');
var compare = require('./support/compare');
var sep = path.sep;

function match(arr, pattern, expected, options) {
  var actual = matcher.not(arr, pattern, options);
  expected.sort(compare);
  actual.sort(compare);
  assert.deepEqual(actual, expected);
}

describe('.not method', function() {
  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      match(fixtures, '(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, 'a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a/a', 'a/b', 'a/c'];
      match(fixtures, 'a/(a|c)', ['a/b']);
      match(fixtures, 'a/(a|b|c)', []);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      match(fixtures, 'a/[b-c]', ['a/a', 'a/x/y', 'a/x']);
      match(fixtures, 'a/[a-z]', ['a/x/y']);
    });

    it('should support globs (*)', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a'];
      match(fixtures, 'a/*', ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/a', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      match(fixtures, 'a/**', []);
      match(fixtures, 'a/**/*', []);
      match(fixtures, 'a/**/**/*', []);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      match(fixtures, '!a/b', ['a/b']);
      match(fixtures, '!a/(b)', ['a/b']);
      match(fixtures, '!(a/b)', ['a/b']);
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
      var fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      match(fixtures, '(a/b)', ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, 'a/b', ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      match(fixtures, 'a/(a|c)', ['a/b']);
      match(fixtures, 'a/(a|b|c)', []);
    });

    it('should support regex ranges', function() {
      var fixtures = ['.\\a\\a', 'a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      match(fixtures, '[a-c]/[a-c]', ['a/x', 'a/x/y']);
      match(fixtures, 'a/[b-c]', ['a/a', 'a/x', 'a/x/y']);
      match(fixtures, 'a/[a-z]', ['a/x/y']);
    });

    it('should support globs (*)', function() {
      var fixtures = ['a\\a', 'a/a', 'a\\b', '.\\a\\b', 'a\\c', 'a\\x', 'a\\a\\a', 'a\\a\\b', 'a\\a\\a\\a', 'a\\a\\a\\a\\a'];
      match(fixtures, 'a/*', ['a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/a', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a/a', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a/a']);
      match(fixtures, 'a/*/*/*/*', ['a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a']);
    });

    it('should support globstars (**)', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      var expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      match(fixtures, '*', expected);
      match(fixtures, '**', []);
      match(fixtures, '*/*', ['a/x/y', 'a/x/y/z']);
      match(fixtures, 'a/**', []);
      match(fixtures, 'a/x/**', ['a/a', 'a/b', 'a/c', 'a/x']);
      match(fixtures, 'a/**/*', []);
      match(fixtures, 'a/**/**/*', []);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      var expected = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      match(fixtures, '!**', expected);
      match(fixtures, '!*/*', expected);
      match(fixtures, '!*', []);
      match(fixtures, '!a/b', ['a/b']);
      match(fixtures, '!a/(b)', ['a/b']);
      match(fixtures, '!(a/b)', ['a/b']);
    });
  });
});

