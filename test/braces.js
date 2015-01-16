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
var mm = require('..');

if ('minimatch' in argv) {
  mm = require('minimatch');
}

describe('brace expansion', function () {
  it('should create a regex for brace expansion:', function () {
    mm.match(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm.match(['iii.md'], '!a/b/c{d,e}/*.md').should.eql(['iii.md']);
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

  it('should expand character classes:', function () {
    mm.match(['aa', 'ab', 'ac', 'ad', 'bad', 'baa', 'bbaa'], '*(a|{b),c)}').should.eql(['aa', 'ab', 'ac', 'baa', 'bbaa']);
  });

  it('should handle range expansion:', function () {
    mm.match(['aa', 'ab', 'ac', 'acc', 'ad', 'ae', 'af', 'ag'], '*{a..e}').should.eql(['aa', 'ab', 'ac', 'acc', 'ad', 'ae']);
  });

  it('should optimize regex when `optimize` is true:', function () {
    mm.match(['aa', 'ab', 'ac', 'acc', 'ad', 'ae', 'af', 'ag'], '*{a..e}').should.eql(['aa', 'ab', 'ac', 'acc', 'ad', 'ae']);
  });
});
