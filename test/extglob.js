/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('should');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref;
}

describe('basic extglobs', function () {
  it('should match extglobs:', function () {
    mm.match(['a', 'b', 'c'], '(a|c)').should.eql(['a', 'c']);
    mm.match(['axb'], 'a?(b*)').should.eql([]);
    mm.match(['ax'], '?(a.*|b)').should.eql([]);
    mm.match(['ax'], 'a?(b*)').should.eql([]);
    mm.match(['ax'], 'a?(b*)').should.eql([]);
    mm.match(['yax', 'b'], '?(a*|b)').should.eql(['b']);
    mm.match(['ax'], '?(a*|b)').should.eql(['ax']);
  });

  it('should support matching with extglobs:', function () {
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

