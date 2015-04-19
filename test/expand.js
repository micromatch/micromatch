/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

describe('expand()', function () {
  describe('errors:', function () {
    it('should throw on undefined args:', function () {
      (function () {
        mm.expand();
      }).should.throw('micromatch.expand(): argument should be a string.');
    });

    it('should throw on bad args:', function () {
      (function () {
        mm.expand({});
      }).should.throw('micromatch.expand(): argument should be a string.');
    });
  });

  it('should return an object with information about the glob pattern', function () {
    mm.expand('*').should.be.an.object;
    mm.expand('*').should.have.properties('options', 'pattern');
  });

  it('should return a string on the `glob` property:', function () {
    mm.expand('*').pattern.should.be.a.string;
    mm.expand('*').pattern.should.equal('(?!\\.)(?=.)[^/]*?');
    mm.expand('*.{js,md}').pattern.should.equal('(?!\\.)(?=.)[^/]*?\\.(js|md)');
    mm.expand('{a,b\\}').pattern.should.eql('{a,b}');
  });

  it('should escape dots:', function () {
    mm.expand('.').pattern.should.equal('\\.');
  });

  it('should expand patterns for file names:', function () {
    mm.expand('*.md').pattern.should.equal('(?!\\.)(?=.)[^/]*?\\.md');
    mm.expand('*.md', {dot: true}).pattern.should.equal('(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?\\.md');
    mm.expand('.*.md').pattern.should.equal('\\.(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?\\.md');
  });

  it('should expand extglobs', function () {
    mm.expand('?(a*|b)').pattern.should.equal('(?:a(?!(?:\\/|^)\\.{1,2}($|\\/))(?=.)[^/]*?|b)?');
  });
});
