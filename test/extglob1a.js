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
  it.only('should match character classes:', function () {
    console.log(mm.makeRe('a*!(x)'))
    mm.match(['a', 'ab'], 'a*!(x)/b/?(y)/c').should.eql(['a', 'ab']);
    // mm.match(['a', 'ab'], 'a*!(x)').should.eql(['a', 'ab']);
    mm.match(['ba'], 'a*!(x)').should.eql([]);

    mm.match(['a', 'ab'], 'a!(x)').should.eql(['a', 'ab']);
    mm.match(['ba'], 'a!(x)').should.eql([]);

    mm.match(['a', 'ab'], 'a*?(x)').should.eql(['a', 'ab']);
    mm.match(['ba'], 'a*?(x)').should.eql([]);

    mm.match(['a'], 'a?(x)').should.eql(['a']);
    mm.match(['ab', 'ba'], 'a?(x)').should.eql([]);
  });
});
