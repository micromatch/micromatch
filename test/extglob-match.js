'use strict';

require('should');
var assert = require('assert');
var mm = require('..');

describe('extglob matching', function() {
  it('should match extglobs:', function() {
    mm.match(['a', 'b', 'c'], '(a|c)').should.eql(['a', 'c']);
    mm.match(['axb'], 'a?(b*)').should.eql([]);
    mm.match(['ax'], '?(a.*|b)').should.eql([]);
    mm.match(['ax'], 'a?(b*)').should.eql([]);
    mm.match(['ax'], 'a?(b*)').should.eql([]);
    mm.match(['yax', 'b'], '?(a*|b)').should.eql(['b']);
    mm.match(['ax'], '?(a*|b)').should.eql(['ax']);
  });

  it('should support matching with extglobs:', function() {
    mm.isMatch('foo/abbbb', 'foo/a?(b*)').should.be.true();
    mm.isMatch('abbbb', 'a!(b*)').should.be.false();
    mm.isMatch('foo/abbbb', 'foo/a!(b*)').should.be.false();
    mm.isMatch('abbbb', 'a?(b*)').should.be.true();
    mm.isMatch('abbbb', 'a?(b*)').should.be.true();
    mm.isMatch('abx', 'a?(b*)').should.be.true();
    mm.isMatch('ax', '?(a*|b)').should.be.true();
    mm.isMatch('ax', 'a?(b*)').should.be.false();
    mm.isMatch('ax', 'a?(b*)').should.be.false();
    mm.isMatch('ax', 'a?(b+)').should.be.false();
    mm.isMatch('axb', 'a?(b*)').should.be.false();
    mm.isMatch('axb', 'a?(b*)').should.be.false();
    mm.isMatch('axbbbb', 'a?(b*)').should.be.false();
    mm.isMatch('axbx', 'a?(b*)').should.be.false();
    mm.isMatch('xabbbb', 'a?(b*)').should.be.false();
    mm.isMatch('xbbbb', 'a?(b*)').should.be.false();
    mm.isMatch('xbx', 'a?(b*)').should.be.false();
    mm.isMatch('yax', '?(a*|b)').should.be.false();
  });
});

