/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var mm = require('..');

describe('micromatch', function () {
  it('should create a regular expression for matching extensions:', function () {
    mm.makeRe('.md').should.eql(/^.md$/);
    mm.makeRe('.md').test('.md').should.be.true;
    mm.makeRe('.md').test('.verb.md').should.be.false;
  });

  it('should create a regular expression for matching files with extensions:', function () {
    mm.makeRe('*.md').should.eql(/^[^\/]+.md$/);
    mm.makeRe('*.md').test('.verb.md').should.be.true;
    mm.makeRe('*.md').test('.verb.txt').should.be.false;
  });

  it('should create a regular expression for slashes:', function () {
    mm.makeRe('a/b/c/*.md').should.eql(/^a\/b\/c\/[^\/]+.md$/);
    mm.makeRe('a/b/c/*.md').test('.verb.md').should.be.false;
    mm.makeRe('a/b/c/*.md').test('a/b/d/.verb.md').should.be.false;
    mm.makeRe('a/b/c/*.md').test('a/b/c/.verb.md').should.be.true;
  });

  it('should create a regular brace expansion:', function () {
    mm.makeRe('a/b/c{d,e}/*.md').should.eql(/^a\/b\/cd\/[^\/]+.md|a\/b\/ce\/[^\/]+.md$/);
    mm.makeRe('a/b/c{d,e}/*.md').test('iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/iii.md').should.be.true;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/iii.md').should.be.true;

    mm.makeRe('a/b/c{d,e}/xyz.md').should.eql(/^a\/b\/cd\/xyz.md|a\/b\/ce\/xyz.md$/);
    mm.makeRe('a/b/c{d,e}/xyz.md').test('xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/xyz.md').should.be.true;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/xyz.md').should.be.true;
  });

  it('should create a regular expression for double stars:', function () {
    mm.makeRe('a/**/z/*.md').should.eql(/^a\/[\s\S]+\/z\/[^\/]+.md$/);
    mm.makeRe('a/**/z/*.md').test('.verb.md').should.be.false;
    mm.makeRe('a/**/z/*.md').test('a/b/z/.verb.md').should.be.true;
    mm.makeRe('a/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.true;

    mm.makeRe('a/**/j/**/z/*.md').should.eql(/^a\/[\s\S]+\/j\/[\s\S]+\/z\/[^\/]+.md$/);
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.false;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.md').should.be.true;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/j/n/p/o/z/foo.md').should.be.true;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.txt').should.be.false;

    var re = /^a\/b\/[\s\S]+\/cd\/[\s\S]+\/xyz.md|a\/b\/[\s\S]+\/ce\/[\s\S]+\/xyz.md$/;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').should.eql(re);
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/d/xyz.md').should.be.false;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/c/xyz.md').should.be.false;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/foo/cd/bar/xyz.md').should.be.true;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/baz/ce/fez/xyz.md').should.be.true;
  });
});

describe('negation', function () {
  it('should create a regular expression for negating extensions:', function () {
    mm.makeRe('!.md').should.eql(/^(?!.md)$/);
    mm.makeRe('!.md').test('.md').should.be.false;
    mm.makeRe('!.md').test('.verb.md').should.be.false;
  });

  it('should create a regular expression for negating files with extensions:', function () {
    mm.makeRe('!*.md').should.eql(/^(?![^\/]+.md)$/);
    mm.makeRe('!*.md').test('.verb.md').should.be.false;
    mm.makeRe('!*.md').test('.verb.txt').should.be.false;
  });

  it('should create a regular expression for slashes:', function () {
    mm.makeRe('a/b/c/*.md').should.eql(/^a\/b\/c\/[^\/]+.md$/);
    mm.makeRe('a/b/c/*.md').test('.verb.md').should.be.false;
    mm.makeRe('a/b/c/*.md').test('a/b/d/.verb.md').should.be.false;
    mm.makeRe('a/b/c/*.md').test('a/b/c/.verb.md').should.be.true;
  });

  it('should create a regular brace expansion:', function () {
    mm.makeRe('a/b/c{d,e}/*.md').should.eql(/^a\/b\/cd\/[^\/]+.md|a\/b\/ce\/[^\/]+.md$/);
    mm.makeRe('a/b/c{d,e}/*.md').test('iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/iii.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/iii.md').should.be.true;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/iii.md').should.be.true;

    mm.makeRe('a/b/c{d,e}/xyz.md').should.eql(/^a\/b\/cd\/xyz.md|a\/b\/ce\/xyz.md$/);
    mm.makeRe('a/b/c{d,e}/xyz.md').test('xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/d/xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/c/xyz.md').should.be.false;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/cd/xyz.md').should.be.true;
    mm.makeRe('a/b/c{d,e}/*.md').test('a/b/ce/xyz.md').should.be.true;
  });

  it('should create a regular expression for double stars:', function () {
    mm.makeRe('a/**/z/*.md').should.eql(/^a\/[\s\S]+\/z\/[^\/]+.md$/);
    mm.makeRe('a/**/z/*.md').test('.verb.md').should.be.false;
    mm.makeRe('a/**/z/*.md').test('a/b/z/.verb.md').should.be.true;
    mm.makeRe('a/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.true;

    mm.makeRe('a/**/j/**/z/*.md').should.eql(/^a\/[\s\S]+\/j\/[\s\S]+\/z\/[^\/]+.md$/);
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/z/foo.md').should.be.false;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.md').should.be.true;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/d/e/j/n/p/o/z/foo.md').should.be.true;
    mm.makeRe('a/**/j/**/z/*.md').test('a/b/c/j/e/z/foo.txt').should.be.false;

    var re = /^a\/b\/[\s\S]+\/cd\/[\s\S]+\/xyz.md|a\/b\/[\s\S]+\/ce\/[\s\S]+\/xyz.md$/;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').should.eql(re);
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/d/xyz.md').should.be.false;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/c/xyz.md').should.be.false;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/foo/cd/bar/xyz.md').should.be.true;
    mm.makeRe('a/b/**/c{d,e}/**/xyz.md').test('a/b/baz/ce/fez/xyz.md').should.be.true;
  });
});


describe('options', function () {
  it('should support the `matchBase` option:', function () {
    mm.makeRe('*.md').test('a/b/c/foo.md').should.be.false;
    mm.makeRe('*.md', {matchBase: true}).test('a/b/c/foo.md').should.be.true;
  });

  it('should support the `nocase` option:', function () {
    mm.makeRe('a/b/c/*.md').test('a/b/d/e.md').should.be.false;
    mm.makeRe('A/b/C/*.md').test('a/b/c/e.md').should.be.false;
    mm.makeRe('A/b/C/*.md', {nocase: true}).test('a/b/c/e.md').should.be.true;
    mm.makeRe('A/b/C/*.MD', {nocase: true}).test('a/b/c/e.md').should.be.true;
  });
});
