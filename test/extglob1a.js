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
    mm.match(['a', 'ab'], 'a*!(x)/b/?(y)/c').should.eql([]);
    mm.match(['a', 'ab'], 'a*!(x)').should.eql(['a', 'ab']);
    mm.match(['ba'], 'a*!(x)').should.eql([]);

    // mm(['a', 'ab'], 'a!(x)').should.eql(['a', 'ab']);
    // mm(['ba'], 'a!(x)').should.eql([]);

    // mm(['a', 'ab'], 'a*?(x)').should.eql(['a', 'ab']);
    // mm(['ba'], 'a*?(x)').should.eql([]);

    // mm(['a'], 'a?(x)').should.eql(['a']);
    // mm(['ab', 'ba'], 'a?(x)').should.eql([]);
  });
});

describe('extglob', function () {
  it('should match negation patterns on extglobs:', function () {
    mm.makeRe('?(a*|b)');
    // mm.makeRe('?(a*|b)');
  });
  it('should match negation patterns on extglobs:', function () {
    mm.makeRe('*.!(js)').should.eql(/^(?:(?!\.)(?=.)[^/]*?((?!js).*?))$/);
    mm.makeRe('*.!(js)').should.eql(/^(?:(?!\.)(?=.)[^/]*?\.(?:(?!js)[^/]*?))$/);
    mm.match(['a.js', 'a.md', 'a.js.js', 'c.js', 'a.', 'd.js.d'], '*.!(js)')//.should.eql(['a.md', 'a.', 'd.js.d']);
  });
  it('should match negation patterns on extglobs:', function () {
    var minimatchRe = /^(?:(?!\.)(?=.)[^/]*?\.(?:(?!js)[^/]*?))$/;
    mm.makeRe('*.!(js)').should.eql(/^(?:(?!\.)(?=.)[^/]*?\.(?!js))$/);
  });
})