'use strict';

var path = require('path');
var assert = require('assert');
var isWindows = require('is-windows');
var extend = require('extend-shallow');
var patterns = require('./fixtures/patterns');
var mm = require('./support/match');

/**
 * Minimatch comparison tests
 */

describe('basic tests', function() {
  patterns.forEach(function(unit, i) {
    it(i + ': ' + unit[0], function() {
      if (typeof unit === 'string') {
        console.log();
        console.log(' ', unit);
        return;
      }

      // update fixtures list
      if (typeof unit === 'function') {
        unit();
        return;
      }

      var pattern = unit[0];
      var expected = (unit[1] || []).sort(compare);
      var options = extend({}, unit[2]);
      var fixtures = unit[3] || patterns.fixtures;
      mm.match(fixtures, pattern, expected, options);
    });
  });
});

describe('minimatch parity:', function() {
  describe('backslashes', function() {
    it('should match literal backslashes', function() {
      if (isWindows()) {
        mm.match(['\\'], '\\', ['/']);
      } else {
        mm.match(['\\'], '\\', ['\\']);
      }
    });
  });

  /**
   * Issues that minimatch fails on but micromatch passes
   */

  describe('minimatch issues (as of 12/7/2016)', function() {
    it('https://github.com/isaacs/minimatch/issues/29', function() {
      assert(mm.isMatch('foo/bar.txt', 'foo/**/*.txt'));
      assert(mm.makeRe('foo/**/*.txt').test('foo/bar.txt'));
      assert(!mm.isMatch('n/!(axios)/**', 'n/axios/a.js'));
      assert(!mm.makeRe('n/!(axios)/**').test('n/axios/a.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/30', function() {
      assert(mm.isMatch('foo/bar.js', '**/foo/**'));
      assert(mm.isMatch('./foo/bar.js', './**/foo/**'));
      assert(mm.isMatch('./foo/bar.js', '**/foo/**'));
      assert(mm.isMatch('./foo/bar.txt', 'foo/**/*.txt'));
      assert(mm.makeRe('./foo/**/*.txt').test('foo/bar.txt'));
      assert(!mm.isMatch('./foo/!(bar)/**', 'foo/bar/a.js'));
      assert(!mm.makeRe('./foo/!(bar)/**').test('foo/bar/a.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/50', function() {
      assert(mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[ABC\\].txt'));
      assert(!mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[abc\\].txt'));
      assert(mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[abc\\].txt', {nocase: true}));
    });

    it('https://github.com/isaacs/minimatch/issues/67 (should work consistently with `makeRe` and matcher functions)', function() {
      var re = mm.makeRe('node_modules/foobar/**/*.bar');
      assert(re.test('node_modules/foobar/foo.bar'));
      assert(mm.isMatch('node_modules/foobar/foo.bar', 'node_modules/foobar/**/*.bar'));
      mm(['node_modules/foobar/foo.bar'], 'node_modules/foobar/**/*.bar', ['node_modules/foobar/foo.bar']);
    });

    it('https://github.com/isaacs/minimatch/issues/75', function() {
      assert(mm.isMatch('foo/baz.qux.js', 'foo/@(baz.qux).js'));
      assert(mm.isMatch('foo/baz.qux.js', 'foo/+(baz.qux).js'));
      assert(mm.isMatch('foo/baz.qux.js', 'foo/*(baz.qux).js'));
      assert(!mm.isMatch('foo/baz.qux.js', 'foo/!(baz.qux).js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/*/!(baz.qux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', '**/!(bazqux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', 'foo/**/!(bazqux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', 'foo/**/!(bazqux)*.js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/**/!(baz.qux)*.js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/**/!(baz.qux).js'));
      assert(!mm.isMatch('foo.js', '!(foo)*.js'));
      assert(!mm.isMatch('foo.js', '!(foo)*.js'));
      assert(!mm.isMatch('foobar.js', '!(foo)*.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/78', function() {
      var sep = path.sep;
      path.sep = '\\';
      assert(mm.isMatch('a\\b\\c.txt', 'a/**/*.txt'));
      assert(mm.isMatch('a/b/c.txt', 'a/**/*.txt'));
      path.sep = sep;
    });

    it('https://github.com/isaacs/minimatch/issues/82', function() {
      assert(mm.isMatch('./src/test/a.js', '**/test/**'));
      assert(mm.isMatch('src/test/a.js', '**/test/**'));
    });

    it('https://github.com/isaacs/minimatch/issues/83', function() {
      assert(!mm.makeRe('foo/!(bar)/**').test('foo/bar/a.js'));
      assert(!mm.isMatch('foo/!(bar)/**', 'foo/bar/a.js'));
    });
  });
});

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
