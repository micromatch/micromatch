'use strict';

var path = require('path');
var assert = require('assert');
var mm = require('./support/match');
var sep = path.sep;

describe('.matcher()', function() {
  after(function() {
    path.sep = sep;
  });

  describe('errors', function() {
    it('should throw an error when arguments are invalid', function() {
      assert.throws(function() {
        mm.matcher(null);
      });

      assert.throws(function() {
        mm.matcher();
      });

      assert.throws(function() {
        mm.matcher(function() {});
      });
    });
  });

  describe('posix paths', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm.matcher(fixtures, '(a/b)', ['a/b']);
      mm.matcher(fixtures, 'a/b', ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a/a', 'a/b', 'a/c'];
      mm.matcher(fixtures, 'a/(a|c)', ['a/a', 'a/c']);
      mm.matcher(fixtures, 'a/(a|b|c)', ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      mm.matcher(fixtures, 'a/[b-c]', ['a/b', 'a/c']);
      mm.matcher(fixtures, 'a/[a-z]', ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm.matcher(fixtures, '!*/*', []);
      mm.matcher(fixtures, '!*/b', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm.matcher(fixtures, '!a/*', ['b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, '!a/b', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, '!a/(b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, '!a/(*)', ['b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, '!(*/b)', ['a/a', 'a/c', 'b/a', 'b/c']);
      mm.matcher(fixtures, '!(a/b)', ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
    });
  });

  describe('posix paths (array of patterns)', function() {
    it('should return an array of matches for a literal string', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm.matcher(fixtures, ['(a/b)'], ['a/b']);
      mm.matcher(fixtures, ['a/b'], ['a/b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a/a', 'a/b', 'a/c'];
      mm.matcher(fixtures, ['a/(a|c)'], ['a/a', 'a/c']);
      mm.matcher(fixtures, ['a/(a|b|c)'], ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'];
      mm.matcher(fixtures, ['a/[b-c]'], ['a/b', 'a/c']);
      mm.matcher(fixtures, ['a/[a-z]'], ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];
      mm.matcher(fixtures, ['!*/*'], []);
      mm.matcher(fixtures, ['!*/*'], []);
      mm.matcher(fixtures, ['!*/b'], ['a/a', 'a/c', 'b/a', 'b/c']);
      mm.matcher(fixtures, ['!a/*'], ['b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, ['!a/b'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, ['!a/(b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, ['!a/(*)'], ['b/a', 'b/b', 'b/c']);
      mm.matcher(fixtures, ['!(*/b)'], ['a/a', 'a/c', 'b/a', 'b/c']);
      mm.matcher(fixtures, ['!(a/b)'], ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
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
      mm.matcher(fixtures, '(a/b)', ['a\\b']);
      mm.matcher(fixtures, 'a/b', ['a\\b']);
    });

    it('should support regex logical or', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c'];
      mm.matcher(fixtures, 'a/(a|c)', ['a\\a', 'a\\c']);
      mm.matcher(fixtures, 'a/(a|b|c)', ['a\\a', 'a\\b', 'a\\c']);
    });

    it('should support regex ranges', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      mm.matcher(fixtures, 'a/[b-c]', ['a\\b', 'a\\c']);
      mm.matcher(fixtures, 'a/[a-z]', ['a\\a', 'a\\b', 'a\\c', 'a\\x']);
    });

    it('should support negation patterns', function() {
      var fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      mm.matcher(fixtures, '!*/*', []);
      mm.matcher(fixtures, '!*/b', ['a\\a', 'a\\c', 'b\\a', 'b\\c']);
      mm.matcher(fixtures, '!a/*', ['b\\a', 'b\\b', 'b\\c']);
      mm.matcher(fixtures, '!a/b', ['a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      mm.matcher(fixtures, '!a/(b)', ['a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      mm.matcher(fixtures, '!a/(*)', ['b\\a', 'b\\b', 'b\\c']);
      mm.matcher(fixtures, '!(*/b)', ['a\\a', 'a\\c', 'b\\a', 'b\\c']);
      mm.matcher(fixtures, '!(a/b)', ['a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      path.sep = sep;
    });
  });
});
