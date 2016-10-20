'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('.match method', function() {
  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm(fixtures, '(a/b)', ['a/b']);
      mm(fixtures, 'a/b', ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a/a', 'a/b', 'a/c'];
      mm(fixtures, 'a/(a|c)', ['a/a', 'a/c']);
      mm(fixtures, 'a/(a|b|c)', ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      mm(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      mm(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm(fixtures, '!*/*', []);
      mm(fixtures, '!*/b', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm(fixtures, '!a/*', ['b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/(b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/(*)', ['b/a', 'b/b', 'b/c']);
      mm(fixtures, '!(*/b)', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm(fixtures, '!(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('unix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      mm(fixtures, '(a/b)', ['a/b']);
      mm(fixtures, 'a/b', ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      mm(fixtures, 'a/(a|c)', ['a/a', 'a/c']);
      mm(fixtures, 'a/(a|b|c)', ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      mm(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      mm(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      mm(fixtures, '!*/*', []);
      mm(fixtures, '!*/b', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm(fixtures, '!a/*', ['b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/(b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm(fixtures, '!a/(*)', ['b/a', 'b/b', 'b/c']);
      mm(fixtures, '!(*/b)', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm(fixtures, '!(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });
});
