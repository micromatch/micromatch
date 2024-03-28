'use strict';

const assert = require('assert');
const { isMatch } = require('..');

describe('bash.spec', () => {
  describe('dotglob', () => {
    it('"a/b/.x" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x', '**/.x/**', { bash: true }));
    });

    it('".x" should match "**/.x/**"', () => {
      assert(isMatch('.x', '**/.x/**', { bash: true }));
    });

    it('".x/" should match "**/.x/**"', () => {
      assert(isMatch('.x/', '**/.x/**', { bash: true }));
    });

    it('".x/a" should match "**/.x/**"', () => {
      assert(isMatch('.x/a', '**/.x/**', { bash: true }));
    });

    it('".x/a/b" should match "**/.x/**"', () => {
      assert(isMatch('.x/a/b', '**/.x/**', { bash: true }));
    });

    it('".x/.x" should match "**/.x/**"', () => {
      assert(isMatch('.x/.x', '**/.x/**', { bash: true }));
    });

    it('"a/.x" should match "**/.x/**"', () => {
      assert(isMatch('a/.x', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c/d" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c/d', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c/d/e" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c/d/e', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/', '**/.x/**', { bash: true }));
    });

    it('"a/.x/b" should match "**/.x/**"', () => {
      assert(isMatch('a/.x/b', '**/.x/**', { bash: true }));
    });

    it('"a/.x/b/.x/c" should not match "**/.x/**"', () => {
      assert(!isMatch('a/.x/b/.x/c', '**/.x/**', { bash: true }));
    });

    it('".bashrc" should not match "?bashrc"', () => {
      assert(!isMatch('.bashrc', '?bashrc', { bash: true }));
    });

    it('should match trailing slashes with stars', () => {
      assert(isMatch('.bar.baz/', '.*.*', { bash: true }));
    });

    it('".bar.baz/" should match ".*.*/"', () => {
      assert(isMatch('.bar.baz/', '.*.*/', { bash: true }));
    });

    it('".bar.baz" should match ".*.*"', () => {
      assert(isMatch('.bar.baz', '.*.*', { bash: true }));
    });
  });

  describe('glob', () => {
    it('"a/b/.x" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x', '**/.x/**', { bash: true }));
    });

    it('".x" should match "**/.x/**"', () => {
      assert(isMatch('.x', '**/.x/**', { bash: true }));
    });

    it('".x/" should match "**/.x/**"', () => {
      assert(isMatch('.x/', '**/.x/**', { bash: true }));
    });

    it('".x/a" should match "**/.x/**"', () => {
      assert(isMatch('.x/a', '**/.x/**', { bash: true }));
    });

    it('".x/a/b" should match "**/.x/**"', () => {
      assert(isMatch('.x/a/b', '**/.x/**', { bash: true }));
    });

    it('".x/.x" should match "**/.x/**"', () => {
      assert(isMatch('.x/.x', '**/.x/**', { bash: true }));
    });

    it('"a/.x" should match "**/.x/**"', () => {
      assert(isMatch('a/.x', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c/d" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c/d', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/c/d/e" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/c/d/e', '**/.x/**', { bash: true }));
    });

    it('"a/b/.x/" should match "**/.x/**"', () => {
      assert(isMatch('a/b/.x/', '**/.x/**', { bash: true }));
    });

    it('"a/.x/b" should match "**/.x/**"', () => {
      assert(isMatch('a/.x/b', '**/.x/**', { bash: true }));
    });

    it('"a/.x/b/.x/c" should not match "**/.x/**"', () => {
      assert(!isMatch('a/.x/b/.x/c', '**/.x/**', { bash: true }));
    });

    it('"a/c/b" should match "a/*/b"', () => {
      assert(isMatch('a/c/b', 'a/*/b', { bash: true }));
    });

    it('"a/.d/b" should not match "a/*/b"', () => {
      assert(!isMatch('a/.d/b', 'a/*/b', { bash: true }));
    });

    it('"a/./b" should not match "a/*/b"', () => {
      assert(!isMatch('a/./b', 'a/*/b', { bash: true }));
    });

    it('"a/../b" should not match "a/*/b"', () => {
      assert(!isMatch('a/../b', 'a/*/b', { bash: true }));
    });

    it('"ab" should match "ab**"', () => {
      assert(isMatch('ab', 'ab**', { bash: true }));
    });

    it('"abcdef" should match "ab**"', () => {
      assert(isMatch('abcdef', 'ab**', { bash: true }));
    });

    it('"abef" should match "ab**"', () => {
      assert(isMatch('abef', 'ab**', { bash: true }));
    });

    it('"abcfef" should match "ab**"', () => {
      assert(isMatch('abcfef', 'ab**', { bash: true }));
    });

    it('"ab" should not match "ab***ef"', () => {
      assert(!isMatch('ab', 'ab***ef', { bash: true }));
    });

    it('"abcdef" should match "ab***ef"', () => {
      assert(isMatch('abcdef', 'ab***ef', { bash: true }));
    });

    it('"abef" should match "ab***ef"', () => {
      assert(isMatch('abef', 'ab***ef', { bash: true }));
    });

    it('"abcfef" should match "ab***ef"', () => {
      assert(isMatch('abcfef', 'ab***ef', { bash: true }));
    });

    it('".bashrc" should not match "?bashrc"', () => {
      assert(!isMatch('.bashrc', '?bashrc', { bash: true }));
    });

    it('"abbc" should not match "ab?bc"', () => {
      assert(!isMatch('abbc', 'ab?bc', { bash: true }));
    });

    it('"abc" should not match "ab?bc"', () => {
      assert(!isMatch('abc', 'ab?bc', { bash: true }));
    });

    it('"a.a" should match "[a-d]*.[a-b]"', () => {
      assert(isMatch('a.a', '[a-d]*.[a-b]', { bash: true }));
    });

    it('"a.b" should match "[a-d]*.[a-b]"', () => {
      assert(isMatch('a.b', '[a-d]*.[a-b]', { bash: true }));
    });

    it('"c.a" should match "[a-d]*.[a-b]"', () => {
      assert(isMatch('c.a', '[a-d]*.[a-b]', { bash: true }));
    });

    it('"a.a.a" should match "[a-d]*.[a-b]"', () => {
      assert(isMatch('a.a.a', '[a-d]*.[a-b]', { bash: true }));
    });

    it('"a.a.a" should match "[a-d]*.[a-b]*.[a-b]"', () => {
      assert(isMatch('a.a.a', '[a-d]*.[a-b]*.[a-b]', { bash: true }));
    });

    it('"a.a" should match "*.[a-b]"', () => {
      assert(isMatch('a.a', '*.[a-b]', { bash: true }));
    });

    it('"a.b" should match "*.[a-b]"', () => {
      assert(isMatch('a.b', '*.[a-b]', { bash: true }));
    });

    it('"a.a.a" should match "*.[a-b]"', () => {
      assert(isMatch('a.a.a', '*.[a-b]', { bash: true }));
    });

    it('"c.a" should match "*.[a-b]"', () => {
      assert(isMatch('c.a', '*.[a-b]', { bash: true }));
    });

    it('"d.a.d" should not match "*.[a-b]"', () => {
      assert(!isMatch('d.a.d', '*.[a-b]', { bash: true }));
    });

    it('"a.bb" should not match "*.[a-b]"', () => {
      assert(!isMatch('a.bb', '*.[a-b]', { bash: true }));
    });

    it('"a.ccc" should not match "*.[a-b]"', () => {
      assert(!isMatch('a.ccc', '*.[a-b]', { bash: true }));
    });

    it('"c.ccc" should not match "*.[a-b]"', () => {
      assert(!isMatch('c.ccc', '*.[a-b]', { bash: true }));
    });

    it('"a.a" should match "*.[a-b]*"', () => {
      assert(isMatch('a.a', '*.[a-b]*', { bash: true }));
    });

    it('"a.b" should match "*.[a-b]*"', () => {
      assert(isMatch('a.b', '*.[a-b]*', { bash: true }));
    });

    it('"a.a.a" should match "*.[a-b]*"', () => {
      assert(isMatch('a.a.a', '*.[a-b]*', { bash: true }));
    });

    it('"c.a" should match "*.[a-b]*"', () => {
      assert(isMatch('c.a', '*.[a-b]*', { bash: true }));
    });

    it('"d.a.d" should match "*.[a-b]*"', () => {
      assert(isMatch('d.a.d', '*.[a-b]*', { bash: true }));
    });

    it('"d.a.d" should not match "*.[a-b]*.[a-b]*"', () => {
      assert(!isMatch('d.a.d', '*.[a-b]*.[a-b]*', { bash: true }));
    });

    it('"d.a.d" should match "*.[a-d]*.[a-d]*"', () => {
      assert(isMatch('d.a.d', '*.[a-d]*.[a-d]*', { bash: true }));
    });

    it('"a.bb" should match "*.[a-b]*"', () => {
      assert(isMatch('a.bb', '*.[a-b]*', { bash: true }));
    });

    it('"a.ccc" should not match "*.[a-b]*"', () => {
      assert(!isMatch('a.ccc', '*.[a-b]*', { bash: true }));
    });

    it('"c.ccc" should not match "*.[a-b]*"', () => {
      assert(!isMatch('c.ccc', '*.[a-b]*', { bash: true }));
    });

    it('"a.a" should match "*[a-b].[a-b]*"', () => {
      assert(isMatch('a.a', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"a.b" should match "*[a-b].[a-b]*"', () => {
      assert(isMatch('a.b', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"a.a.a" should match "*[a-b].[a-b]*"', () => {
      assert(isMatch('a.a.a', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"c.a" should not match "*[a-b].[a-b]*"', () => {
      assert(!isMatch('c.a', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"d.a.d" should not match "*[a-b].[a-b]*"', () => {
      assert(!isMatch('d.a.d', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"a.bb" should match "*[a-b].[a-b]*"', () => {
      assert(isMatch('a.bb', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"a.ccc" should not match "*[a-b].[a-b]*"', () => {
      assert(!isMatch('a.ccc', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"c.ccc" should not match "*[a-b].[a-b]*"', () => {
      assert(!isMatch('c.ccc', '*[a-b].[a-b]*', { bash: true }));
    });

    it('"abd" should match "[a-y]*[^c]"', () => {
      assert(isMatch('abd', '[a-y]*[^c]', { bash: true }));
    });

    it('"abe" should match "[a-y]*[^c]"', () => {
      assert(isMatch('abe', '[a-y]*[^c]', { bash: true }));
    });

    it('"bb" should match "[a-y]*[^c]"', () => {
      assert(isMatch('bb', '[a-y]*[^c]', { bash: true }));
    });

    it('"bcd" should match "[a-y]*[^c]"', () => {
      assert(isMatch('bcd', '[a-y]*[^c]', { bash: true }));
    });

    it('"ca" should match "[a-y]*[^c]"', () => {
      assert(isMatch('ca', '[a-y]*[^c]', { bash: true }));
    });

    it('"cb" should match "[a-y]*[^c]"', () => {
      assert(isMatch('cb', '[a-y]*[^c]', { bash: true }));
    });

    it('"dd" should match "[a-y]*[^c]"', () => {
      assert(isMatch('dd', '[a-y]*[^c]', { bash: true }));
    });

    it('"de" should match "[a-y]*[^c]"', () => {
      assert(isMatch('de', '[a-y]*[^c]', { bash: true }));
    });

    it('"bdir/" should match "[a-y]*[^c]"', () => {
      assert(isMatch('bdir/', '[a-y]*[^c]', { bash: true }));
    });

    it('"abd" should match "**/*"', () => {
      assert(isMatch('abd', '**/*', { bash: true }));
    });
  });

  describe('globstar', () => {
    it('"a.js" should match "**/*.js"', () => {
      assert(isMatch('a.js', '**/*.js', { bash: true }));
    });

    it('"a/a.js" should match "**/*.js"', () => {
      assert(isMatch('a/a.js', '**/*.js', { bash: true }));
    });

    it('"a/a/b.js" should match "**/*.js"', () => {
      assert(isMatch('a/a/b.js', '**/*.js', { bash: true }));
    });

    it('"a/b/z.js" should match "a/b/**/*.js"', () => {
      assert(isMatch('a/b/z.js', 'a/b/**/*.js', { bash: true }));
    });

    it('"a/b/c/z.js" should match "a/b/**/*.js"', () => {
      assert(isMatch('a/b/c/z.js', 'a/b/**/*.js', { bash: true }));
    });

    it('"foo.md" should match "**/*.md"', () => {
      assert(isMatch('foo.md', '**/*.md', { bash: true }));
    });

    it('"foo/bar.md" should match "**/*.md"', () => {
      assert(isMatch('foo/bar.md', '**/*.md', { bash: true }));
    });

    it('"foo/bar" should match "foo/**/bar"', () => {
      assert(isMatch('foo/bar', 'foo/**/bar', { bash: true }));
    });

    it('"foo/bar" should match "foo/**bar"', () => {
      assert(isMatch('foo/bar', 'foo/**bar', { bash: true }));
    });

    it('"ab/a/d" should match "**/*"', () => {
      assert(isMatch('ab/a/d', '**/*', { bash: true }));
    });

    it('"ab/b" should match "**/*"', () => {
      assert(isMatch('ab/b', '**/*', { bash: true }));
    });

    it('"a/b/c/d/a.js" should match "**/*"', () => {
      assert(isMatch('a/b/c/d/a.js', '**/*', { bash: true }));
    });

    it('"a/b/c.js" should match "**/*"', () => {
      assert(isMatch('a/b/c.js', '**/*', { bash: true }));
    });

    it('"a/b/c.txt" should match "**/*"', () => {
      assert(isMatch('a/b/c.txt', '**/*', { bash: true }));
    });

    it('"a/b/.js/c.txt" should match "**/*"', () => {
      assert(isMatch('a/b/.js/c.txt', '**/*', { bash: true }));
    });

    it('"a.js" should match "**/*"', () => {
      assert(isMatch('a.js', '**/*', { bash: true }));
    });

    it('"za.js" should match "**/*"', () => {
      assert(isMatch('za.js', '**/*', { bash: true }));
    });

    it('"ab" should match "**/*"', () => {
      assert(isMatch('ab', '**/*', { bash: true }));
    });

    it('"a.b" should match "**/*"', () => {
      assert(isMatch('a.b', '**/*', { bash: true }));
    });

    it('"foo/" should match "foo/**/"', () => {
      assert(isMatch('foo/', 'foo/**/', { bash: true }));
    });

    it('"foo/bar" should not match "foo/**/"', () => {
      assert(!isMatch('foo/bar', 'foo/**/', { bash: true }));
    });

    it('"foo/bazbar" should not match "foo/**/"', () => {
      assert(!isMatch('foo/bazbar', 'foo/**/', { bash: true }));
    });

    it('"foo/barbar" should not match "foo/**/"', () => {
      assert(!isMatch('foo/barbar', 'foo/**/', { bash: true }));
    });

    it('"foo/bar/baz/qux" should not match "foo/**/"', () => {
      assert(!isMatch('foo/bar/baz/qux', 'foo/**/', { bash: true }));
    });

    it('"foo/bar/baz/qux/" should match "foo/**/"', () => {
      assert(isMatch('foo/bar/baz/qux/', 'foo/**/', { bash: true }));
    });
  });
});
