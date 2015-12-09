'use strict';

require('should');
var assert = require('assert');
var mm = require('..');

describe('basic extglobs', function() {
  it('should NOT optimize extglobs if `options.noextglob` is `true`:', function() {
    var opts = { noextglob: true };
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a[^/](b(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?)');
    assert.equal(mm.expand('?(a.*|b)', opts).pattern, '(?!\\.)(?=.)[^/](a.(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?|b)');
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a[^/](b(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?)');
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a[^/](b(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?)');
    assert.equal(mm.expand('?(a*|b)', opts).pattern, '(?!\\.)(?=.)[^/](a(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?|b)');
    assert.equal(mm.expand('?(a*|b)', opts).pattern, '(?!\\.)(?=.)[^/](a(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?|b)');
  });

  it('should optimize extglobs if `options.noextglob` is `false`:', function() {
    var opts = { noextglob: false };
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('?(a.*|b)', opts).pattern, '(?:a\\.[^/]*?|b|)');
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('a?(b*)', opts).pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('?(a*|b)', opts).pattern, '(?:a[^/]*?|b|)');
    assert.equal(mm.expand('?(a*|b)', opts).pattern, '(?:a[^/]*?|b|)');
  });

  it('should optimize extglobs if `options.noextglob` is undefined:', function() {
    assert.equal(mm.expand('a?(b*)').pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('?(a.*|b)').pattern, '(?:a\\.[^/]*?|b|)');
    assert.equal(mm.expand('a?(b*)').pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('a?(b*)').pattern, 'a(?:b[^/]*?|)');
    assert.equal(mm.expand('?(a*|b)').pattern, '(?:a[^/]*?|b|)');
    assert.equal(mm.expand('?(a*|b)').pattern, '(?:a[^/]*?|b|)');
  });

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
    mm.isMatch('foo/abbbb', 'foo/a?(b*)').should.be.true;
    mm.isMatch('abbbb', 'a!(b*)').should.be.false;
    mm.isMatch('foo/abbbb', 'foo/a!(b*)').should.be.false;
    mm.isMatch('abbbb', 'a?(b*)').should.be.true;
    mm.isMatch('abbbb', 'a?(b*)').should.be.true;
    mm.isMatch('abx', 'a?(b*)').should.be.true;
    mm.isMatch('ax', '?(a*|b)').should.be.true;
    mm.isMatch('ax', 'a?(b*)').should.be.false;
    mm.isMatch('ax', 'a?(b*)').should.be.false;
    mm.isMatch('ax', 'a?(b+)').should.be.false;
    mm.isMatch('axb', 'a?(b*)').should.be.false;
    mm.isMatch('axb', 'a?(b*)').should.be.false;
    mm.isMatch('axbbbb', 'a?(b*)').should.be.false;
    mm.isMatch('axbx', 'a?(b*)').should.be.false;
    mm.isMatch('xabbbb', 'a?(b*)').should.be.false;
    mm.isMatch('xbbbb', 'a?(b*)').should.be.false;
    mm.isMatch('xbx', 'a?(b*)').should.be.false;
    mm.isMatch('yax', '?(a*|b)').should.be.false;
  });
});

