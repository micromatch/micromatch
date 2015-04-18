/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref;
}

// from the Bash 4.3 specification/unit tests
var arr = ['a','b','c','d','abc','abd','abe','bb','bcd','ca','cb','dd','de','Beware','bdir/', '*'];

describe('bash options and features:', function () {
  describe('failglob:', function () {
    it('should throw an error when no matches are found:', function () {
      (function () {
        mm.match(arr, '\\^', {failglob: true})
      }).should.throw('micromatch.match() found no matches for: "\\^".');
    });
  });

  // $echo a/{1..3}/b
  describe('bash', function () {
    it('should handle "regular globbing":', function () {
      mm.match(arr, 'a*').should.eql(['a','abc','abd','abe']);
      mm.match(arr, '\\a*').should.eql(['a','abc','abd','abe']);
    });

    it('should match directories:', function () {
      mm.match(arr, 'b*/').should.eql(['bdir/']);
    });

    it('should use quoted characters as literals:', function () {
      mm.match(arr, '\\*', {nonull: true}).should.eql(['*']);
      mm.match(arr, '\\^', {nonull: true}).should.eql(['^']);
      mm.match(arr, '\\^').should.eql([]);

      mm.match(arr, 'a\\*', {nonull: true}).should.eql(['a*']);
      mm.match(arr, 'a\\*').should.eql([]);

      mm(arr, ['a\\*', '\\*'], {nonull: true}).should.eql(['a*', '*']);
      mm(arr, ['a\\*', '\\*']).should.eql(['*']);

      mm(arr, ['a\\*'], {nonull: true}).should.eql(['a*']);
      mm(arr, ['a\\*']).should.eql([]);

      mm(arr, ['c*','a\\*','*q*'], {nonull: true}).should.eql(['c','ca','cb','a*','*q*']);
      mm(arr, ['c*','a\\*','*q*']).should.eql(['c','ca','cb']);

      mm.match(arr, '"*"*', {nonull: true}).should.eql(['**']);
      mm.match(arr, '"*"*').should.eql([]);

      mm.match(arr, '\\**').should.eql(['*']); // `*` is in the fixtures array
    });

    it('should work for escaped paths/dots:', function () {
      mm.match(arr, '"\\.\\./*/"', {nonull: true}).should.eql(['../*/']);
      mm.match(arr, 's/\\..*//', {nonull: true}).should.eql(['s/..*//']);
    });

    it('Pattern from Larry Wall\'s Configure that caused bash to blow up:', function () {
      mm.match(arr, '"/^root:/{s/^[^:]*:[^:]*:\\([^:]*\\).*"\'$\'"/\\1/"', {nonull: true}).should.eql(['/^root:/{s/^[^:]*:[^:]*:([^:]*).*$/1/']);
      mm.match(arr, '[a-c]b*').should.eql(['abc','abd','abe','bb','cb']);
    });

    it('Make sure character classes work properly:', function () {
      mm.match(arr, '[a-y]*[^c]').should.eql(['abd','abe','bb','bcd','ca','cb','dd','de']);
      mm.match(arr, 'a*[^c]').should.eql(['abd','abe']);

      mm.match(['a-b','aXb'], 'a[X-]b').should.eql(['a-b','aXb']);
      mm.match(arr, '[^a-c]*').should.eql(['d','dd','de','Beware','*']);
      mm.match(['a*b/ooo'], 'a\\*b/*').should.eql(['a*b/ooo']);
      mm.match(['a*b/ooo'], 'a\\*?/*').should.eql(['a*b/ooo']);
      mm.match(arr, 'a[b]c').should.eql(['abc']);
      mm.match(arr, 'a["b"]c').should.eql(['abc']);
      mm.match(arr, 'a[\\b]c').should.eql(['abc']);
      mm.match(arr, 'a?c').should.eql(['abc']);
      mm.match(['man/man1/bash.1'], '*/man*/bash.*').should.eql(['man/man1/bash.1']);
    });

    it('tests with multiple `*\'s:', function () {
      mm.match(['bbc','abc', 'bbd'], 'a**c').should.eql(['abc']);
      mm.match(['bbc','abc', 'bbd'], 'a***c').should.eql(['abc']);
      mm.match(['bbc','abc', 'bbc'], 'a*****?c').should.eql(['abc']);
      mm.match(['bbc','abc'], '?*****??').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '*****??').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '?*****?c').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc', 'bbd'], '?***?****c').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '?***?****?').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '?***?****').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '*******c').should.eql(['bbc', 'abc']);
      mm.match(['bbc','abc'], '*******?').should.eql(['bbc', 'abc']);
      mm.match(['abcdecdhjk'], 'a*cd**?**??k').should.eql(['abcdecdhjk']);
      mm.match(['abcdecdhjk'], 'a**?**cd**?**??k').should.eql(['abcdecdhjk']);
      mm.match(['abcdecdhjk'], 'a**?**cd**?**??k***').should.eql(['abcdecdhjk']);
      mm.match(['abcdecdhjk'], 'a**?**cd**?**??***k').should.eql(['abcdecdhjk']);
      mm.match(['abcdecdhjk'], 'a**?**cd**?**??***k**').should.eql(['abcdecdhjk']);
      mm.match(['abcdecdhjk'], 'a****c**?**??*****').should.eql(['abcdecdhjk']);
    });

    it('none of these should output anything:', function () {
      mm.match(['abc'], '??**********?****?').should.eql([]);
      mm.match(['abc'], '??**********?****c').should.eql([]);
      mm.match(['abc'], '?************c****?****').should.eql([]);
      mm.match(['abc'], '*c*?**').should.eql([]);
      mm.match(['abc'], 'a*****c*?**').should.eql([]);
      mm.match(['abc'], 'a********???*******').should.eql([]);
      mm.match(['a'], '[]').should.eql([]);
      mm.match(['['], '[abc').should.eql([]);
    });
  });
});
