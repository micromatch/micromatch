/*!
 * micromatch <https://github.com/jonschlinkert/micromatch>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var argv = require('minimist')(process.argv.slice(2));
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}

describe('expand()', function () {
  it('should return an object with information about the glob pattern', function () {
    mm.expand('*').should.be.an.object;
    mm.expand('*').should.have.properties('options', 'glob');
  });

  it('should return a string on the `glob` property:', function () {
    mm.expand('*').glob.should.be.a.string;
    mm.expand('*').glob.should.equal('(?!\\.)(?=.)[^/]*?');
    mm.expand('*.{js,md}').glob.should.equal('(?!\\.)(?=.)[^/]*?.(js|md)');
    mm.expand('*.{js,md}').glob.should.equal('(?!\\.)(?=.)[^/]*?.(js|md)');
    mm.expand('{a,b\\}').glob.should.eql('{a,b}')
  });

  it('should expand extglobs', function () {
    mm.makeRe('?(a*|b)').should.eql(/^(?:[^/](a(?!\.)(?=.)[^/]*?|b))$/);
    mm.expand('?(a*|b)').glob.should.equal('(?:a(?!\\.)(?=.)[^/]*?|b\\/(?!\\.)(?=.)[^/])');
  });
});
