'use strict';

require('mocha');
const version = process.version;
const assert = require('assert');
const mm = require('..');

describe('regex features', () => {

  describe('back-references', () => {
    it('should support regex backreferences', () => {
      assert(!mm.isMatch('1/2', '(*)/\\1'));
      assert(mm.isMatch('1/1', '(*)/\\1'));
      assert(mm.isMatch('1/1/1/1', '(*)/\\1/\\1/\\1'));
      assert(!mm.isMatch('1/11/111/1111', '(*)/\\1/\\1/\\1'));
      assert(mm.isMatch('1/11/111/1111', '(*)/(\\1)+/(\\1)+/(\\1)+'));
      assert(!mm.isMatch('1/2/1/1', '(*)/\\1/\\1/\\1'));
      assert(!mm.isMatch('1/1/2/1', '(*)/\\1/\\1/\\1'));
      assert(!mm.isMatch('1/1/1/2', '(*)/\\1/\\1/\\1'));
      assert(mm.isMatch('1/1/1/1', '(*)/\\1/(*)/\\2'));
      assert(!mm.isMatch('1/1/2/1', '(*)/\\1/(*)/\\2'));
      assert(!mm.isMatch('1/1/2/1', '(*)/\\1/(*)/\\2'));
      assert(mm.isMatch('1/1/2/2', '(*)/\\1/(*)/\\2'));
    });
  });

  describe('character classes', () => {
    it('should match regex character classes', () => {
      assert(!mm.isMatch('foo/bar', '**/[jkl]*'));
      assert(mm.isMatch('foo/jar', '**/[jkl]*'));

      assert(mm.isMatch('foo/bar', '**/[^jkl]*'));
      assert(!mm.isMatch('foo/jar', '**/[^jkl]*'));

      assert(mm.isMatch('foo/bar', '**/[abc]*'));
      assert(!mm.isMatch('foo/jar', '**/[abc]*'));

      assert(!mm.isMatch('foo/bar', '**/[^abc]*'));
      assert(mm.isMatch('foo/jar', '**/[^abc]*'));

      assert(mm.isMatch('foo/bar', '**/[abc]ar'));
      assert(!mm.isMatch('foo/jar', '**/[abc]ar'));
    });

    it('should support valid regex ranges', () => {
      assert(!mm.isMatch('a/a', 'a/[b-c]'));
      assert(!mm.isMatch('a/z', 'a/[b-c]'));
      assert(mm.isMatch('a/b', 'a/[b-c]'));
      assert(mm.isMatch('a/c', 'a/[b-c]'));
      assert(mm.isMatch('a/b', '[a-z]/[a-z]'));
      assert(mm.isMatch('a/z', '[a-z]/[a-z]'));
      assert(mm.isMatch('z/z', '[a-z]/[a-z]'));
      assert(!mm.isMatch('a/x/y', 'a/[a-z]'));

      assert(mm.isMatch('a.a', '[a-b].[a-b]'));
      assert(mm.isMatch('a.b', '[a-b].[a-b]'));
      assert(!mm.isMatch('a.a.a', '[a-b].[a-b]'));
      assert(!mm.isMatch('c.a', '[a-b].[a-b]'));
      assert(!mm.isMatch('d.a.d', '[a-b].[a-b]'));
      assert(!mm.isMatch('a.bb', '[a-b].[a-b]'));
      assert(!mm.isMatch('a.ccc', '[a-b].[a-b]'));

      assert(mm.isMatch('a.a', '[a-d].[a-b]'));
      assert(mm.isMatch('a.b', '[a-d].[a-b]'));
      assert(!mm.isMatch('a.a.a', '[a-d].[a-b]'));
      assert(mm.isMatch('c.a', '[a-d].[a-b]'));
      assert(!mm.isMatch('d.a.d', '[a-d].[a-b]'));
      assert(!mm.isMatch('a.bb', '[a-d].[a-b]'));
      assert(!mm.isMatch('a.ccc', '[a-d].[a-b]'));

      assert(mm.isMatch('a.a', '[a-d]*.[a-b]'));
      assert(mm.isMatch('a.b', '[a-d]*.[a-b]'));
      assert(mm.isMatch('a.a.a', '[a-d]*.[a-b]'));
      assert(mm.isMatch('c.a', '[a-d]*.[a-b]'));
      assert(!mm.isMatch('d.a.d', '[a-d]*.[a-b]'));
      assert(!mm.isMatch('a.bb', '[a-d]*.[a-b]'));
      assert(!mm.isMatch('a.ccc', '[a-d]*.[a-b]'));
    });

    it('should support valid regex ranges with glob negation patterns', () => {
      assert(!mm.isMatch('a.a', '!*.[a-b]'));
      assert(!mm.isMatch('a.b', '!*.[a-b]'));
      assert(!mm.isMatch('a.a.a', '!*.[a-b]'));
      assert(!mm.isMatch('c.a', '!*.[a-b]'));
      assert(mm.isMatch('d.a.d', '!*.[a-b]'));
      assert(mm.isMatch('a.bb', '!*.[a-b]'));
      assert(mm.isMatch('a.ccc', '!*.[a-b]'));

      assert(!mm.isMatch('a.a', '!*.[a-b]*'));
      assert(!mm.isMatch('a.b', '!*.[a-b]*'));
      assert(!mm.isMatch('a.a.a', '!*.[a-b]*'));
      assert(!mm.isMatch('c.a', '!*.[a-b]*'));
      assert(!mm.isMatch('d.a.d', '!*.[a-b]*'));
      assert(!mm.isMatch('a.bb', '!*.[a-b]*'));
      assert(mm.isMatch('a.ccc', '!*.[a-b]*'));

      assert(!mm.isMatch('a.a', '![a-b].[a-b]'));
      assert(!mm.isMatch('a.b', '![a-b].[a-b]'));
      assert(mm.isMatch('a.a.a', '![a-b].[a-b]'));
      assert(mm.isMatch('c.a', '![a-b].[a-b]'));
      assert(mm.isMatch('d.a.d', '![a-b].[a-b]'));
      assert(mm.isMatch('a.bb', '![a-b].[a-b]'));
      assert(mm.isMatch('a.ccc', '![a-b].[a-b]'));

      assert(!mm.isMatch('a.a', '![a-b]+.[a-b]+'));
      assert(!mm.isMatch('a.b', '![a-b]+.[a-b]+'));
      assert(mm.isMatch('a.a.a', '![a-b]+.[a-b]+'));
      assert(mm.isMatch('c.a', '![a-b]+.[a-b]+'));
      assert(mm.isMatch('d.a.d', '![a-b]+.[a-b]+'));
      assert(!mm.isMatch('a.bb', '![a-b]+.[a-b]+'));
      assert(mm.isMatch('a.ccc', '![a-b]+.[a-b]+'));
    });

    it('should support valid regex ranges in negated character classes', () => {
      assert(!mm.isMatch('a.a', '*.[^a-b]'));
      assert(!mm.isMatch('a.b', '*.[^a-b]'));
      assert(!mm.isMatch('a.a.a', '*.[^a-b]'));
      assert(!mm.isMatch('c.a', '*.[^a-b]'));
      assert(mm.isMatch('d.a.d', '*.[^a-b]'));
      assert(!mm.isMatch('a.bb', '*.[^a-b]'));
      assert(!mm.isMatch('a.ccc', '*.[^a-b]'));

      assert(!mm.isMatch('a.a', 'a.[^a-b]*'));
      assert(!mm.isMatch('a.b', 'a.[^a-b]*'));
      assert(!mm.isMatch('a.a.a', 'a.[^a-b]*'));
      assert(!mm.isMatch('c.a', 'a.[^a-b]*'));
      assert(!mm.isMatch('d.a.d', 'a.[^a-b]*'));
      assert(!mm.isMatch('a.bb', 'a.[^a-b]*'));
      assert(mm.isMatch('a.ccc', 'a.[^a-b]*'));
    });
  });

  describe('capture groups', () => {
    it('should support regex capture groups', () => {
      assert(mm.isMatch('a/bb/c/dd/e.md', 'a/??/?/(dd)/e.md'));
      assert(mm.isMatch('a/b/c/d/e.md', 'a/?/c/?/(e|f).md'));
      assert(mm.isMatch('a/b/c/d/f.md', 'a/?/c/?/(e|f).md'));
    });

    it('should support regex capture groups with slashes', () => {
      assert(!mm.isMatch('a/a', '(a/b)'));
      assert(mm.isMatch('a/b', '(a/b)'));
      assert(!mm.isMatch('a/c', '(a/b)'));
      assert(!mm.isMatch('b/a', '(a/b)'));
      assert(!mm.isMatch('b/b', '(a/b)'));
      assert(!mm.isMatch('b/c', '(a/b)'));
    });

    it('should support regex non-capture groups', () => {
      assert(mm.isMatch('a/bb/c/dd/e.md', 'a/**/(?:dd)/e.md'));
      assert(mm.isMatch('a/b/c/d/e.md', 'a/?/c/?/(?:e|f).md'));
      assert(mm.isMatch('a/b/c/d/f.md', 'a/?/c/?/(?:e|f).md'));
    });
  });

  describe('lookarounds', () => {
    it('should support regex lookbehinds', () => {
      if (parseInt(version.slice(1), 10) >= 10) {
        assert(mm.isMatch('foo/cbaz', 'foo/*(?<!d)baz'));
        assert(!mm.isMatch('foo/cbaz', 'foo/*(?<!c)baz'));
        assert(!mm.isMatch('foo/cbaz', 'foo/*(?<=d)baz'));
        assert(mm.isMatch('foo/cbaz', 'foo/*(?<=c)baz'));
      }
    });

    it('should throw an error when regex lookbehinds are used on an unsupported node version', () => {
      Reflect.defineProperty(process, 'version', { value: 'v6.0.0' });
      assert.throws(() => mm.isMatch('foo/cbaz', 'foo/*(?<!c)baz'), /Node\.js v10 or higher/);
      Reflect.defineProperty(process, 'version', { value: version });
    });
  });
});
