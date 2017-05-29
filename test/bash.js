'use strict';

require('mocha');
var assert = require('assert');
var isWindows = require('is-windows');
var match = require('./support/match');
var mm = require('..');

// from the Bash 4.3 specification/unit tests
var fixtures = ['*', '**', '\\*', 'a', 'a/*', 'abc', 'abd', 'abe', 'b', 'bb', 'bcd', 'bdir/', 'Beware', 'c', 'ca', 'cb', 'd', 'dd', 'de'];

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
      match(fixtures, 'a*', ['a', 'abc', 'abd', 'abe']);
      match(fixtures, '\\a*', ['a', 'abc', 'abd', 'abe']);
    });

    it('should match directories:', function() {
      match(fixtures, 'b*/', ['bdir/']);
    });

    it('should use quoted characters as literals:', function() {
      if (isWindows()) {
        match(fixtures, '\\*', {nonull: true}, ['*', '/*']);
        match(fixtures, '\\*', {nonull: true, unescape: true}, ['*', '/*']);

        match(fixtures, '\\^', {nonull: true}, ['\\^']);
        match(fixtures, '\\^', []);

        match(fixtures, 'a\\*', {nonull: true}, ['a\\*']);
        match(fixtures, 'a\\*', ['a*'], {nonull: true, unescape: true});
        match(fixtures, 'a\\*', []);

        match(fixtures, ['a\\*', '\\*'], {nonull: true}, ['*', '/*', 'a\\*']);
        match(fixtures, ['a\\*', '\\*'], {nonull: true, unescape: true}, ['a*', '*', '/*']);
        match(fixtures, ['a\\*', '\\*'], {unescape: true}, ['*', '/*']);
        match(fixtures, ['a\\*', '\\*'], ['*', '/*']);

        match(fixtures, ['a\\*'], {nonull: true}, ['a\\*']);
        match(fixtures, ['a\\*'], []);

        match(fixtures, ['c*', 'a\\*', '*q*'], {nonull: true}, ['c', 'ca', 'cb', 'a\\*', '*q*']);
        match(fixtures, ['c*', 'a\\*', '*q*'], ['c', 'ca', 'cb']);
      } else {
        match(fixtures, '\\*', {nonull: true}, ['*', '\\*']);
        match(fixtures, '\\*', {nonull: true, unescape: true}, ['*']);
        match(fixtures, '\\*', {nonull: true, unescape: true, unixify: false}, ['*', '\\*']);

        match(fixtures, '\\^', {nonull: true}, ['\\^']);
        match(fixtures, '\\^', []);

        match(fixtures, 'a\\*', {nonull: true}, ['a\\*']);
        match(fixtures, 'a\\*', ['a*'], {nonull: true, unescape: true});
        match(fixtures, 'a\\*', []);

        match(fixtures, ['a\\*', '\\*'], {nonull: true}, ['a\\*', '*', '\\*']);
        match(fixtures, ['a\\*', '\\*'], {nonull: true, unescape: true}, ['a*', '*']);
        match(fixtures, ['a\\*', '\\*'], {nonull: true, unescape: true, unixify: false}, ['a*', '*', '\\*']);
        match(fixtures, ['a\\*', '\\*'], {unescape: true}, ['*']);
        match(fixtures, ['a\\*', '\\*'], {unescape: true, unixify: false}, ['*', '\\*']);
        match(fixtures, ['a\\*', '\\*'], ['*', '\\*']);

        match(fixtures, ['a\\*'], {nonull: true}, ['a\\*']);
        match(fixtures, ['a\\*'], []);

        match(fixtures, ['c*', 'a\\*', '*q*'], {nonull: true}, ['c', 'ca', 'cb', 'a\\*', '*q*']);
        match(fixtures, ['c*', 'a\\*', '*q*'], ['c', 'ca', 'cb']);
      }
    });

    it('should work for quoted characters', function() {
      match(fixtures, '"***"', []);
      match(fixtures, '"***"', {nonull: true}, ['"***"']);
      match(fixtures, '"*"*', ['*', '**']);
    });

    it('should work for escaped characters', function() {
      match(fixtures, '\\**', ['*', '**']);
    });

    it('should work for escaped paths/dots:', function() {
      match(fixtures, '"\\.\\./*/"', {nonull: true}, ['"\\.\\./*/"']);
      match(fixtures, '"\\.\\./*/"', {nonull: true, unescape: true}, ['"../*/"']);
      match(fixtures, 's/\\..*//', {nonull: true}, ['s/\\..*//']);
    });

    it('Pattern from Larry Wall\'s Configure that caused bash to blow up:', function() {
      match(fixtures, '"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"', {nonull: true}, ['"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"']);
      match(fixtures, '[a-c]b*', ['abc', 'abd', 'abe', 'bb', 'cb']);
    });

    it('should support character classes', function() {
      var f = fixtures.slice();
      f.push('baz', 'bzz', 'BZZ', 'beware', 'BewAre');

      match(f, 'a*[^c]', ['abd', 'abe']);
      match(['a-b', 'aXb'], 'a[X-]b', ['a-b', 'aXb']);
      match(f, '[a-y]*[^c]', ['abd', 'abe', 'baz', 'bzz', 'beware', 'bb', 'bcd', 'ca', 'cb', 'dd', 'de', 'bdir/']);
      match(['a*b/ooo'], 'a\\*b/*', ['a*b/ooo']);
      match(['a*b/ooo'], 'a\\*?/*', ['a*b/ooo']);
      match(f, 'a[b]c', ['abc']);
      match(f, 'a["b"]c', ['abc']);
      match(f, 'a[\\\\b]c', ['abc']); //<= backslash and a "b"
      match(f, 'a[\\b]c', []); //<= word boundary in a character class
      match(f, 'a[b-d]c', ['abc']);
      match(f, 'a?c', ['abc']);
      match(['a-b'], 'a[]-]b', ['a-b']);
      match(['man/man1/bash.1'], '*/man*/bash.*', ['man/man1/bash.1']);

      if (isWindows()) {
        // should not match backslashes on windows, since backslashes are path
        // separators and negation character classes should not match path separators
        // unless it's explicitly defined in the character class
        match(f, '[^a-c]*', ['d', 'dd', 'de', 'Beware', 'BewAre', 'BZZ', '*', '**']);
        match(f, '[^a-c]*', ['d', 'dd', 'de', 'BewAre', 'BZZ', '*', '**'], {bash: false});
        match(f, '[^a-c]*', ['d', 'dd', 'de', '*', '**'], {nocase: true});
      } else {
        match(f, '[^a-c]*', ['d', 'dd', 'de', 'Beware', 'BewAre', 'BZZ', '*', '**', '\\*']);
        match(f, '[^a-c]*', ['d', 'dd', 'de', 'BewAre', 'BZZ', '*', '**', '\\*'], {bash: false});
        match(f, '[^a-c]*', ['d', 'dd', 'de', '*', '**', '\\*'], {nocase: true});
      }
    });

    it('should support basic wildmatch (brackets) features', function() {
      assert(!match.isMatch('aab', 'a[]-]b'));
      assert(!match.isMatch('ten', '[ten]'));
      assert(!match.isMatch('ten', 't[!a-g]n'));
      assert(match.isMatch(']', ']'));
      assert(match.isMatch('a-b', 'a[]-]b'));
      assert(match.isMatch('a]b', 'a[]-]b'));
      assert(match.isMatch('a]b', 'a[]]b'));
      assert(match.isMatch('aab', 'a[\\]a\\-]b'));
      assert(match.isMatch('ten', 't[a-g]n'));
      assert(match.isMatch('ton', 't[!a-g]n'));
      assert(match.isMatch('ton', 't[^a-g]n'));
    });

    it('should support extended slash-matching features', function() {
      assert(!match.isMatch('foo/bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
      assert(match.isMatch('foo/bar', 'foo[/]bar'));
      assert(match.isMatch('foo-bar', 'f[^eiu][^eiu][^eiu][^eiu][^eiu]r'));
    });

    it('should not expand literal braces inside brackets', function() {
      assert.deepEqual(mm.makeRe('foo[{a,b}]+baz'), /^(?:foo[{a,b}]+baz)$/);
      assert(match.isMatch('foo{}baz', 'foo[{a,b}]+baz'));
    });

    it('should match literal parens', function() {
      assert(match.isMatch('foo(bar)baz', 'foo[bar()]+baz'));
    });

    it('should match escaped characters', function() {
      assert(!match.isMatch('', '\\'));
      assert(!match.isMatch('XXX/\\', '[A-Z]+/\\'));
      assert(match.isMatch('\\', '\\'));
      if (isWindows()) {
        assert(!match.isMatch('XXX/\\', '[A-Z]+/\\\\'));
      } else {
        assert(match.isMatch('XXX/\\', '[A-Z]+/\\\\'));
      }
      assert(match.isMatch('[ab]', '\\[ab]'));
      assert(match.isMatch('[ab]', '[\\[:]ab]'));
    });

    it('should match brackets', function() {
      assert(!match.isMatch(']', '[!]-]'));
      assert(match.isMatch('a', '[!]-]'));
      assert(match.isMatch('[ab]', '[[]ab]'));
    });

    it('should regard multiple consecutive stars as a single star', function() {
      match(['bbc', 'abc', 'bbd'], 'a**c', ['abc']);
      match(['bbc', 'abc', 'bbd'], 'a***c', ['abc']);
      match(['bbc', 'abc', 'bbc'], 'a*****?c', ['abc']);
      match(['bbc', 'abc'], '?*****??', ['bbc', 'abc']);
      match(['bbc', 'abc'], '*****??', ['bbc', 'abc']);
      match(['bbc', 'abc'], '?*****?c', ['bbc', 'abc']);
      match(['bbc', 'abc', 'bbd'], '?***?****c', ['bbc', 'abc']);
      match(['bbc', 'abc'], '?***?****?', ['bbc', 'abc']);
      match(['bbc', 'abc'], '?***?****', ['bbc', 'abc']);
      match(['bbc', 'abc'], '*******c', ['bbc', 'abc']);
      match(['bbc', 'abc'], '*******?', ['bbc', 'abc']);
      match(['abcdecdhjk'], 'a*cd**?**??k', ['abcdecdhjk']);
      match(['abcdecdhjk'], 'a**?**cd**?**??k', ['abcdecdhjk']);
      match(['abcdecdhjk'], 'a**?**cd**?**??k***', ['abcdecdhjk']);
      match(['abcdecdhjk'], 'a**?**cd**?**??***k', ['abcdecdhjk']);
      match(['abcdecdhjk'], 'a**?**cd**?**??***k**', ['abcdecdhjk']);
      match(['abcdecdhjk'], 'a****c**?**??*****', ['abcdecdhjk']);
    });

    it('none of these should output anything:', function() {
      match(['abc'], '??**********?****?', []);
      match(['abc'], '??**********?****c', []);
      match(['abc'], '?************c****?****', []);
      match(['abc'], '*c*?**', []);
      match(['abc'], 'a*****c*?**', []);
      match(['abc'], 'a********???*******', []);
      match(['a'], '[]', []);
      match(['['], '[abc', []);
    });
  });

  describe('wildmat', function() {
    it('Basic wildmat features', function() {
      assert(!match.isMatch('foo', '*f'));
      assert(!match.isMatch('foo', '??'));
      assert(!match.isMatch('foo', 'bar'));
      assert(!match.isMatch('foobar', 'foo\\*bar'));
      assert(!match.isMatch('', ''));
      assert(match.isMatch('?a?b', '\\??\\?b'));
      assert(match.isMatch('aaaaaaabababab', '*ab'));
      assert(match.isMatch('f\\oo', 'f\\oo'));
      assert(match.isMatch('foo', '*'));
      assert(match.isMatch('foo', '*foo*'));
      assert(match.isMatch('foo', '???'));
      assert(match.isMatch('foo', 'f*'));
      assert(match.isMatch('foo', 'foo'));
      assert(match.isMatch('foo*', 'foo\\*', {unixify: false}));
      assert(match.isMatch('foobar', '*ob*a*r*'));
    });

    it('should support recursion', function() {
      assert(!match.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-/-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(!match.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-X-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(!match.isMatch('ab/cXd/efXg/hi', '*X*i'));
      assert(!match.isMatch('ab/cXd/efXg/hi', '*Xg*i'));
      assert(!match.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txtz', '**/*a*b*g*n*t'));
      assert(!match.isMatch('foo', '*/*/*'));
      assert(!match.isMatch('foo', 'fo'));
      assert(!match.isMatch('foo/bar', '*/*/*'));
      assert(!match.isMatch('foo/bar', 'foo?bar'));
      assert(!match.isMatch('foo/bb/aa/rr', '*/*/*'));
      assert(!match.isMatch('foo/bba/arr', 'foo*'));
      assert(!match.isMatch('foo/bba/arr', 'foo**'));
      assert(!match.isMatch('foo/bba/arr', 'foo/*'));
      assert(!match.isMatch('foo/bba/arr', 'foo/**arr'));
      assert(!match.isMatch('foo/bba/arr', 'foo/**z'));
      assert(!match.isMatch('foo/bba/arr', 'foo/*arr'));
      assert(!match.isMatch('foo/bba/arr', 'foo/*z'));
      assert(!match.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/X/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*'));
      assert(match.isMatch('-adobe-courier-bold-o-normal--12-120-75-75-m-70-iso8859-1', '-*-*-*-*-*-*-12-*-*-*-m-*-*-*'));
      assert(match.isMatch('ab/cXd/efXg/hi', '**/*X*/**/*i'));
      assert(match.isMatch('ab/cXd/efXg/hi', '*/*X*/*/*i'));
      assert(match.isMatch('abcd/abcdefg/abcdefghijk/abcdefghijklmnop.txt', '**/*a*b*g*n*t'));
      assert(match.isMatch('abcXdefXghi', '*X*i'));
      assert(match.isMatch('foo', 'foo'));
      assert(match.isMatch('foo/bar', 'foo/*'));
      assert(match.isMatch('foo/bar', 'foo/bar'));
      assert(match.isMatch('foo/bar', 'foo[/]bar'));
      assert(match.isMatch('foo/bb/aa/rr', '**/**/**'));
      assert(match.isMatch('foo/bba/arr', '*/*/*'));
      assert(match.isMatch('foo/bba/arr', 'foo/**'));
      assert(match.isMatch('XXX/adobe/courier/bold/o/normal//12/120/75/75/m/70/iso8859/1', 'XXX/*/*/*/*/*/*/12/*/*/*/m/*/*/*', {unixify: false}));
    });
  });
});
