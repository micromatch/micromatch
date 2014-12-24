/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var path = require('path');
var should = require('should');
var mm = require('..');

describe('brace expansion', function () {
  it('should create a regex for brace expansion:', function () {
    mm(['iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm(['a/b/d/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm(['a/b/c/iii.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm(['a/b/cd/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/iii.md']);
    mm(['a/b/ce/iii.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/iii.md']);

    mm(['xyz.md'], 'a/b/c{d,e}/xyz.md').should.eql([]);
    mm(['a/b/d/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm(['a/b/c/xyz.md'], 'a/b/c{d,e}/*.md').should.eql([]);
    mm(['a/b/cd/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/cd/xyz.md']);
    mm(['a/b/ce/xyz.md'], 'a/b/c{d,e}/*.md').should.eql(['a/b/ce/xyz.md']);
    mm(['a/b/cef/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cef/xyz.md']);
    mm(['a/b/ceg/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/ceg/xyz.md']);
    mm(['a/b/cd/xyz.md'], 'a/b/c{d,e{f,g}}/*.md').should.eql(['a/b/cd/xyz.md']);
  });
});
