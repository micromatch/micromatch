'use strict';

var assert = require('assert');
var mm = require('./support/match');

describe('qmarks and stars', function() {
  it('should support qmark matching', function() {
    var arr = ['a', 'aa', 'ab', 'aaa', 'abcdefg'];
    mm(arr, '?', ['a']);
    mm(arr, '??', ['aa', 'ab']);
    mm(arr, '???', ['aaa']);
  });

  it('should correctly handle question marks in globs', function() {
    mm(['?', '??', '???'], '?', ['?']);
    mm(['?', '??', '???'], '??', ['??']);
    mm(['?', '??', '???'], '???', ['???']);
    mm(['/a/', '/a/b/', '/a/b/c/', '/a/b/c/d/'], '??', []);
    mm(['/a/', '/a/b/', '/a/b/c/', '/a/b/c/d/'], '??', {dot: true}, []);
    mm(['x/y/acb', 'acb', 'acb/', 'acb/d/e'], 'a?b', ['acb', 'acb/']);
    mm(['aaa', 'aac', 'abc'], 'a?c', ['abc', 'aac']);
    mm(['aaa', 'aac', 'abc'], 'a*?c', ['aac', 'abc']);
    mm(['a', 'aa', 'ab', 'ab?', 'ac', 'ac?', 'abcd', 'abbb'], 'ab?', ['ab?']);
    mm(['abc', 'abb', 'acc'], 'a**?c', ['abc', 'acc']);
    mm(['abc'], 'a*****?c', ['abc']);
    mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '*****?', ['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa']);
    mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '*****??', ['aa', 'abc', 'zzz', 'bbb', 'aaaa']);
    mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '?*****??', ['abc', 'zzz', 'bbb', 'aaaa']);
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

  it('question marks should match arbitrary dots', function() {
    assert(mm.isMatch('aaa.bbb', 'aaa?bbb'));
  });

  it('question marks should not match leading dots', function() {
    assert(!mm.isMatch('.aaa/bbb', '?aaa/bbb'));
    assert(!mm.isMatch('aaa/.bbb', 'aaa/?bbb'));
  });

  it('question marks should match leading dots when options.dot is true', function() {
    assert(mm.isMatch('aaa/.bbb', 'aaa/?bbb', {dot: true}));
    assert(mm.isMatch('.aaa/bbb', '?aaa/bbb', {dot: true}));
  });

  it('question marks should match characters preceding a dot', function() {
    assert(mm.isMatch('a/bbb/abcd.md', 'a/*/ab??.md'));
    assert(mm.isMatch('a/bbb/abcd.md', 'a/bbb/ab??.md'));
    assert(mm.isMatch('a/bbb/abcd.md', 'a/bbb/ab???md'));
  });
});
