'use strict';

require('mocha');
const path = require('path');
const assert = require('assert');
const mm = require('..');

const isWindows = () => process.platform === 'win32' || path.sep === '\\';
const format = str => str.replace(/\\/g, '/').replace(/^\.\//, '');

// from the Bash 4.3 specification/unit tests
const fixtures = ['\\\\', '*', '**', '\\*', 'a', 'a/*', 'abc', 'abd', 'abe', 'b', 'bb', 'bcd', 'bdir/', 'Beware', 'c', 'ca', 'cb', 'd', 'dd', 'de'];

describe('bash options and features:', () => {
  // $echo a/{1..3}/b
  describe('bash', () => {
    it('should handle "regular globbing":', () => {
      assert.deepEqual(mm(fixtures, 'a*'), ['a', 'abc', 'abd', 'abe']);
      assert.deepEqual(mm(fixtures, '\\a*'), ['a', 'abc', 'abd', 'abe']);
    });

    it('should match directories:', () => {
      assert.deepEqual(mm(fixtures, 'b*/'), ['bdir/']);
    });

    it('should use quoted characters as literals:', () => {
      assert.deepEqual(mm(fixtures, '\\*', { windows: false }), ['*', '\\*']);
      assert.deepEqual(mm(fixtures, '\\^', { windows: false }), []);
      assert.deepEqual(mm(fixtures, 'a\\*', { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['a\\*', '\\*'], { windows: false }), ['*', '\\*']);
      assert.deepEqual(mm(fixtures, ['a\\*'], { windows: false }), []);
      assert.deepEqual(mm(fixtures, ['c*', 'a\\*', '*q*'], { windows: false }), ['c', 'ca', 'cb']);
    });

    it('should support quoted characters', () => {
      assert.deepEqual(mm(['***'], '"***"'), ['***']);
      assert.deepEqual(mm(['"***"'], '"***"'), ['"***"']);
      assert.deepEqual(mm(['*', '**', '*foo', 'bar'], '"*"*'), ['*', '**', '*foo']);
    });

    it('should respect escaped characters', () => {
      assert.deepEqual(mm(fixtures, '\\**', { windows: false }), ['*', '**']);
    });

    it('should respect escaped paths/dots:', () => {
      let format = str => str.replace(/\\/g, '');
      assert.deepEqual(mm(['"\\.\\./*/"'], '"\\.\\./*/"', { windows: false }), ['"\\.\\./*/"']);
      assert.deepEqual(mm(['"\\.\\./*/"'], '"\\.\\./*/"', { format, windows: false }), ['"../*/"']);
      assert.deepEqual(mm(['s/\\..*//'], 's/\\..*//', { windows: false }), ['s/\\..*//']);
    });

    it("Pattern from Larry Wall's Configure that caused bash to blow up:", () => {
      assert.deepEqual(mm(['"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"'], '"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"', { windows: false }), ['"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"']);
      assert.deepEqual(mm(fixtures, '[a-c]b*'), ['abc', 'abd', 'abe', 'bb', 'cb']);
    });

    it('should support character classes', () => {
      let f = fixtures.slice();
      f.push('baz', 'bzz', 'BZZ', 'beware', 'BewAre');
      f.sort();

      assert.deepEqual(mm(f, 'a*[^c]'), ['abd', 'abe']);
      assert.deepEqual(mm(['a-b', 'aXb'], 'a[X-]b'), ['a-b', 'aXb']);
      assert.deepEqual(mm(f, '[a-y]*[^c]'), ['abd', 'abe', 'baz', 'bb', 'bcd', 'bdir/', 'beware', 'bzz', 'ca', 'cb', 'dd', 'de']);
      assert.deepEqual(mm(['a*b/ooo'], 'a\\*b/*'), ['a*b/ooo']);
      assert.deepEqual(mm(['a*b/ooo'], 'a\\*?/*'), ['a*b/ooo']);
      assert.deepEqual(mm(f, 'a[b]c'), ['abc']);
      assert.deepEqual(mm(f, 'a["b"]c'), ['abc']);
      assert.deepEqual(mm(f, 'a[\\\\b]c'), ['abc']); //<= backslash and a "b"
      assert.deepEqual(mm(f, 'a[\\b]c'), []); //<= word boundary in a character class
      assert.deepEqual(mm(f, 'a[b-d]c'), ['abc']);
      assert.deepEqual(mm(f, 'a?c'), ['abc']);
      assert.deepEqual(mm(['a-b'], 'a[]-]b'), ['a-b']);
      assert.deepEqual(mm(['man/man1/bash.1'], '*/man*/bash.*'), ['man/man1/bash.1']);

      if (isWindows()) {
        // should not match backslashes on windows, since backslashes are path
        // separators and negation character classes should not match path separators
        // unless it's explicitly defined in the character class
        assert.deepEqual(mm(f, '[^a-c]*'), ['d', 'dd', 'de', 'Beware', 'BewAre', 'BZZ', '*', '**', '\\*'].sort());
        assert.deepEqual(mm(f, '[^a-c]*', { bash: false }), ['d', 'dd', 'de', 'BewAre', 'Beware', 'BZZ', '*', '**', '\\*'].sort());
        assert.deepEqual(mm(f, '[^a-c]*', { nocase: true }), ['d', 'dd', 'de', '*', '**', '\\*'].sort());
      } else {
        assert.deepEqual(mm(f, '[^a-c]*'), ['*', '**', 'BZZ', 'BewAre', 'Beware', '\\*', 'd', 'dd', 'de', '\\\\'].sort());
        assert.deepEqual(mm(f, '[^a-c]*', { bash: false }), ['*', '**', 'BZZ', 'BewAre', 'Beware', '\\*', 'd', 'dd', 'de', '\\\\'].sort());
        assert.deepEqual(mm(f, '[^a-c]*', { nocase: true }), ['*', '**', '\\*', 'd', 'dd', 'de', '\\\\'].sort());
      }
    });

    it('should support basic wildmatch (brackets) features', () => {
      assert(!mm.isMatch('aab', 'a[]-]b'));
      assert(!mm.isMatch('ten', '[ten]'));
      assert(!mm.isMatch('ten', 't[!a-g]n', { posix: true }));
      assert(mm.isMatch(']', ']'));
      assert(mm.isMatch('a-b', 'a[]-]b'));
      assert(mm.isMatch('a]b', 'a[]-]b'));
      assert(mm.isMatch('a]b', 'a[]]b'));
      assert(mm.isMatch('aab', 'a[\\]a\\-]b'));
      assert(mm.isMatch('ten', 't[a-g]n'));
      assert(mm.isMatch('ton', 't[!a-g]n', { posix: true }));
      assert(mm.isMatch('ton', 't[^a-g]n'));
    });

    it('should support extended slash-matching features', () => {
      assert(!mm.isMatch('foo/bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
      assert(mm.isMatch('foo/bar', 'foo[/]bar'));
      assert(mm.isMatch('foo-bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
    });

    it('should match literal parens', () => {
      assert(mm.isMatch('foo(bar)baz', 'foo[bar()]+baz'));
    });

    it('should match escaped characters', () => {
      assert(!mm.isMatch('', '\\'));

      if (isWindows()) {
        assert(!mm.isMatch('XXX/\\', '[A-Z]+/\\'));
        assert(!mm.isMatch('XXX/\\', '[A-Z]+/\\\\'));
      } else {
        assert(mm.isMatch('XXX/\\', '[A-Z]+/\\'));
        assert(mm.isMatch('XXX/\\', '[A-Z]+/\\\\'));
      }

      assert(mm.isMatch('\\', '\\'));
      assert(mm.isMatch('[ab]', '\\[ab]'));
      assert(mm.isMatch('[ab]', '[\\[:]ab]'));
    });

    it('should match brackets', () => {
      assert(!mm.isMatch(']', '[^]-]'));
      assert(!mm.isMatch(']', '[!]-]'));
      assert(mm.isMatch('a', '[^]-]'));
      assert(mm.isMatch('a', '[!]-]', { posix: true }));
      assert(mm.isMatch('[ab]', '[[]ab]'));
    });

    it('should regard multiple consecutive stars as a single star', () => {
      assert.deepEqual(mm(['bbc', 'abc', 'bbd'], 'a**c'), ['abc']);
      assert.deepEqual(mm(['bbc', 'abc', 'bbd'], 'a***c'), ['abc']);
      assert.deepEqual(mm(['bbc', 'abc', 'bbc'], 'a*****?c'), ['abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '?*****??'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '*****??'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '?*****?c'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc', 'bbd'], '?***?****c'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '?***?****?'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '?***?****'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '*******c'), ['bbc', 'abc']);
      assert.deepEqual(mm(['bbc', 'abc'], '*******?'), ['bbc', 'abc']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a*cd**?**??k'), ['abcdecdhjk']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??k'), ['abcdecdhjk']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??k***'), ['abcdecdhjk']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??***k'), ['abcdecdhjk']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??***k**'), ['abcdecdhjk']);
      assert.deepEqual(mm(['abcdecdhjk'], 'a****c**?**??*****'), ['abcdecdhjk']);
    });

    it('none of these should output anything:', () => {
      assert.deepEqual(mm(['abc'], '??**********?****?'), []);
      assert.deepEqual(mm(['abc'], '??**********?****c'), []);
      assert.deepEqual(mm(['abc'], '?************c****?****'), []);
      assert.deepEqual(mm(['abc'], '*c*?**'), []);
      assert.deepEqual(mm(['abc'], 'a*****c*?**'), []);
      assert.deepEqual(mm(['abc'], 'a********???*******'), []);
      assert.deepEqual(mm(['a'], '[]'), []);
      assert.deepEqual(mm(['['], '[abc'), []);
    });
  });

  describe('wildmat', () => {
    it('Basic wildmat features', () => {
      assert(!mm.isMatch('foo', '*f'));
      assert(!mm.isMatch('foo', '??'));
      assert(!mm.isMatch('foo', 'bar'));
      assert(!mm.isMatch('foobar', 'foo\\*bar'));
      assert(mm.isMatch('?a?b', '\\??\\?b'));
      assert(mm.isMatch('aaaaaaabababab', '*ab'));
      assert(mm.isMatch('f\\oo', 'f\\oo'));
      assert(mm.isMatch('foo', '*'));
      assert(mm.isMatch('foo', '*foo*'));
      assert(mm.isMatch('foo', '???'));
      assert(mm.isMatch('foo', 'f*'));
      assert(mm.isMatch('foo', 'foo'));
      assert(mm.isMatch('foo*', 'foo\\*', { toPosixSlashes: false }));
      assert(mm.isMatch('foobar', '*ob*a*r*'));
    });

    it('should support recursion', () => {
      assert(!mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(!mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(!mm.isMatch('ab/cXd/efXg/hi', '*X*i'));
      assert(!mm.isMatch('ab/cXd/efXg/hi', '*Xg*i'));
      assert(!mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t'));
      assert(!mm.isMatch('foo', '*/*/*'));
      assert(!mm.isMatch('foo', 'fo'));
      assert(!mm.isMatch('foo/bar', '*/*/*'));
      assert(!mm.isMatch('foo/bar', 'foo?bar'));
      assert(!mm.isMatch('foo/bb/aa/rr', '*/*/*'));
      assert(!mm.isMatch('foo/bba/arr', 'foo*'));
      assert(!mm.isMatch('foo/bba/arr', 'foo**'));
      assert(!mm.isMatch('foo/bba/arr', 'foo/*'));
      assert(!mm.isMatch('foo/bba/arr', 'foo/**arr'));
      assert(!mm.isMatch('foo/bba/arr', 'foo/**z'));
      assert(!mm.isMatch('foo/bba/arr', 'foo/*arr'));
      assert(!mm.isMatch('foo/bba/arr', 'foo/*z'));
      assert(!mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*'));
      assert(mm.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(mm.isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i'));
      assert(mm.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
      assert(mm.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t'));
      assert(mm.isMatch('abcXdefXghi', '*X*i'));
      assert(mm.isMatch('foo', 'foo'));
      assert(mm.isMatch('foo/bar', 'foo/*'));
      assert(mm.isMatch('foo/bar', 'foo/bar'));
      assert(mm.isMatch('foo/bar', 'foo[/]bar'));
      assert(mm.isMatch('foo/bb/aa/rr', '**/**/**'));
      assert(mm.isMatch('foo/bba/arr', '*/*/*'));
      assert(mm.isMatch('foo/bba/arr', 'foo/**'));
      assert(mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', { toPosixSlashes: false }));
    });
  });
});
