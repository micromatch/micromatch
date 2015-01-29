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
var ref = require('./support/reference');
var mm = require('..');

if ('minimatch' in argv) {
  mm = ref.minimatch;
}
if ('wildmatch' in argv) {
  mm = ref.wildmatch;
}

describe('extglob1a', function () {
  it('should match character classes:', function () {
    mm.match(['a', 'ab'], 'a!(x)').should.eql(['a', 'ab']);
    mm.match(['a'], 'a?(x)').should.eql(['a']);
    mm.match(['ba'], 'a!(x)').should.eql([]);
    mm.match(['ba'], 'a*?(x)').should.eql([]);
    mm.match(['a', 'ab'], 'a*!(x)/b/?(y)/c').should.eql([]);
    mm.match(['ba'], 'a*!(x)').should.eql([]);
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*.!(js)').should.eql(['a.md', 'a.', 'd.js.d']);
  });

  it('failing:', function () {
    mm.match(['ab', 'ba'], 'a?(x)').should.eql([]);
    mm.match(['a', 'ab'], 'a*?(x)').should.eql(['a', 'ab']);
    mm.match(['a', 'ab'], 'a*!(x)').should.eql(['a', 'ab']);
    mm.match(['a', 'x'], 'a*!(x)').should.eql(['a']);
    mm.match(['a', 'x', 'ab', 'ax'], 'a*!(x)').should.eql(['a']);
  });

  it.skip('should match negation patterns on extglobs:', function () {
    mm.makeRe('a*!(x)').should.eql(/^(?:a(?!\.)(?=.)[^/]*?(?:(?!x)[^/]*?))$/);
    mm.makeRe('?(a*|b)').should.eql(/^(?:(?:(?!a*|b)[^/]*?))$/);
  });

  it.skip('failing:', function () {
    mm.makeRe('a*!(x)').should.eql(/^(?:(?=.)a[^/]*?(?:(?!x)[^/]*?))$/);
  });

  it('should match negation patterns on extglobs:', function () {
    mm.makeRe('*.!(js)').should.eql(/^(?:(?!\.)(?=.)[^/]*?\.(?:(?!js)[^/]*?))$/);
  });
})