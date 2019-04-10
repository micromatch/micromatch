'use strict';

const path = require('path');
const assert = require('assert');
const isWindows = () => process.platform === 'win32' || path.sep === '\\';
const patterns = require('./fixtures/patterns');
const mm = require('..');
let sep = path.sep;

/**
 * Minimatch comparison tests
 */

describe('basic tests', () => {
  afterEach(() => (path.sep = sep));
  after(() => (path.sep = sep));

  describe('minimatch parity', () => {
    patterns.forEach(function(unit, i) {
      it(i + ': ' + unit[0], () => {
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

        let pattern = unit[0];
        let expected = (unit[1] || []).sort(compare);
        let options = Object.assign({}, unit[2]);
        let fixtures = unit[3] || patterns.fixtures;
        mm(fixtures, pattern, expected, options);
      });
    });
  });

  describe('backslashes', () => {
    it('should match literal backslashes', () => {
      if (isWindows()) {
        mm(['\\'], '\\', ['/']);
      } else {
        mm(['\\'], '\\', ['\\']);
      }
    });
  });

  /**
   * Issues that minimatch fails on but micromatch passes
   */

  describe('minimatch issues (as of 12/7/2016)', () => {
    it('https://github.com/isaacs/minimatch/issues/29', () => {
      assert(mm.isMatch('foo/bar.txt', 'foo/**/*.txt'));
      assert(mm.makeRe('foo/**/*.txt').test('foo/bar.txt'));
      assert(!mm.isMatch('n/!(axios)/**', 'n/axios/a.js'));
      assert(!mm.makeRe('n/!(axios)/**').test('n/axios/a.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/30', () => {
      let format = str => str.replace(/^\.\//, '');

      assert(mm.isMatch('foo/bar.js', '**/foo/**'));
      assert(mm.isMatch('./foo/bar.js', './**/foo/**', { format }));
      assert(mm.isMatch('./foo/bar.js', '**/foo/**', { format }));
      assert(mm.isMatch('./foo/bar.txt', 'foo/**/*.txt', { format }));
      assert(mm.makeRe('./foo/**/*.txt').test('foo/bar.txt'));
      assert(!mm.isMatch('./foo/!(bar)/**', 'foo/bar/a.js'));
      assert(!mm.makeRe('./foo/!(bar)/**').test('foo/bar/a.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/50', () => {
      assert(mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[ABC\\].txt'));
      assert(!mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[abc\\].txt'));
      assert(mm.isMatch('foo/bar-[ABC].txt', 'foo/**/*-\\[abc\\].txt', {nocase: true}));
    });

    it('https://github.com/isaacs/minimatch/issues/67 (should work consistently with `makeRe` and matcher functions)', () => {
      var re = mm.makeRe('node_modules/foobar/**/*.bar');
      assert(re.test('node_modules/foobar/foo.bar'));
      assert(mm.isMatch('node_modules/foobar/foo.bar', 'node_modules/foobar/**/*.bar'));
      mm(['node_modules/foobar/foo.bar'], 'node_modules/foobar/**/*.bar', ['node_modules/foobar/foo.bar']);
    });

    it('https://github.com/isaacs/minimatch/issues/75', () => {
      assert(mm.isMatch('foo/baz.qux.js', 'foo/@(baz.qux).js'));
      assert(mm.isMatch('foo/baz.qux.js', 'foo/+(baz.qux).js'));
      assert(mm.isMatch('foo/baz.qux.js', 'foo/*(baz.qux).js'));
      assert(!mm.isMatch('foo/baz.qux.js', 'foo/!(baz.qux).js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/*/!(baz.qux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', '**/!(bazqux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', '**/bar/!(bazqux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', 'foo/**/!(bazqux).js'));
      assert(!mm.isMatch('foo/bar/bazqux.js', 'foo/**/!(bazqux)*.js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/**/!(baz.qux)*.js'));
      assert(!mm.isMatch('foo/bar/baz.qux.js', 'foo/**/!(baz.qux).js'));
      assert(!mm.isMatch('foobar.js', '!(foo)*.js'));
      assert(!mm.isMatch('foo.js', '!(foo).js'));
      assert(!mm.isMatch('foo.js', '!(foo)*.js'));
    });

    it('https://github.com/isaacs/minimatch/issues/78', () => {
      path.sep = '\\';
      assert(mm.isMatch('a\\b\\c.txt', 'a/**/*.txt'));
      assert(mm.isMatch('a/b/c.txt', 'a/**/*.txt'));
      path.sep = sep;
    });

    it('https://github.com/isaacs/minimatch/issues/82', () => {
      let format = str => str.replace(/^\.\//, '');
      assert(mm.isMatch('./src/test/a.js', '**/test/**', { format }));
      assert(mm.isMatch('src/test/a.js', '**/test/**'));
    });

    it('https://github.com/isaacs/minimatch/issues/83', () => {
      assert(!mm.makeRe('foo/!(bar)/**').test('foo/bar/a.js'));
      assert(!mm.isMatch('foo/!(bar)/**', 'foo/bar/a.js'));
    });
  });
});

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}
