'use strict';

require('mocha');
var assert = require('assert');
var mm = require('./support/match');

/**
 * Heads up! In these tests, `mm` is a custom function that can
 * be either `micromatch` or `minimatch` if the `--mm` flag is passed
 */

// from the Bash 4.3 specification/unit tests
var fixtures = ['*', '\\*', 'a', 'abc', 'abd', 'abe', 'b', 'bb', 'bcd', 'bdir/', 'Beware', 'c', 'ca', 'cb', 'd', 'dd', 'de'];

describe('bash options and features:', function() {
  describe('failglob:', function() {
    it('should throw an error when no matches are found:', function() {
      assert.throws(function() {
        require('..').match(fixtures, '\\^', {failglob: true});
      }, /no matches found for/);
    });
  });

  // $echo a/{1..3}/b
  describe('bash', function() {
    it('should handle "regular globbing":', function() {
      mm(fixtures, 'a*', ['a', 'abc', 'abd', 'abe']);
      mm(fixtures, '\\a*', ['a', 'abc', 'abd', 'abe']);
    });

    it('should match directories:', function() {
      mm(fixtures, 'b*/', ['bdir/']);
    });

    it('should use quoted characters as literals:', function() {
      mm(fixtures, '\\*', {nonull: true}, ['*', '\\*']);
      mm(fixtures, '\\*', {nonull: true, unescape: true}, ['*']);
      mm(fixtures, '\\*', {nonull: true, unescape: true, unixify: false}, ['*', '\\*']);

      mm(fixtures, '\\^', {nonull: true}, ['\\^']);
      mm(fixtures, '\\^', []);

      mm(fixtures, 'a\\*', {nonull: true}, ['a\\*']);
      mm(fixtures, 'a\\*', ['a*'], {nonull: true, unescape: true});
      mm(fixtures, 'a\\*', []);

      mm(fixtures, ['a\\*', '\\*'], {nonull: true}, ['a\\*', '*', '\\*']);
      mm(fixtures, ['a\\*', '\\*'], {nonull: true, unescape: true}, ['a*', '*']);
      mm(fixtures, ['a\\*', '\\*'], {nonull: true, unescape: true, unixify: false}, ['a*', '*', '\\*']);
      mm(fixtures, ['a\\*', '\\*'], {unescape: true}, ['*']);
      mm(fixtures, ['a\\*', '\\*'], {unescape: true, unixify: false}, ['*', '\\*']);
      mm(fixtures, ['a\\*', '\\*'], ['*', '\\*']);

      mm(fixtures, ['a\\*'], {nonull: true}, ['a\\*']);
      mm(fixtures, ['a\\*'], []);

      mm(fixtures, ['c*', 'a\\*', '*q*'], {nonull: true}, ['c', 'ca', 'cb', 'a\\*', '*q*']);
      mm(fixtures, ['c*', 'a\\*', '*q*'], ['c', 'ca', 'cb']);

      mm(fixtures, '"*"*', {nonull: true}, ['"*"*']);
      mm(fixtures, '"*"*', []);

      mm(fixtures, '\\**', ['*']); // `*` is in the fixtures array
    });

    it('should work for escaped paths/dots:', function() {
      mm(fixtures, '"\\.\\./*/"', {nonull: true}, ['"\\.\\./*/"']);
      mm(fixtures, '"\\.\\./*/"', {nonull: true, unescape: true}, ['"../*/"']);
      mm(fixtures, 's/\\..*//', {nonull: true}, ['s/\\..*//']);
    });

    it('Pattern from Larry Wall\'s Configure that caused bash to blow up:', function() {
      mm(fixtures, '"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"', {nonull: true}, ['"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"']);
      mm(fixtures, '[a-c]b*', ['abc', 'abd', 'abe', 'bb', 'cb']);
    });

    it('should support character classes', function() {
      var f = fixtures.slice();
      f.push('baz', 'bzz', 'BZZ', 'beware', 'BewAre');
      mm(f, 'a*[^c]', ['abd', 'abe']);
      mm(['a-b', 'aXb'], 'a[X-]b', ['a-b', 'aXb']);
      mm(f, '[a-y]*[^c]', ['*', 'a', 'b', 'd', 'abd', 'abe', 'baz', 'beware', 'bb', 'bcd', 'ca', 'cb', 'dd', 'de', 'bdir/']);
      mm(f, '[a-y]*[^c]', {bash: true}, ['abd', 'abe', 'baz', 'beware', 'bzz', 'bb', 'bcd', 'ca', 'cb', 'dd', 'de', 'bdir/']);
      mm(f, '[^a-c]*', ['d', 'dd', 'de', 'BewAre', 'BZZ', '*', '\\*']);
      mm(['a*b/ooo'], 'a\\*b/*', ['a*b/ooo']);
      mm(['a*b/ooo'], 'a\\*?/*', ['a*b/ooo']);
      mm(f, 'a[b]c', ['abc']);
      mm(f, 'a["b"]c', ['abc']);
      mm(f, 'a[\\\\b]c', ['abc']);
      mm(f, 'a[\\b]c', []);
      mm(f, 'a[b-d]c', ['abc']);
      mm(f, 'a?c', ['abc']);
      mm(['a-b'], 'a[]-]b', ['a-b']);
      mm(['man/man1/bash.1'], '*/man*/bash.*', ['man/man1/bash.1']);
    });

    it('should support basic wildmatch (brackets) features', function() {
      assert(!mm.isMatch('aab', 'a[]-]b'));
      assert(!mm.isMatch('ten', '[ten]'));
      assert(!mm.isMatch('ten', 't[!a-g]n'));
      assert(mm.isMatch(']', ']'));
      assert(mm.isMatch('a-b', 'a[]-]b'));
      assert(mm.isMatch('a]b', 'a[]-]b'));
      assert(mm.isMatch('a]b', 'a[]]b'));
      assert(mm.isMatch('aab', 'a[\\]a\\-]b'));
      assert(mm.isMatch('ten', 't[a-g]n'));
      assert(mm.isMatch('ton', 't[!a-g]n'));
      assert(mm.isMatch('ton', 't[^a-g]n'));
    });

    it('should support Extended slash-matching features', function() {
      assert(!mm.isMatch('foo/bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
      assert(mm.isMatch('foo/bar', 'foo[/]bar'));
      assert(mm.isMatch('foo-bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
    });

    it('should match braces', function() {
      assert(mm.isMatch('foo{}baz', 'foo[{a,b}]+baz'));
    });

    it('should match parens', function() {
      assert(mm.isMatch('foo(bar)baz', 'foo[bar()]+baz'));
    });

    it('should match escaped characters', function() {
      assert(!mm.isMatch('', '\\'));
      assert(!mm.isMatch('XXX/\\', '[A-Z]+/\\'));
      assert(mm.isMatch('\\', '\\'));
      assert(mm.isMatch('XXX/\\', '[A-Z]+/\\\\'));
      assert(mm.isMatch('[ab]', '\\[ab]'));
      assert(mm.isMatch('[ab]', '[\\[:]ab]'));
    });

    it('should match brackets', function() {
      assert(!mm.isMatch(']', '[!]-]'));
      assert(mm.isMatch('a', '[!]-]'));
      assert(mm.isMatch('[ab]', '[[]ab]'));
    });

    it('tests with multiple `*\'s:', function() {
      mm(['bbc', 'abc', 'bbd'], 'a**c', ['abc']);
      mm(['bbc', 'abc', 'bbd'], 'a***c', ['abc']);
      mm(['bbc', 'abc', 'bbc'], 'a*****?c', ['abc']);
      mm(['bbc', 'abc'], '?*****??', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '*****??', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '?*****?c', ['bbc', 'abc']);
      mm(['bbc', 'abc', 'bbd'], '?***?****c', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '?***?****?', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '?***?****', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '*******c', ['bbc', 'abc']);
      mm(['bbc', 'abc'], '*******?', ['bbc', 'abc']);
      mm(['abcdecdhjk'], 'a*cd**?**??k', ['abcdecdhjk']);
      mm(['abcdecdhjk'], 'a**?**cd**?**??k', ['abcdecdhjk']);
      mm(['abcdecdhjk'], 'a**?**cd**?**??k***', ['abcdecdhjk']);
      mm(['abcdecdhjk'], 'a**?**cd**?**??***k', ['abcdecdhjk']);
      mm(['abcdecdhjk'], 'a**?**cd**?**??***k**', ['abcdecdhjk']);
      mm(['abcdecdhjk'], 'a****c**?**??*****', ['abcdecdhjk']);
    });

    it('none of these should output anything:', function() {
      mm(['abc'], '??**********?****?', []);
      mm(['abc'], '??**********?****c', []);
      mm(['abc'], '?************c****?****', []);
      mm(['abc'], '*c*?**', []);
      mm(['abc'], 'a*****c*?**', []);
      mm(['abc'], 'a********???*******', []);
      mm(['a'], '[]', []);
      mm(['['], '[abc', []);
    });
  });

  describe('wildmat', function() {
    it('Basic wildmat features', function() {
      assert(!mm.isMatch('foo', '*f'));
      assert(!mm.isMatch('foo', '??'));
      assert(!mm.isMatch('foo', 'bar'));
      assert(!mm.isMatch('foobar', 'foo\\*bar'));
      assert(mm.isMatch('', ''));
      assert(mm.isMatch('?a?b', '\\??\\?b'));
      assert(mm.isMatch('aaaaaaabababab', '*ab'));
      assert(mm.isMatch('f\\oo', 'f\\oo'));
      assert(mm.isMatch('foo', '*'));
      assert(mm.isMatch('foo', '*foo*'));
      assert(mm.isMatch('foo', '???'));
      assert(mm.isMatch('foo', 'f*'));
      assert(mm.isMatch('foo', 'foo'));
      assert(mm.isMatch('foo*', 'foo\\*', {unixify: false}));
      assert(mm.isMatch('foobar', '*ob*a*r*'));
    });

    it('should support recursion', function() {
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
      assert(mm.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', {unixify: false}));
    });
  });
});
