'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('..');
const { isMatch } = mm;

describe('qmarks and stars', () => {
  it('should match with qmarks', () => {
    assert(!isMatch('/ab', '/?'));
    assert(!isMatch('/ab', '?/?'));
    assert(isMatch('a/b', '?/?'));
    assert(isMatch('/ab', '/??'));
    assert(isMatch('/ab', '/?b'));
    assert(!isMatch('/ab', ['?/?', 'foo', 'bar']));
    assert(!isMatch('/ab', ['a/*', 'foo', 'bar']));
  });

  it('should support qmark matching', () => {
    let arr = ['a', 'aa', 'ab', 'aaa', 'abcdefg'];
    assert.deepEqual(mm(arr, '?'), ['a']);
    assert.deepEqual(mm(arr, '??'), ['aa', 'ab']);
    assert.deepEqual(mm(arr, '???'), ['aaa']);
  });

  it('should correctly handle question marks in globs', () => {
    assert.deepEqual(mm(['?', '??', '???'], '?'), ['?']);
    assert.deepEqual(mm(['?', '??', '???'], '??'), ['??']);
    assert.deepEqual(mm(['?', '??', '???'], '???'), ['???']);
    assert.deepEqual(mm(['/a/', '/a/b/', '/a/b/c/', '/a/b/c/d/'], '??'), []);
    mm(['/a/', '/a/b/', '/a/b/c/', '/a/b/c/d/'], '??', { dot: true }, []);
    assert.deepEqual(mm(['x/y/acb', 'acb', 'acb/', 'acb/d/e'], 'a?b'), ['acb']);
    assert.deepEqual(mm(['aaa', 'aac', 'abc'], 'a?c'), ['aac', 'abc']);
    assert.deepEqual(mm(['aaa', 'aac', 'abc'], 'a*?c'), ['aac', 'abc']);
    assert.deepEqual(mm(['a', 'aa', 'ab', 'ab?', 'ac', 'ac?', 'abcd', 'abbb'], 'ab?'), ['ab?']);
    assert.deepEqual(mm(['abc', 'abb', 'acc'], 'a**?c'), ['abc', 'acc']);
    assert.deepEqual(mm(['abc'], 'a*****?c'), ['abc']);
    assert.deepEqual(mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '*****?'), ['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa']);
    assert.deepEqual(mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '*****??'), ['aa', 'abc', 'zzz', 'bbb', 'aaaa']);
    assert.deepEqual(mm(['a', 'aa', 'abc', 'zzz', 'bbb', 'aaaa'], '?*****??'), ['abc', 'zzz', 'bbb', 'aaaa']);
    assert.deepEqual(mm(['abc', 'abb', 'zzz'], '?*****?c'), ['abc']);
    assert.deepEqual(mm(['abc', 'bbb', 'zzz'], '?***?****c'), ['abc']);
    assert.deepEqual(mm(['abc', 'bbb', 'zzz'], '?***?****?'), ['abc', 'bbb', 'zzz']);
    assert.deepEqual(mm(['abc'], '?***?****'), ['abc']);
    assert.deepEqual(mm(['abc'], '*******c'), ['abc']);
    assert.deepEqual(mm(['abc'], '*******?'), ['abc']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a*cd**?**??k'), ['abcdecdhjk']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??k'), ['abcdecdhjk']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??k***'), ['abcdecdhjk']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??***k'), ['abcdecdhjk']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a**?**cd**?**??***k**'), ['abcdecdhjk']);
    assert.deepEqual(mm(['abcdecdhjk'], 'a****c**?**??*****'), ['abcdecdhjk']);
  });

  it('should match one character per question mark', () => {
    assert.deepEqual(mm(['a/b/c.md'], 'a/?/c.md'), ['a/b/c.md']);
    assert.deepEqual(mm(['a/bb/c.md'], 'a/?/c.md'), []);
    assert.deepEqual(mm(['a/bb/c.md'], 'a/??/c.md'), ['a/bb/c.md']);
    assert.deepEqual(mm(['a/bbb/c.md'], 'a/??/c.md'), []);
    assert.deepEqual(mm(['a/bbb/c.md'], 'a/???/c.md'), ['a/bbb/c.md']);
    assert.deepEqual(mm(['a/bbbb/c.md'], 'a/????/c.md'), ['a/bbbb/c.md']);
  });

  it('should match multiple groups of question marks', () => {
    assert.deepEqual(mm(['a/bb/c/dd/e.md'], 'a/?/c/?/e.md'), []);
    assert.deepEqual(mm(['a/b/c/d/e.md'], 'a/?/c/?/e.md'), ['a/b/c/d/e.md']);
    assert.deepEqual(mm(['a/b/c/d/e.md'], 'a/?/c/???/e.md'), []);
    assert.deepEqual(mm(['a/b/c/zzz/e.md'], 'a/?/c/???/e.md'), ['a/b/c/zzz/e.md']);
  });

  it('should use qmarks with other special characters', () => {
    assert.deepEqual(mm(['a/b/c/d/e.md'], 'a/?/c/?/*/e.md'), []);
    assert.deepEqual(mm(['a/b/c/d/e/e.md'], 'a/?/c/?/*/e.md'), ['a/b/c/d/e/e.md']);
    assert.deepEqual(mm(['a/b/c/d/efghijk/e.md'], 'a/?/c/?/*/e.md'), ['a/b/c/d/efghijk/e.md']);
    assert.deepEqual(mm(['a/b/c/d/efghijk/e.md'], 'a/?/**/e.md'), ['a/b/c/d/efghijk/e.md']);
    assert.deepEqual(mm(['a/bb/e.md'], 'a/?/e.md'), []);
    assert.deepEqual(mm(['a/bb/e.md'], 'a/?/**/e.md'), []);
    assert.deepEqual(mm(['a/b/c/d/efghijk/e.md'], 'a/*/?/**/e.md'), ['a/b/c/d/efghijk/e.md']);
    assert.deepEqual(mm(['a/b/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md'), ['a/b/c/d/efgh.ijk/e.md']);
    assert.deepEqual(mm(['a/b.bb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md'), ['a/b.bb/c/d/efgh.ijk/e.md']);
    assert.deepEqual(mm(['a/bbb/c/d/efgh.ijk/e.md'], 'a/*/?/**/e.md'), ['a/bbb/c/d/efgh.ijk/e.md']);
  });

  it('question marks should not match slashes', () => {
    assert(!isMatch('aaa/bbb', 'aaa?bbb'));
    assert(!isMatch('aaa//bbb', 'aaa?bbb'));
    if (process.platform === 'win32') {
      assert(!isMatch('aaa\\bbb', 'aaa?bbb'));
      assert(!isMatch('aaa\\\\bbb', 'aaa??bbb'));
    } else {
      assert(isMatch('aaa\\bbb', 'aaa?bbb'));
      assert(!isMatch('aaa\\\\bbb', 'aaa?bbb'));
      assert(isMatch('aaa\\\\bbb', 'aaa??bbb'));
    }
    assert(!isMatch('aaa/bbb', 'aaa?bbb'));
  });

  it('question marks should match arbitrary dots', () => {
    assert(isMatch('aaa.bbb', 'aaa?bbb'));
  });

  it('question marks should not match leading dots', () => {
    assert(!isMatch('.aaa/bbb', '?aaa/bbb'));
    assert(!isMatch('aaa/.bbb', 'aaa/?bbb'));
  });

  it('question marks should match leading dots when options.dot is true', () => {
    assert(isMatch('aaa/.bbb', 'aaa/?bbb', {dot: true}));
    assert(isMatch('.aaa/bbb', '?aaa/bbb', {dot: true}));
  });

  it('question marks should match characters preceding a dot', () => {
    assert(isMatch('a/bbb/abcd.md', 'a/*/ab??.md'));
    assert(isMatch('a/bbb/abcd.md', 'a/bbb/ab??.md'));
    assert(isMatch('a/bbb/abcd.md', 'a/bbb/ab???md'));
  });
});
