'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('qmarks and stars', function() {
  it('should correctly handle question marks in globs', function() {
    mm(['?'], '?', ['?']);
    mm(['aaa', 'aac', 'abc'], 'a?c', ['abc', 'aac']);
    mm(['aaa', 'aac', 'abc'], 'a*?c', ['aac', 'abc']);
    mm(['a', 'aa', 'ab', 'ab?', 'ac', 'ac?', 'abcd', 'abbb'], 'ab?', ['ab?']);
    mm(['abc', 'abb', 'acc'], 'a**?c', ['abc', 'acc']);
    mm(['abc'], 'a*****?c', ['abc']);
    mm(['abc', 'zzz', 'bbb'], '?*****??', ['abc', 'zzz', 'bbb']);
    mm(['abc', 'zzz', 'bbb'], '*****??', ['abc', 'zzz', 'bbb']);
    mm(['abc', 'abb', 'zzz'], '?*****?c', ['abc']);
    mm(['abc', 'bbb', 'zzz'], '?***?****c', ['abc']);
    mm(['abc', 'bbb', 'zzz'], '?***?****?', ['abc', 'bbb', 'zzz']);
    mm(['abc'], '?***?****', ['abc']);
    mm(['abc'], '*******c', ['abc']);
    mm(['abc'], '*******?', ['abc']);
    mm(['abcdecdhjk'], 'a*cd**?**??k', ['abcdecdhjk']);
    mm(['abcdecdhjk'], 'a**?**cd**?**??k', ['abcdecdhjk']);
    mm(['abcdecdhjk'], 'a**?**cd**?**??k***', ['abcdecdhjk']);
    mm(['abcdecdhjk'], 'a**?**cd**?**??***k', ['abcdecdhjk']);
    mm(['abcdecdhjk'], 'a**?**cd**?**??***k**', ['abcdecdhjk']);
    mm(['abcdecdhjk'], 'a****c**?**??*****', ['abcdecdhjk']);
  });

  it('should match one character per question mark', function() {
    mm(['a/b/c.md'], 'a/?/c.md', ['a/b/c.md']);
    mm(['a/bb/c.md'], 'a/?/c.md', []);
    mm(['a/bb/c.md'], 'a/??/c.md', ['a/bb/c.md']);
    mm(['a/bbb/c.md'], 'a/??/c.md', []);
    mm(['a/bbb/c.md'], 'a/???/c.md', ['a/bbb/c.md']);
    mm(['a/bbbb/c.md'], 'a/????/c.md', ['a/bbbb/c.md']);
  });

  it('should match multiple groups of question marks', function() {
    mm(['a/bb/c/dd/e.md'], 'a/?/c/?/e.md', []);
    mm(['a/b/c/d/e.md'], 'a/?/c/?/e.md', ['a/b/c/d/e.md']);
    mm(['a/b/c/d/e.md'], 'a/?/c/???/e.md', []);
    mm(['a/b/c/zzz/e.md'], 'a/?/c/???/e.md', ['a/b/c/zzz/e.md']);
  });

  it('should use qmarks with other special characters', function() {
    mm(['a/b/c/d/e.md'], 'a/?/c/?/*/e.md', []);
    mm(['a/b/c/d/e/e.md'], 'a/?/c/?/*/e.md', ['a/b/c/d/e/e.md']);
    mm(['a/b/c/d/efghijk/e.md'], 'a/?/c/?/*/e.md', ['a/b/c/d/efghijk/e.md']);
    mm(['a/b/c/d/efghijk/e.md'], 'a/?/**/e.md', ['a/b/c/d/efghijk/e.md']);
    mm(['a/bb/e.md'], 'a/?/e.md', []);
    mm(['a/bb/e.md'], 'a/?/**/e.md', []);
    mm(['a/b/c/d/efghijk/e.md'], 'a/*/?/**/e.md', ['a/b/c/d/efghijk/e.md']);
    mm(['a/b/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/b/c/d/efgh.ijk/e.md']);
    mm(['a/b.bb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/b.bb/c/d/efgh.ijk/e.md']);
    mm(['a/bbb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md', ['a/bbb/c/d/efgh.ijk/e.md']);
  });

  it('question marks should not match slashes', function() {
    assert(!mm.isMatch('aaa/bbb', 'aaa?bbb'));
    assert(!mm.isMatch('aaa//bbb', 'aaa?bbb'));
    assert(!mm.isMatch('aaa\\bbb', 'aaa?bbb'));
    assert(!mm.isMatch('aaa\\\\bbb', 'aaa?bbb'));
  });

  it('question marks should not match dots', function() {
    assert(!mm.isMatch('aaa.bbb', 'aaa?bbb'));
    assert(!mm.isMatch('aaa/.bbb', 'aaa/?bbb'));
  });
});
