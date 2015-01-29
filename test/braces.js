/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}
if ('wildmatch' in argv) {
  mm = ref.wildmatch;
}

// $echo a/{1..3}/b
describe('brace expansion', function () {
  it('should create a regex for brace expansion:', function () {
    mm.match(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['a/a', 'b/b', 'a/b', 'a/c'], '*/{a,c}').should.eql(['a/a', 'a/c']);
    mm.match(['a/a/a', 'b/b/b', 'a/a/b', 'a/a/c'], '**/**/{a,c}').should.eql(['a/a/a', 'a/a/c']);
    mm.match(['a/b/d/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['a/b/c/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['a/b/cd/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/iii.md']);
    mm.match(['a/b/ce/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/iii.md']);

    mm.match(['xyz.md'], 'a/b/c{d,e}/xyz.md').should.eql([]);
    mm.match(['a.md', 'b.md', 'c.md', 'd.md'], '{a,b,c}.md').should.eql(['a.md', 'b.md', 'c.md']);
    mm.match(['a/b/d/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['a/b/c/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['a/b/cd/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/xyz.md']);
    mm.match(['a/b/ce/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/xyz.md']);
    mm.match(['a/b/cef/xyz.md', 'a/b/ceg/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cef/xyz.md', 'a/b/ceg/xyz.md']);
    mm.match(['a/b/ceg/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/ceg/xyz.md']);
    mm.match(['a/b/cd/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cd/xyz.md']);
  });

  it('should match negation patterns:', function () {
    mm.match(['iii.md'], '!a/b/c{d,e}/*.md').should.eql(['iii.md']);
  });

  it('should match character classes:', function () {
    mm.match(['aa', 'ab', 'ac', 'ad', 'bad', 'baa', 'bbaa'], '(a|b*|c)').should.eql(['bad', 'baa', 'bbaa']);
    mm.match(['aa', 'ab', 'ac', 'ad', 'bad', 'baa', 'bbaa'], '*(a|{b),c)}').should.eql(['aa', 'ab', 'ac', 'baa', 'bbaa']);
  });

  it('should handle range expansion:', function () {
    mm.match(['aa', 'ab', 'ac', 'acc', 'ad', 'ae', 'af', 'ag'], '*{a..e}').should.eql(['aa', 'ab', 'ac', 'acc', 'ad', 'ae']);
  });

  it('should optimize regex when `optimize` is true:', function () {
    mm.match(['aa', 'ab', 'ac', 'acc', 'ad', 'ae', 'af', 'ag'], '*{a..e}').should.eql(['aa', 'ab', 'ac', 'acc', 'ad', 'ae']);
  });
});


// tests based on https://github.com/vmeurisse/wildmatch
describe('braces', function() {
  it('Basic braces', function() {
    mm.match(['abc', 'zbc'], '{a,z}bc').should.eql(['abc', 'zbc']);
    // makeTest.nomatch('bbc', '{a,z}bc');
    mm.match(['bca', 'bcz'], 'bc{a,z}').should.eql(['bca', 'bcz']);
  });

  it('sequence', function() {
    // normal sequence
    mm.match(['1', '2', '3'], '{1..2}').should.eql(['1', '2']);
    // makeTest.nomatch(['0', '3'], '{1..2}');

    // backward counting
    mm.match(['1023', '1022', '1021'], '{1023..1021}').should.eql(['1023', '1022', '1021']);
    // makeTest.nomatch(['1024', '1020'], '{1023..1021}');

    // forced step
    mm.match(['1', '4', '10'], '{1..10..3}').should.eql(['1', '4', '10']);
    // makeTest.nomatch(['0', '2', '3', '13'], '{1..10..3}');

    // forced step, last number is not in the result
    mm.match(['1', '5', '9'], '{1..10..4}').should.eql(['1', '5', '9']);
    // makeTest.nomatch(['0', '4', '10', '13'], '{1..10..4}');

    // negative start
    // mm.match(['-1', '0', '1', '2'], '{-1..2}').should.eql(['-1', '0', '1', '2'])
    // makeTest.nomatch(['-2', '3', 'a'], '{-1..2}');

    // negative steps
    mm.match(['5', '2', '-1'], '{5..-2..-3}').should.eql(['5', '2', '-1'])
    // makeTest.nomatch(['6', '4', '-2'], '{5..-2..-3}');

    // start equal end
    mm.match(['1'], '{1..1}').should.eql(['1'])
    // makeTest.nomatch(['0', '2', '-1'], '{1..1}');

    // invalid steps: wrong sign
    // mm.match(['5', '6', '7'], '{5..7..-3}').should.eql(['5', '6', '7'])
    // makeTest.nomatch(['2'], '{5..7..-3}');

    // invalid steps: 0
    mm.match(['5', '6', '7'], '{5..7..0}').should.eql(['5', '6', '7'])
    // makeTest.nomatch(['4', '8'], '{5..7..0}');
  });

  it('letter sequences', function() {
    // normal sequence
    mm.match(['a', 'b', 'c'], '{a..c}').should.eql(['a', 'b', 'c'])
    // makeTest.nomatch(['d', 'a..c'], '{a..c}');

    mm.match(['A', 'B', 'C'], '{C..A}').should.eql(['A', 'B', 'C'])
    // makeTest.nomatch(['a', 'D'], '{C..A}');

    mm.match(['a', 'c'], '{a..c..2}').should.eql(['a', 'c'])
    // makeTest.nomatch(['b'], '{a..c..2}');
  });

  it('nested', function() {
    mm.match(['abc', '1bc', '2bc'], '{a,{1..2}}bc').should.eql(['abc', '1bc', '2bc'])
    // makeTest.nomatch(['bc', '{1..2}bc', '{a,{1..2}}bc'], '{a,{1..2}}bc');

    mm.match(['br1', 'br2', 'brab', 'bracd', 'brace'], 'br{{1..2},a{b,c{d,e}}}').should.eql(['br1', 'br2', 'brab', 'bracd', 'brace'])
    // makeTest.nomatch(['brace1'], 'br{{1..2},a{b,c{d,e}}}');
  });

  it('escape', function() {
    mm.match(['a','b}'], '{a,b\\}}').should.eql([])
    // makeTest.nomatch(['b'], '{a,b\\}}');

    mm.match(['a,b','c'], '{a\\,b,c}').should.eql(['a,b','c'])
    // makeTest.nomatch(['a', 'b'], '{a\\,b,c}');

    mm.match(['*','a'], '{\\*,a}').should.eql(['*','a'])
    // makeTest.nomatch(['xx'], '{\\*,a}');
  });

  it('invalid', function() {
    mm.match(['a'], '{a}').should.eql(['a'])
    mm.match(['{a}'], '{a}').should.eql([])
    // makeTest.nomatch(['a'], '{a}');

    mm.match(['{a,b'], '{a,b').should.eql(['{a,b']);
    // makeTest.nomatch(['a', 'b'], '{a,b');

    mm.match(['{a,b}'], '{a,b\\}').should.eql(['{a,b}'])
    // makeTest.nomatch(['a', 'b}', '{a,b\\}'], '{a,b\\}');

    mm.match(['a', '{b}'], '{a,{b}}').should.eql(['a'])
    mm.match(['a', '{b}'], '{a,\\{b\\}}').should.eql(['a', '{b}'])
    // makeTest.nomatch(['{a,{b}}', 'b'], '{a,{b}}');

    mm.match(['a}', '{b}'], '{a,\\{b}}').should.eql(['a}', '{b}'])
    // makeTest.nomatch(['a'], '{a,\\{b}}');

    mm.match(['{a,b', '{a,c'], '{a,{b,c}').should.eql(['{a,b', '{a,c']);
    // makeTest.nomatch(['a', '{b', '{b,c'], '{a,{b,c}');

    mm.match(['{a..C}'], '{a..C}').should.eql([]);
    // makeTest.nomatch(['a', 'C'], '{a..C}');

    mm.match(['{a..1}'], '{a..1}').should.eql(['{a..1}']);
    // makeTest.nomatch(['a', '1'], '{a..1}');

    mm.match(['{1.1..2.1}'], '{1.1..2.1}').should.eql(['{1.1..2.1}']);
    // makeTest.nomatch(['1.1', '2.1'], '{1.1..2.1}');

    mm.match(['{1..2..1..2}'], '{1..2..1..2}').should.eql([]); // wildmatch expects '{1..2..1..2}'
    // makeTest.nomatch(['1', '2'], '{1.1..2.1}');

    mm.match(['{a..b..a}'], '{a..b..a}').should.eql([]); // wildmatch expects '{a..b..a}'
    // makeTest.nomatch(['a', 'b'], '{1.1..2.1}');
  });
});
