'use strict';

const path = require('path');
const sep = path.sep;
const assert = require('assert');
const isWindows = () => process.platform === 'win32' || path.sep === '\\';
const mm = require('..');

describe('negation', () => {
  describe('posix paths', () => {
    it('should support negating with single *', () => {
      assert.deepEqual(mm(['a', 'b', 'c.md'], '!*.md'), ['a', 'b']);
      assert.deepEqual(mm(['a/a/a', 'a/b/a', 'a/c/a'], '!a/*/a'), []);
      assert.deepEqual(mm(['a/a/a/a', 'b/a/b/a', 'c/a/c/a'], '!a/*/*/a'), ['b/a/b/a', 'c/a/c/a']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c'], '!a/a*'), ['a/b', 'a/c']);
      assert.deepEqual(mm(['a.a', 'a.b', 'a.c'], '!a.a*'), ['a.b', 'a.c']);
      assert.deepEqual(mm(['a/a', 'a/b', 'a/c'], '!a/*'), []);
    });

    it('should support negation patterns', () => {
      let fixtures1 = ['a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];

      assert.deepEqual(mm(fixtures1, ['!a/b']), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures1, ['*/*', '!a/b', '!*/c']), ['a/a', 'b/a', 'b/b']);
      assert.deepEqual(mm(fixtures1, ['*/*', '!a/b', '!*/c']), ['a/a', 'b/a', 'b/b']);
      assert.deepEqual(mm(fixtures1, ['*/*', '!a/b', '!a/c']), ['a/a', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures1, ['!a/(b)']), ['a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['!bar', '*']), ['bar', 'baz', 'foo']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['*', '!bar']), ['baz', 'foo']);

      let fixtures2 = ['foo', 'bar', 'baz', 'main', 'other', 'foo/a/b/c', 'bar/a/b/d', 'baz/a/b/e', 'a/a/a', 'a/a/b', 'a/a/c', 'a/a/file'];

      assert.deepEqual(mm(fixtures2, ['a/**', '!a/a/file', 'main']), ['a/a/a', 'a/a/b', 'a/a/c', 'main']);
      assert.deepEqual(mm('foo', ['a/**', '!a/a/file', 'main']), []);
      assert.deepEqual(mm(['foo'], ['a/**', '!a/a/file', 'main']), []);
    });

    it('should support negating with literal non-globs', () => {
      let fixtures = ['a', 'b', 'a/a', 'a/b', 'a/c', 'b/a', 'b/b', 'b/c'];

      // assert.deepEqual(mm(fixtures, ['!a/a', '!a']), []);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], '!foo'), ['bar', 'baz']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['!bar', 'bar']), ['bar']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['!foo', 'bar']), ['bar']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['!foo']), ['bar', 'baz']);
      assert.deepEqual(mm(['bar', 'baz', 'foo'], ['bar', '!foo', '!bar']), []);
      assert.deepEqual(mm(['foo!.md', 'bar.md'], 'foo!.md'), ['foo!.md']);
      assert.deepEqual(mm(['foo.md'], '!.md'), ['foo.md']);
    });

    it('should negate files with extensions:', () => {
      assert.deepEqual(mm(['a.js', 'b.md', 'c.txt'], '!**/*.md'), ['a.js', 'c.txt']);
      assert.deepEqual(mm(['a.js', 'b.md', 'c.txt'], '!*.md'), ['a.js', 'c.txt']);
      assert.deepEqual(mm(['abc.md', 'abc.txt'], '!*.md'), ['abc.txt']);
      assert.deepEqual(mm(['foo.md'], '!*.md'), []);
    });

    it('should only treat leading exclamation as special', () => {
      assert.deepEqual(mm(['foo!.md', 'bar.md'], '*.md'), ['foo!.md', 'bar.md']);
      assert.deepEqual(mm(['foo!.md', 'bar.md'], '*!.md'), ['foo!.md']);
      assert.deepEqual(mm(['foobar.md'], '*b*.md'), ['foobar.md']);
      assert.deepEqual(mm(['foo!bar.md', 'foo!.md', '!foo!.md'], '*!*.md'), ['foo!bar.md', 'foo!.md', '!foo!.md']);
      assert.deepEqual(mm(['foo!bar.md', 'foo!.md', '!foo!.md'], '\\!*!*.md'), ['!foo!.md']);
      assert.deepEqual(mm(['foo!.md', 'ba!r.js'], '**/*!*.*'), ['foo!.md', 'ba!r.js']);
    });

    it('should support negated globstars ("**")', () => {
      assert.deepEqual(mm(['a.js', 'b.txt', 'c.md'], '!*.md'), ['a.js', 'b.txt']);
      assert.deepEqual(mm(['a/a/a.js', 'a/b/a.js', 'a/c/a.js', 'a/a/b.js'], '!**/a.js'), ['a/a/b.js']);
      assert.deepEqual(mm(['a/a/a/a.js', 'b/a/b/a.js', 'c/a/c/a.js'], '!a/**/a.js'), ['b/a/b/a.js', 'c/a/c/a.js']);
      assert.deepEqual(mm(['a/a.txt', 'a/b.txt', 'a/c.txt'], '!a/b.txt'), ['a/a.txt', 'a/c.txt']);
      assert.deepEqual(mm(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!**/*.md'), ['a/b.js', 'a.js']);
      assert.deepEqual(mm(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '**/*.md'), ['a/b.md', 'a.md']);

      assert.deepEqual(mm(['a/b.js'], '!**/*.md'), ['a/b.js']);
      assert.deepEqual(mm(['a.js'], '!**/*.md'), ['a.js']);
      assert.deepEqual(mm(['a/b.md'], '!**/*.md'), []);
      assert.deepEqual(mm(['a.md'], '!**/*.md'), []);

      assert.deepEqual(mm(['a/b.js'], '!*.md'), ['a/b.js']);
      assert.deepEqual(mm(['a.js'], '!*.md'), ['a.js']);
      assert.deepEqual(mm(['a/b.md'], '!*.md'), ['a/b.md']);
      assert.deepEqual(mm(['a.md'], '!*.md'), []);

      assert.deepEqual(mm(['a.js'], '!**/*.md'), ['a.js']);
      assert.deepEqual(mm(['b.md'], '!**/*.md'), []);
      assert.deepEqual(mm(['c.txt'], '!**/*.md'), ['c.txt']);
    });

    it('should negate dotfiles:', () => {
      assert.deepEqual(mm(['.dotfile.md'], '!*.md', { dot: true }), []);
      assert.deepEqual(mm(['.dotfile'], '!*.md'), ['.dotfile']);
      assert.deepEqual(mm(['.dotfile.txt'], '!*.md'), ['.dotfile.txt']);
      assert.deepEqual(mm(['.dotfile.txt', 'a/b/.dotfile'], '!*.md'), ['.dotfile.txt', 'a/b/.dotfile']);
      assert.deepEqual(mm(['.gitignore', 'a', 'b'], '!.gitignore'), ['a', 'b']);
    });

    it('should negate files in the immediate directory:', () => {
      assert.deepEqual(mm(['a/b.js', 'a.js', 'a/b.md', 'a.md'], '!*.md'), ['a/b.js', 'a.js', 'a/b.md']);
    });

    it('should not give special meaning to non-leading exclamations', () => {
      assert.deepEqual(mm(['a', 'aa', 'a/b', 'a!b', 'a!!b', 'a/!!/b'], 'a!!b'), ['a!!b']);
    });

    it('should negate files in any directory:', () => {
      assert.deepEqual(mm(['a/a.txt', 'a/b.txt', 'a/c.txt'], '!a/b.txt'), ['a/a.txt', 'a/c.txt']);
    });
  });

  describe('windows paths', () => {
    beforeEach(() => {
      path.sep = '\\';
    });
    afterEach(() => {
      path.sep = sep;
    });

    it('should support negation patterns', () => {
      let fixtures = ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c'];
      assert.deepEqual(mm(fixtures, ['!a/b']), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['*/*', '!a/b', '!*/c']), ['a/a', 'b/a', 'b/b']);
      assert.deepEqual(mm(fixtures, ['!*/c']), ['a', 'a/a', 'a/b', 'b/a', 'b/b']);
      assert.deepEqual(mm(fixtures, ['**', '!a/b', '!*/c']), ['a', 'a/a', 'b/a', 'b/b']);
      assert.deepEqual(mm(fixtures, ['**', '!a/b', '!a/c']), ['a', 'a/a', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!a/(b)']), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(a/b)']), ['a', 'a/a', 'a/c', 'b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['!(a)**']), ['b/a', 'b/b', 'b/c']);
      assert.deepEqual(mm(fixtures, ['**', '!(a)**']), ['b/a', 'b/b', 'b/c']);

      assert.deepEqual(mm(fixtures, ['!a/b'], { windows: false }), ['a', 'a\\a', 'a\\b', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, ['!a\\\\b'], { windows: false }), ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, ['*/*', '!a/b', '!*/c'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['!*\\\\c'], { windows: false }), ['a', 'a\\a', 'a\\b', 'b\\a', 'b\\b']);
      assert.deepEqual(mm(fixtures, ['**', '!a\\\\b', '!*\\\\c'], { windows: false }), ['a', 'a\\a', 'b\\a', 'b\\b']);
      assert.deepEqual(mm(fixtures, ['**', '!a\\\\b', '!a\\\\c'], { windows: false }), ['a', 'a\\a', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, ['**', '!a\\\\b'], { windows: false }), ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
      assert.deepEqual(mm(fixtures, ['**', '!a\\\\(b)'], { windows: false }), ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);

      assert.deepEqual(mm(fixtures, ['**', '!(a\\\\b)'], { windows: false }), ['a', 'a\\a', 'a\\c', 'b\\a', 'b\\b', 'b\\c']);
    });
  });
});
