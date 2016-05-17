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
});

