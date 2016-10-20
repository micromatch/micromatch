'use strict';

var match = require('./support/match');

describe('.match method', function() {
  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      match(fixtures, '(a/b)', ['a/b']);
      match(fixtures, 'a/b', ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a/a', 'a/b', 'a/c'];
      match(fixtures, 'a/(a|c)', ['a/a', 'a/c']);
      match(fixtures, 'a/(a|b|c)', ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      match(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      match(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      match(fixtures, '!*/*', []);
      match(fixtures, '!*/b', ['a/a', 'a/c', 'b/a', 'b/c']);
      match(fixtures, '!a/*', ['b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/(b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/(*)', ['b/a', 'b/b', 'b/c']);
      match(fixtures, '!(*/b)', ['a/a', 'a/c', 'b/a', 'b/c']);
      match(fixtures, '!(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('unix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      match(fixtures, '(a/b)', ['a/b']);
      match(fixtures, 'a/b', ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      match(fixtures, 'a/(a|c)', ['a/a', 'a/c']);
      match(fixtures, 'a/(a|b|c)', ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      match(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      match(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      match(fixtures, '!*/*', []);
      match(fixtures, '!*/b', ['a/a', 'a/c', 'b/a', 'b/c']);
      match(fixtures, '!a/*', ['b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/(b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      match(fixtures, '!a/(*)', ['b/a', 'b/b', 'b/c']);
      match(fixtures, '!(*/b)', ['a/a', 'a/c', 'b/a', 'b/c']);
      match(fixtures, '!(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });
});
