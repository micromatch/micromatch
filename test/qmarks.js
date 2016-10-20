'use strict';

var assert = require('assert');
var argv = require('yargs-parser')(process.argv.slice(2));
var mm = require('minimatch');
var nm = require('..');
var matcher = argv.mm ? mm : nm;

function compare(a, b) {
  return a === b ? 0 : a > b ? 1 : -1;
}

function match(arr, pattern, expected, options) {
  var actual = matcher.match(arr, pattern, options);
  actual.sort(compare);
  expected.sort(compare);
  assert.deepEqual(actual, expected);
}

describe('qmarks and stars', function() {
  it('should correctly handle question marks in globs', function() {
    match(['?'], '?', ['?']);
    match(['aaa', 'aac', 'abc'], 'a?c', ['abc', 'aac']);
    match(['aaa', 'aac', 'abc'], 'a*?c', ['aac', 'abc']);
    match(['a', 'aa', 'ab', 'ab?', 'ac', 'ac?', 'abcd', 'abbb'], 'ab?', ['ab?']);
    match(['abc', 'abb', 'acc'], 'a**?c', ['abc', 'acc']);
    match(['abc'], 'a*****?c', ['abc']);
    match(['abc', 'zzz', 'bbb'], '?*****??', ['abc', 'zzz', 'bbb']);
    match(['abc', 'zzz', 'bbb'], '*****??', ['abc', 'zzz', 'bbb']);
    match(['abc', 'abb', 'zzz'], '?*****?c', ['abc']);
    match(['abc', 'bbb', 'zzz'], '?***?****c', ['abc']);
    match(['abc', 'bbb', 'zzz'], '?***?****?', ['abc', 'bbb', 'zzz']);
    match(['abc'], '?***?****', ['abc']);
    match(['abc'], '*******c', ['abc']);
    match(['abc'], '*******?', ['abc']);
    match(['abcdecdhjk'], 'a*cd**?**??k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??k***', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??***k', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a**?**cd**?**??***k**', ['abcdecdhjk']);
    match(['abcdecdhjk'], 'a****c**?**??*****', ['abcdecdhjk']);
  });

  it('should match one character per question mark', function() {
    match(['a/b/c.md'], 'a/?/c.md', ['a/b/c.md']);
    match(['a/bb/c.md'], 'a/?/c.md', []);
    match(['a/bb/c.md'], 'a/??/c.md', ['a/bb/c.md']);
    match(['a/bbb/c.md'], 'a/??/c.md', []);
    match(['a/bbb/c.md'], 'a/???/c.md', ['a/bbb/c.md']);
    match(['a/bbbb/c.md'], 'a/????/c.md', ['a/bbbb/c.md']);
  });

  it('should match multiple groups of question marks', function() {
    match(['a/bb/c/dd/e.md'], 'a/?/c/?/e.md', []);
    match(['a/b/c/d/e.md'], 'a/?/c/?/e.md', ['a/b/c/d/e.md']);
    match(['a/b/c/d/e.md'], 'a/?/c/???/e.md', []);
    match(['a/b/c/zzz/e.md'], 'a/?/c/???/e.md', ['a/b/c/zzz/e.md']);
  });

  it('should use qmarks with other special characters', function() {
    match(['a/b/c/d/e.md'], 'a/?/c/?/*/e.md', []);
    match(['a/b/c/d/e/e.md'], 'a/?/c/?/*/e.md', ['a/b/c/d/e/e.md']);
    match(['a/b/c/d/efghijk/e.md'], 'a/?/c/?/*/e.md', ['a/b/c/d/efghijk/e.md']);
    match(['a/b/c/d/efghijk/e.md'], 'a/?/**/e.md', ['a/b/c/d/efghijk/e.md']);
    match(['a/bb/e.md'], 'a/?/e.md', []);
    match(['a/bb/e.md'], 'a/?/**/e.md', []);
    match(['a/b/c/d/efghijk/e.md'], 'a/*/?/**/e.md', ['a/b/c/d/efghijk/e.md']);
    match(['a/b/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/b/c/d/efgh.ijk/e.md']);
    match(['a/b.bb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/b.bb/c/d/efgh.ijk/e.md']);
    match(['a/bbb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/bbb/c/d/efgh.ijk/e.md']);
  });

  it('question marks should not match slashes', function() {
    assert(!nm.isMatch('aaa/bbb', 'aaa?bbb'));
    assert(!nm.isMatch('aaa//bbb', 'aaa?bbb'));
    assert(!nm.isMatch('aaa\\bbb', 'aaa?bbb'));
    assert(!nm.isMatch('aaa\\\\bbb', 'aaa?bbb'));
  });

  it('question marks should not match dots', function() {
    assert(!nm.isMatch('aaa.bbb', 'aaa?bbb'));
    assert(!nm.isMatch('aaa/.bbb', 'aaa/?bbb'));
  });
});
