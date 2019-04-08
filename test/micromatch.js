'use strict';

const assert = require('assert');
const path = require('path');
const mm = require('..');
const sep = path.sep;

describe('micromatch', () => {
  afterEach(() => (path.sep = sep));
  after(() => (path.sep = sep));

  describe('empty list', () => {
    it('should return an empty array', () => {
      assert.deepEqual(mm([], '*'), []);
    });
  });

  describe('posix paths', () => {
    it('should return an array of matches', () => {
      assert.deepEqual(mm(['a', 'a', 'a'], ['*', 'a*']), ['a']);
    });

    it('should return an array of matches for a literal string', () => {
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], '(a/b)'), ['a/b']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], 'a/b'), ['a/b']);
    });

    it('should return an array of matches for an array of literal strings', () => {
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['(a/b)', 'a/c']), ['a/b', 'a/c']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'], ['a/b', 'b/b']), ['a/b', 'b/b']);
    });

    it('should support regex logical or', () => {
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c'], ['a/(a|c)']), ['a/a', 'a/c']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c'], ['a/(a|b|c)', 'a/b']), ['a/a', 'a/b', 'a/c']);
    });

    it('should support regex ranges', () => {
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c'], 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c', 'a/x/y', 'a/x'], 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
    });

    it('should support single globs (*)', () => {
      let fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'a/x', 'a/a/a', 'a/a/b', 'a/a/a/a', 'a/a/a/a/a', 'x/y', 'z/z'];
      assert.deepEqual(mm(fixtures, ['*']), ['a', 'b']);
      assert.deepEqual(mm(fixtures, ['*/*']), ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      assert.deepEqual(mm(fixtures, ['*/*/*']), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, ['*/*/*/*']), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['*/*/*/*/*']), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*']), ['a/a', 'a/b', 'a/c', 'a/x']);
      assert.deepEqual(mm(fixtures, ['a/*/*']), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, ['a/*/*/*']), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/*/*/*']), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/a']), ['a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/b']), ['a/a/b']);
    });

    it('should support globstars (**)', () => {
      let fixtures = ['a', 'a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(mm(fixtures, ['*{,/}']), ['a', 'a/']);
      assert.deepEqual(mm(fixtures, ['*/']), ['a/']);
      assert.deepEqual(mm(fixtures, ['*/*']), ['a/a', 'a/b', 'a/c', 'a/x']);
      assert.deepEqual(mm(fixtures, ['**']), fixtures);
      assert.deepEqual(mm(fixtures, ['**/a']), ['a', 'a/a']);
      assert.deepEqual(mm(fixtures, ['a/*']), ['a/a', 'a/b', 'a/c', 'a/x']);
      assert.deepEqual(mm(fixtures, ['a/**']), ['a', 'a/', 'a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      assert.deepEqual(mm(fixtures, ['a/**/*']), ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      assert.deepEqual(mm(fixtures, ['a/**/**/*']), ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z']);
      assert.deepEqual(mm(['a/b/foo/bar/baz.qux'], 'a/b/**/bar/**/*.*'), ['a/b/foo/bar/baz.qux']);
      assert.deepEqual(mm(['a/b/bar/baz.qux'], 'a/b/**/bar/**/*.*'), ['a/b/bar/baz.qux']);
    });

    it('should work with file extensions', () => {
      let fixtures = ['a.txt', 'a/b.txt', 'a/x/y.txt', 'a/x/y/z'];
      assert.deepEqual(mm(fixtures, ['a/**/*.txt']), ['a/b.txt', 'a/x/y.txt']);
      assert.deepEqual(mm(fixtures, ['a/*.txt']), ['a/b.txt']);
      assert.deepEqual(mm(fixtures, ['a*.txt']), ['a.txt']);
      assert.deepEqual(mm(fixtures, ['*.txt']), ['a.txt']);
    });

    it('should match literal brackets', () => {
      assert.deepEqual(mm(['a [b]'], 'a \\[b\\]'), ['a [b]']);
      assert.deepEqual(mm(['a [b] c'], 'a [b] c'), ['a [b] c']);
      assert.deepEqual(mm(['a [b]'], 'a \\[b\\]*'), ['a [b]']);
      assert.deepEqual(mm(['a [bc]'], 'a \\[bc\\]*'), ['a [bc]']);
      assert.deepEqual(mm(['a [b]', 'a [b].js'], 'a \\[b\\].*'), ['a [b].js']);
    });
  });

  describe('windows paths', () => {
    beforeEach(() => {
      path.sep = '\\';
    });
    afterEach(() => {
      path.sep = sep;
    });

    it('should return an array of matches for a literal string', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, '(a/b)'), ['a/b']);
      assert.deepEqual(mm(fixtures, 'a/b'), ['a/b']);
      assert.deepEqual(mm(fixtures, '(a/b)', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a/b', { windows: false }), []);
    });

    it('should return an array of matches for an array of literal strings', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, ['(a/b)', 'a/c']), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, ['a/b', 'b/b']), ['a/b', 'b/b']);
      assert.deepEqual(mm(fixtures, ['(a/b)', 'a/c'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['a/b', 'b/b'], { windows: false }), []);
    });

    it('should support regex logical or', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c'];
      assert.deepEqual(mm(fixtures, ['a/(a|c)']), ['a/a', 'a/c']);
      assert.deepEqual(mm(fixtures, ['a/(a|b|c)', 'a/b']), ['a/a', 'a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, ['a/(a|c)'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['a/(a|b|c)', 'a/b'], { windows: false }), []);
    });

    it('should support regex ranges', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x\\y', 'a\\x'];
      assert.deepEqual(mm(fixtures, 'a/[b-c]'), ['a/b', 'a/c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]'), ['a/a', 'a/b', 'a/c', 'a/x']);
      assert.deepEqual(mm(fixtures, 'a/[b-c]', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a\\\\[b-c]', { windows: false }), ['a\\b', 'a\\c']);
      assert.deepEqual(mm(fixtures, 'a/[a-z]', { windows: false }), []);
    });

    it('should support single globs (*)', () => {
      let fixtures = [
        'a',
        'b',
        'a\\a',
        'a\\b',
        'a\\c',
        'a\\x',
        'a\\a\\a',
        'a\\a\\b',
        'a\\a\\a\\a',
        'a\\a\\a\\a\\a',
        'x\\y',
        'z\\z'
      ];

      assert.deepEqual(mm(fixtures, ['*']), ['a', 'b']);
      assert.deepEqual(mm(fixtures, ['*/*']), ['a/a', 'a/b', 'a/c', 'a/x', 'x/y', 'z/z']);
      assert.deepEqual(mm(fixtures, ['*/*/*']), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, ['*/*/*/*']), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['*/*/*/*/*']), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*']), ['a/a', 'a/b', 'a/c', 'a/x']);
      assert.deepEqual(mm(fixtures, ['a/*/*']), ['a/a/a', 'a/a/b']);
      assert.deepEqual(mm(fixtures, ['a/*/*/*']), ['a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/*/*/*']), ['a/a/a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/a']), ['a/a/a']);
      assert.deepEqual(mm(fixtures, ['a/*/b']), ['a/a/b']);

      let opts = { windows: false };
      assert.deepEqual(mm(fixtures, ['*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['*/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['*/*/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['*/*/*/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*/*/*/*'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*/a'], opts), []);
      assert.deepEqual(mm(fixtures, ['a/*/b'], opts), []);
    });

    it('should support globstars (**)', () => {
      let fixtures = ['a\\a', 'a\\b', 'a\\c', 'a\\x', 'a\\x\\y', 'a\\x\\y\\z'];
      let expected = ['a/a', 'a/b', 'a/c', 'a/x', 'a/x/y', 'a/x/y/z'];
      assert.deepEqual(mm(fixtures, ['a/**']), expected);
      assert.deepEqual(mm(fixtures, ['a/**/*']), expected);
      assert.deepEqual(mm(fixtures, ['a/**/**/*']), expected);

      assert.deepEqual(mm(fixtures, ['a/**'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['a/**/*'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['a/**/**/*'], { windows: false }), []);
    });

    it('should work with file extensions', () => {
      let fixtures = ['a.txt', 'a\\b.txt', 'a\\x\\y.txt', 'a\\x\\y\\z'];
      assert.deepEqual(mm(fixtures, ['a\\\\**\\\\*.txt']), []);
      assert.deepEqual(mm(fixtures, ['a\\\\*\\\\*.txt']), []);
      assert.deepEqual(mm(fixtures, ['a\\\\*.txt']), []);
      assert.deepEqual(mm(fixtures, ['a/**/*.txt']), ['a/b.txt', 'a/x/y.txt']);
      assert.deepEqual(mm(fixtures, ['a/*/*.txt']), ['a/x/y.txt']);
      assert.deepEqual(mm(fixtures, ['a/*.txt']), ['a/b.txt']);
      assert.deepEqual(mm(fixtures, ['a*.txt']), ['a.txt']);
      assert.deepEqual(mm(fixtures, ['a.txt']), ['a.txt']);
    });
  });
});
