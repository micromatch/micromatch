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
  mm = ref.minimatch;
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
    mm.match(['./a/b/d/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql([]);
    mm.match(['./a/b/c/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql([]);
    mm.match(['./a/b/x/cd/bar/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql(['./a/b/x/cd/bar/xyz.md']);
    mm.match(['./a/b/baz/ce/fez/xyz.md'], './a/b/**/c{d,e}/**/xyz.md').should.eql(['./a/b/baz/ce/fez/xyz.md']);
  });
});


// tests based on https://github.com/vmeurisse/wildmatch
describe('braces sequences', function() {
  it('normal sequence', function() {
    mm.match(['1', '2', '3'], '{1..2}').should.eql(['1', '2']);
    mm.match(['0', '3'], '{1..2}').should.eql([]);
  });

  it('backward counting', function() {
    mm.match(['1023', '1022', '1021'], '{1023..1021}').should.eql(['1023', '1022', '1021']);
    mm.match(['1024', '1020'], '{1023..1021}').should.eql([]);
  });

  it('forced step', function() {
    mm.match(['1', '4', '10'], '{1..10..3}').should.eql(['1', '4', '10']);
    mm.match(['0', '2', '3', '13'], '{1..10..3}').should.eql([]);
  });

  it('forced step, last number is not in the result', function() {
    mm.match(['1', '5', '9'], '{1..10..4}').should.eql(['1', '5', '9']);
    mm.match(['0', '4', '10', '13'], '{1..10..4}').should.eql([]);
  });

  it('negative start', function() {
    mm.match(['-1', '0', '1', '2'], '{-1..2}').should.eql(['-1', '0', '1', '2'])
    mm.match(['-2', '3', 'a'], '{-1..2}').should.eql([]);
  });

  it('negative steps', function() {
    mm.match(['5', '2', '-1'], '{5..-2..-3}').should.eql(['5', '2', '-1'])
    mm.match(['6', '4', '-2'], '{5..-2..-3}').should.eql([]);
  });

  it('start equal end', function() {
    mm.match(['1'], '{1..1}').should.eql(['1'])
    mm.match(['0', '2', '-1'], '{1..1}').should.eql([]);
  });

  it('invalid steps: wrong sign', function() {
    //mm.match(['5', '6', '7'], '{5..7..-3}').should.eql(['5', '6', '7'])
    mm.match(['2'], '{5..7..-3}').should.eql([]);
  });

  it('invalid steps: 0', function() {
    mm.match(['5', '6', '7'], '{5..7..0}').should.eql(['5', '6', '7'])
    mm.match(['4', '8'], '{5..7..0}').should.eql([]);
  });
});

describe('braces', function() {
  it('Basic braces', function() {
    mm.match(['abc', 'zbc'], '{a,z}bc').should.eql(['abc', 'zbc']);
    mm.match('bbc', '{a,z}bc').should.eql([]);
    mm.match(['bca', 'bcz'], 'bc{a,z}').should.eql(['bca', 'bcz']);
  });

  it('letter sequences', function() {
    // normal sequence
    mm.match(['a', 'b', 'c'], '{a..c}').should.eql(['a', 'b', 'c'])
    mm.match(['d', 'a..c'], '{a..c}').should.eql([]);

    mm.match(['A', 'B', 'C'], '{C..A}').should.eql(['A', 'B', 'C'])
    mm.match(['a', 'D'], '{C..A}').should.eql([]);

    mm.match(['a', 'c'], '{a..c..2}').should.eql(['a', 'c'])
    mm.match(['b'], '{a..c..2}').should.eql([]);
  });

  it('nested', function() {
    mm.match(['abc', '1bc', '2bc'], '{a,{1..2}}bc').should.eql(['abc', '1bc', '2bc'])
    mm.match(['bc', '{1..2}bc', '{a,{1..2}}bc'], '{a,{1..2}}bc').should.eql([]);

    mm.match(['br1', 'br2', 'brab', 'bracd', 'brace'], 'br{{1..2},a{b,c{d,e}}}').should.eql(['br1', 'br2', 'brab', 'bracd', 'brace'])
    mm.match(['brace1'], 'br{{1..2},a{b,c{d,e}}}').should.eql([]);
  });

  it('escape', function() {
    mm.match(['a','b}'], '{a,b\\}}').should.eql([])
    mm.match(['b'], '{a,b\\}}').should.eql([]);

    mm.match(['a,b','c'], '{a\\,b,c}').should.eql(['a,b','c'])
    mm.match(['a', 'b'], '{a\\,b,c}').should.eql([]);

    mm.match(['*','a'], '{\\*,a}').should.eql(['*','a'])
    mm.match(['xx'], '{\\*,a}').should.eql([]);
  });

  it('invalid', function() {
    mm.match(['a'], '{a}').should.eql(['a'])
    mm.match(['{a}'], '{a}').should.eql([])
    mm.match(['a'], '{a}').should.eql(['a']);

    mm.match(['{a,b'], '{a,b').should.eql(['{a,b']);
    mm.match(['a', 'b'], '{a,b').should.eql([]);

    mm.match(['{a,b}'], '{a,b\\}').should.eql(['{a,b}'])
    mm.match(['a', 'b}', '{a,b\\}'], '{a,b\\}').should.eql([]);

    mm.match(['a', '{b}'], '{a,{b}}').should.eql(['a'])
    mm.match(['a', '{b}'], '{a,\\{b\\}}').should.eql(['a', '{b}'])
    mm.match(['{a,{b}}', 'b'], '{a,{b}}').should.eql(['b']);

    mm.match(['a}', '{b}'], '{a,\\{b}}').should.eql(['a}', '{b}'])
    mm.match(['a'], '{a,\\{b}}').should.eql([]);

    mm.match(['{a,b', '{a,c'], '{a,{b,c}').should.eql(['{a,b', '{a,c']);
    mm.match(['a', '{b', '{b,c'], '{a,{b,c}').should.eql([]);

    mm.match(['{a..C}'], '{a..C}').should.eql([]);
    mm.match(['a', 'C'], '{a..C}').should.eql(['a', 'C']);

    mm.match(['{a..1}'], '{a..1}').should.eql(['{a..1}']);
    mm.match(['a', '1'], '{a..1}').should.eql([]);

    mm.match(['{1.1..2.1}'], '{1.1..2.1}').should.eql(['{1.1..2.1}']);
    mm.match(['1.1', '2.1'], '{1.1..2.1}').should.eql([]);

    mm.match(['{1..2..1..2}'], '{1..2..1..2}').should.eql([]);
    mm.match(['1', '2'], '{1.1..2.1}').should.eql([]);

    mm.match(['{a..b..a}'], '{a..b..a}').should.eql([]);
    mm.match(['a', 'b'], '{1.1..2.1}').should.eql([]);
  });
});
